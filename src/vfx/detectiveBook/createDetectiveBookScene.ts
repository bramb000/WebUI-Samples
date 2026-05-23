import * as THREE from 'three'
import { ALCHEMIST_BOOK_SPREADS } from '../../constants/alchemistBookData'
import { clearBookPageImageCache } from '../../assets/images/book/bookPageImages'
import { disposeStaticBookParchmentCache } from './bakeStaticBookParchment'
import { createBookPageTexture } from './createBookTextures'
import { DETECTIVE_BOOK_PAGE_FRAGMENT, DETECTIVE_BOOK_VERTEX } from './detectiveBookShaders'

const PAGE_WIDTH = 320
const PAGE_HEIGHT = 480

export type DetectiveBookScene = {
  setProgress: (progress: number) => void
  resize: () => void
  dispose: () => void
}

export function createDetectiveBookScene(canvas: HTMLCanvasElement): DetectiveBookScene {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)
  camera.position.set(0, 0, 900)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const leaves: THREE.Group[] = []
  const targetRotations: number[] = []
  let animationFrameId = 0

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

  /** Stable stack draw order + boost for the leaf currently turning. */
  function updateLeafRenderOrder(leaf: THREE.Group, leafIndex: number) {
    const turnProgress = Math.abs(leaf.rotation.y / Math.PI)
    const stackOrder = (leaves.length - 1 - leafIndex) * 10

    if (turnProgress > 0.03 && turnProgress < 0.97) {
      leaf.renderOrder = 200 + leafIndex
    }
    else if (turnProgress >= 0.97) {
      leaf.renderOrder = leafIndex * 10
    }
    else {
      leaf.renderOrder = stackOrder
    }
  }

  const bookData = ALCHEMIST_BOOK_SPREADS
  const disposables: Array<THREE.Material | THREE.BufferGeometry | THREE.Texture> = []

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

    frontMesh.renderOrder = 1
    backMesh.renderOrder = 0

    group.add(frontMesh, backMesh)
    group.position.z = trueIndex * -2

    scene.add(group)
    leaves.push(group)
    targetRotations.push(0)

    disposables.push(geo, frontMat, backMat, frontTex, backTex)
  })

  leaves.reverse()

  leaves.forEach((leaf, i) => updateLeafRenderOrder(leaf, i))

  function applyScrollProgress(progress: number) {
    const segmentSize = 1 / bookData.length
    leaves.forEach((_, i) => {
      const pageStart = i * segmentSize
      const pageEnd = pageStart + segmentSize
      if (progress <= pageStart) {
        targetRotations[i] = 0
      }
      else if (progress >= pageEnd) {
        targetRotations[i] = -Math.PI
      }
      else {
        const localProgress = (progress - pageStart) / segmentSize
        targetRotations[i] = -Math.PI * localProgress
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
    animationFrameId = requestAnimationFrame(animate)

    leaves.forEach((leaf, i) => {
      leaf.rotation.y += (targetRotations[i]! - leaf.rotation.y) * 0.08

      const turnProgress = Math.abs(leaf.rotation.y / Math.PI)
      const bend = Math.sin(turnProgress * Math.PI)

      const zRight = -i * 2
      const zLeft = -(leaves.length - 1 - i) * 2
      const zLift = bend * 10
      leaf.position.z = zRight * (1 - turnProgress) + zLeft * turnProgress + zLift

      const frontMat = (leaf.children[0] as THREE.Mesh).material as THREE.ShaderMaterial
      const backMat = (leaf.children[1] as THREE.Mesh).material as THREE.ShaderMaterial
      frontMat.uniforms.uBendIntensity!.value = bend
      backMat.uniforms.uBendIntensity!.value = bend

      updateLeafRenderOrder(leaf, i)
    })

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
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      for (const d of disposables)
        d.dispose()
      scene.clear()
      disposeStaticBookParchmentCache()
      clearBookPageImageCache()
    },
  }
}
