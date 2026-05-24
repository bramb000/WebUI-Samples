import * as THREE from 'three'
import { ALCHEMIST_BOOK_COVER, ALCHEMIST_BOOK_LEAVES } from '../../constants/alchemistBookData'
import {
  bookCoverScrollProgress,
  bookPageScrollProgress,
} from '../../constants/alchemistBookScroll'
import { clearBookPageImageCache } from '../../assets/images/book/bookPageImages'
import { disposeStaticBookParchmentCache } from './bakeStaticBookParchment'
import {
  BOOK_RENDER_ORDER,
  bookStackDepth,
  COVER_FULLY_OPEN_THRESHOLD,
  COVER_HEIGHT,
  COVER_THICKNESS,
  COVER_WIDTH,
  LEAF_BEHIND_COVER_Z,
  LEAF_Z_STEP,
  LEFT_STACK_Z_BEHIND_BACK,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  SPINE_WIDTH,
} from './bookDimensions'
import {
  createBackCoverMaterials,
  createBookCoverTextures,
  createFrontCoverMaterials,
  createPageBlockMaterials,
  createSpineMaterials,
  disposeBookCoverTextures,
} from './createBookCoverTextures'
import { createBookPageTexture } from './createBookTextures'
import { DETECTIVE_BOOK_PAGE_FRAGMENT, DETECTIVE_BOOK_VERTEX } from './detectiveBookShaders'

export type DetectiveBookScene = {
  setProgress: (progress: number) => void
  resize: () => void
  dispose: () => void
}

export type DetectiveBookSceneOptions = {
  /** Snap pages and skip curl / lift when prefers-reduced-motion. */
  reducedMotion?: boolean
}

export function createDetectiveBookScene(
  canvas: HTMLCanvasElement,
  options: DetectiveBookSceneOptions = {},
): DetectiveBookScene {
  const reducedMotion = options.reducedMotion ?? false
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)
  camera.position.set(0, 0, 900)

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'default',
    failIfMajorPerformanceCaveat: false,
  })
  if (!renderer.getContext())
    throw new Error('WebGL context could not be created')
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const bookRoot = new THREE.Group()
  bookRoot.rotation.x = 0.06
  scene.add(bookRoot)

  const leaves: THREE.Group[] = []
  const leafTargetRotations: number[] = []
  let coverTargetRotation = 0
  let animationFrameId = 0

  const onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = 0
    }
    else if (!animationFrameId) {
      animate()
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  function createPageMaterial(texture: THREE.Texture, side: THREE.Side) {
    return new THREE.ShaderMaterial({
      vertexShader: DETECTIVE_BOOK_VERTEX,
      fragmentShader: DETECTIVE_BOOK_PAGE_FRAGMENT,
      side,
      transparent: true,
      depthTest: true,
      depthWrite: true,
      alphaTest: 0.08,
      uniforms: {
        tPage: { value: texture },
        uBendIntensity: { value: 0 },
        uPageWidth: { value: PAGE_WIDTH },
      },
    })
  }

  function coverTurnProgress(): number {
    return Math.abs(frontCoverGroup.rotation.y / Math.PI)
  }

  function setLeafRenderOrder(leaf: THREE.Group, order: number) {
    const base = Math.max(BOOK_RENDER_ORDER.PAGE_MIN, order)
    leaf.renderOrder = base
    const frontMesh = leaf.children[0] as THREE.Mesh
    const backMesh = leaf.children[1] as THREE.Mesh
    frontMesh.renderOrder = base + 1
    backMesh.renderOrder = base
  }

  /** Pages always render above BACK_COVER; front cover still wins when nearly closed. */
  function updateLeafRenderOrder(leaf: THREE.Group, leafIndex: number) {
    const turnProgress = Math.abs(leaf.rotation.y / Math.PI)
    const coverOpen = coverTurnProgress()
    const stackOrder = BOOK_RENDER_ORDER.PAGE_MIN + (leaves.length - 1 - leafIndex)

    if (turnProgress > 0.03 && turnProgress < 0.97) {
      const turning = BOOK_RENDER_ORDER.PAGE_TURNING + leafIndex
      setLeafRenderOrder(leaf, coverOpen > 0.92 ? turning : BOOK_RENDER_ORDER.PAGE_MIN + 20 + leafIndex)
    }
    else if (turnProgress >= 0.97) {
      setLeafRenderOrder(leaf, BOOK_RENDER_ORDER.PAGE_MIN + leafIndex)
    }
    else {
      setLeafRenderOrder(leaf, stackOrder)
    }
  }

  const bookData = ALCHEMIST_BOOK_LEAVES
  const disposables: Array<THREE.Material | THREE.BufferGeometry | THREE.Texture> = []

  const coverTextures = createBookCoverTextures(ALCHEMIST_BOOK_COVER, renderer)
  const stackDepth = bookStackDepth(bookData.length)
  const spineDepth = stackDepth + COVER_THICKNESS * 2
  const stackCenterZ = -COVER_THICKNESS - stackDepth / 2
  const backCoverZ = -COVER_THICKNESS - stackDepth - COVER_THICKNESS / 2

  const pageRig = new THREE.Group()
  bookRoot.add(pageRig)

  const pageBlockGeo = new THREE.BoxGeometry(PAGE_WIDTH * 0.96, PAGE_HEIGHT * 0.96, stackDepth + 1.5)
  const pageBlockMats = createPageBlockMaterials(coverTextures)
  const pageBlock = new THREE.Mesh(pageBlockGeo, pageBlockMats)
  pageBlock.position.set(PAGE_WIDTH / 2, 0, stackCenterZ)
  pageBlock.renderOrder = BOOK_RENDER_ORDER.PAGE_BLOCK
  pageRig.add(pageBlock)
  disposables.push(pageBlockGeo, ...pageBlockMats)

  const spineGeo = new THREE.BoxGeometry(SPINE_WIDTH, COVER_HEIGHT, spineDepth)
  const spineMats = createSpineMaterials(coverTextures)
  const spine = new THREE.Mesh(spineGeo, spineMats)
  spine.position.set(-SPINE_WIDTH / 2, 0, stackCenterZ - COVER_THICKNESS / 2)
  spine.renderOrder = BOOK_RENDER_ORDER.SPINE
  bookRoot.add(spine)
  disposables.push(spineGeo, ...spineMats)

  const backCoverGeo = new THREE.BoxGeometry(COVER_WIDTH, COVER_HEIGHT, COVER_THICKNESS)
  const backCoverMats = createBackCoverMaterials(coverTextures)
  for (const mat of backCoverMats)
    mat.depthWrite = false
  const backCover = new THREE.Mesh(backCoverGeo, backCoverMats)
  backCover.position.set(COVER_WIDTH / 2, 0, backCoverZ)
  backCover.renderOrder = BOOK_RENDER_ORDER.BACK_COVER
  bookRoot.add(backCover)
  disposables.push(backCoverGeo, ...backCoverMats)

  const frontCoverGroup = new THREE.Group()
  bookRoot.add(frontCoverGroup)

  const frontCoverGeo = new THREE.BoxGeometry(COVER_WIDTH, COVER_HEIGHT, COVER_THICKNESS)
  const frontCoverMats = createFrontCoverMaterials(coverTextures)
  const frontCover = new THREE.Mesh(frontCoverGeo, frontCoverMats)
  frontCover.position.set(COVER_WIDTH / 2, 0, COVER_THICKNESS / 2)
  frontCoverGroup.add(frontCover)
  disposables.push(frontCoverGeo, ...frontCoverMats)

  ;[...bookData].reverse().forEach((data, index) => {
    const trueIndex = bookData.length - 1 - index
    const group = new THREE.Group()

    const geo = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 32, 1)
    geo.translate(PAGE_WIDTH / 2, 0, 0)

    const frontTex = createBookPageTexture(data.front, false, renderer)
    const frontMat = createPageMaterial(frontTex, THREE.FrontSide)
    const frontMesh = new THREE.Mesh(geo, frontMat)

    const backTex = createBookPageTexture(data.back, true, renderer)
    const backMat = createPageMaterial(backTex, THREE.BackSide)
    const backMesh = new THREE.Mesh(geo, backMat)
    backMesh.position.z = -0.5

    group.add(frontMesh, backMesh)
    group.position.z = LEAF_BEHIND_COVER_Z + trueIndex * -LEAF_Z_STEP

    pageRig.add(group)
    leaves.push(group)
    leafTargetRotations.push(0)

    disposables.push(geo, frontMat, backMat, frontTex, backTex)
  })

  leaves.reverse()
  leaves.forEach((leaf, i) => updateLeafRenderOrder(leaf, i))

  function applyScrollProgress(progress: number) {
    const coverP = bookCoverScrollProgress(progress)
    coverTargetRotation = -Math.PI * coverP

    const pageP = bookPageScrollProgress(progress)
    const segmentSize = 1 / bookData.length
    leaves.forEach((_, i) => {
      const pageStart = i * segmentSize
      const pageEnd = pageStart + segmentSize
      if (pageP <= pageStart) {
        leafTargetRotations[i] = 0
      }
      else if (pageP >= pageEnd) {
        leafTargetRotations[i] = -Math.PI
      }
      else {
        const localProgress = (pageP - pageStart) / segmentSize
        leafTargetRotations[i] = -Math.PI * localProgress
      }
    })
  }

  function resize() {
    const parent = canvas.parentElement
    const w = parent?.clientWidth ?? window.innerWidth
    const h = parent?.clientHeight ?? window.innerHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h, false)
  }

  function animate() {
    if (document.hidden)
      return
    animationFrameId = requestAnimationFrame(animate)

    const motionLerp = reducedMotion ? 1 : 0.08

    frontCoverGroup.rotation.y += (coverTargetRotation - frontCoverGroup.rotation.y) * motionLerp
    const coverOpen = coverTurnProgress()
    const coverFullyOpen = coverOpen >= COVER_FULLY_OPEN_THRESHOLD
    const coverOrder = coverFullyOpen
      ? BOOK_RENDER_ORDER.FRONT_COVER_OPEN
      : BOOK_RENDER_ORDER.FRONT_COVER_CLOSED
    frontCoverGroup.renderOrder = coverOrder
    frontCover.renderOrder = coverOrder
    for (const mat of frontCoverMats)
      mat.depthWrite = !coverFullyOpen

    const backStackBaseZ = backCoverZ - COVER_THICKNESS / 2 - LEFT_STACK_Z_BEHIND_BACK

    leaves.forEach((leaf, i) => {
      leaf.rotation.y += (leafTargetRotations[i]! - leaf.rotation.y) * motionLerp

      const turnProgress = Math.abs(leaf.rotation.y / Math.PI)
      const bend = reducedMotion ? 0 : Math.sin(turnProgress * Math.PI)

      const zRight = LEAF_BEHIND_COVER_Z - i * LEAF_Z_STEP
      const zLeft = backStackBaseZ - (leaves.length - 1 - i) * LEAF_Z_STEP
      const zLift = reducedMotion ? 0 : bend * 10
      let z = zRight * (1 - turnProgress) + zLeft * turnProgress + zLift

      if (coverOpen < 0.98 && turnProgress < 0.04) {
        z = Math.min(z, LEAF_BEHIND_COVER_Z - i * LEAF_Z_STEP - 2)
      }

      leaf.position.z = z

      const frontMat = (leaf.children[0] as THREE.Mesh).material as THREE.ShaderMaterial
      const backMat = (leaf.children[1] as THREE.Mesh).material as THREE.ShaderMaterial
      frontMat.uniforms.uBendIntensity!.value = bend
      backMat.uniforms.uBendIntensity!.value = bend

      updateLeafRenderOrder(leaf, i)
    })

    pageBlock.visible = coverOpen < 0.08

    renderer.sortObjects = true
    renderer.render(scene, camera)
  }

  resize()
  applyScrollProgress(0)
  animate()

  return {
    setProgress: (p: number) => {
      applyScrollProgress(Math.max(0, Math.min(1, p)))
    },
    resize,
    dispose: () => {
      document.removeEventListener('visibilitychange', onVisibilityChange)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      for (const d of disposables)
        d.dispose()
      disposeBookCoverTextures(coverTextures)
      scene.clear()
      disposeStaticBookParchmentCache()
      clearBookPageImageCache()
    },
  }
}
