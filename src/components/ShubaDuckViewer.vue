<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { captureVfxRenderStatus } from '../analytics'
import { CASE_INSIGHT_THEME } from '../constants/caseInsightTheme'
import {
  bakeChiselRimImage,
  CARD_BLEED_PX,
  CARD_ORGANIC_AMP_PX,
  CHISEL_PLATE_CORNER_RADIUS_CSS,
} from '../vfx/chiselRimBake'
import { resolveCssLengthPx } from '../vfx/resolveCssColorToHex'

const props = withDefaults(
  defineProps<{
    /** Uniform model scale (hero uses 0.75 — 3× the prior 0.25). */
    scale?: number
    /** Cream chisel frame between feet (behind) and head (in front). */
    showFrame?: boolean
  }>(),
  { scale: 1, showFrame: true },
)

const MODEL_RESOURCE_PATH = '/models/shuba-duck/'
const DUCK_ANIMATION_NAME = 'LironShuba'
/** Visible cream band thickness punched from the baked plate (CSS px). */
const FRAME_BAND_PX = 21

/** Shuba duck body + cel outline only — excludes LironAtlas human streamer mesh. */
const DUCK_MATERIAL_NAMES = new Set(['Shuba', 'Outline'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const popCanvasRef = ref<HTMLCanvasElement | null>(null)
const frameRef = ref<HTMLElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)
const frameRimUrl = ref<string | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let mixer: THREE.AnimationMixer | null = null
let modelRoot: THREE.Group | null = null
let clock = new THREE.Clock()
let frameId = 0
let resizeObserver: ResizeObserver | null = null
let frameResizeObserver: ResizeObserver | null = null
let rebakeTimer = 0
let cancelled = false

const frameStyle = computed(() => {
  if (!frameRimUrl.value)
    return undefined
  return {
    '--chisel-rim-image': `url("${frameRimUrl.value}")`,
    '--chisel-bleed': `${CARD_BLEED_PX}px`,
    '--duck-frame-band': `${FRAME_BAND_PX}px`,
  } as Record<string, string>
})

function meshMaterials(mesh: THREE.Mesh): THREE.Material[] {
  if (!mesh.material)
    return []
  return Array.isArray(mesh.material) ? mesh.material : [mesh.material]
}

function isDuckMesh(mesh: THREE.Mesh): boolean {
  return meshMaterials(mesh).some((material) => DUCK_MATERIAL_NAMES.has(material.name))
}

/** Drop human (LironAtlas) streamer geo, ground shadow, and non-duck helpers. */
function hideNonDuckParts(model: THREE.Group) {
  model.traverse((object) => {
    if (/shadow|liron\.atlas/i.test(object.name)) {
      object.visible = false
      return
    }

    const mesh = object as THREE.Mesh
    if (!mesh.isMesh)
      return

    mesh.visible = isDuckMesh(mesh)
  })
}

function getDuckBounds(root: THREE.Object3D) {
  const box = new THREE.Box3()
  let hasMesh = false

  root.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh || !mesh.visible || !isDuckMesh(mesh))
      return
    box.expandByObject(mesh)
    hasMesh = true
  })

  if (!hasMesh)
    box.setFromObject(root)

  return box
}

function frameDuck(duck: THREE.Object3D, cameraRef: THREE.PerspectiveCamera) {
  const box = getDuckBounds(duck)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z)
  const fitOffset = 1.18
  const fov = THREE.MathUtils.degToRad(cameraRef.fov)
  const distance = (maxDim * fitOffset) / (2 * Math.tan(fov / 2))

  cameraRef.position.set(center.x + distance * 0.1, center.y + size.y * 0.05, center.z + distance)
  cameraRef.lookAt(center.x, center.y + size.y * 0.02, center.z)
  cameraRef.near = Math.max(0.01, distance / 100)
  cameraRef.far = distance * 100
  cameraRef.updateProjectionMatrix()
}

function rebakeFrame(attempt = 0) {
  if (cancelled || !props.showFrame)
    return

  const el = frameRef.value
  if (!el || !el.isConnected) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeFrame(attempt + 1))
    return
  }

  // Use layout size (not transformed getBoundingClientRect) for a stable bake.
  const widthCss = el.offsetWidth
  const heightCss = el.offsetHeight
  if (widthCss < 2 || heightCss < 2) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeFrame(attempt + 1))
    return
  }

  const url = bakeChiselRimImage({
    widthCss,
    heightCss,
    colorHex: CASE_INSIGHT_THEME.cream.surface,
    bleedPx: CARD_BLEED_PX,
    depthEffect: 0.164,
    panelFill: true,
    monotoneFill: true,
    organicAmpPx: CARD_ORGANIC_AMP_PX,
    borderPx: 8,
    cornerRadiusCss: resolveCssLengthPx(
      el,
      'var(--dl-border-radius)',
      CHISEL_PLATE_CORNER_RADIUS_CSS,
    ),
  })

  if (!url) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeFrame(attempt + 1))
    return
  }

  frameRimUrl.value = url
}

function scheduleRebakeFrame() {
  if (rebakeTimer)
    window.clearTimeout(rebakeTimer)
  rebakeTimer = window.setTimeout(() => {
    rebakeTimer = 0
    rebakeFrame()
  }, 100)
}

function syncPopCanvas() {
  const source = canvasRef.value
  const pop = popCanvasRef.value
  if (!source || !pop || !props.showFrame)
    return

  const width = source.width
  const height = source.height
  if (width < 2 || height < 2)
    return

  if (pop.width !== width || pop.height !== height) {
    pop.width = width
    pop.height = height
  }

  const ctx = pop.getContext('2d')
  if (!ctx)
    return

  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0)
}

function resize() {
  const canvas = canvasRef.value
  const host = rootRef.value
  if (!canvas || !host || !renderer || !camera)
    return

  const { width, height } = host.getBoundingClientRect()
  if (width < 2 || height < 2)
    return

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
  renderer.setPixelRatio(dpr)
  renderer.setSize(width, height, false)
  camera.aspect = width / height
  camera.updateProjectionMatrix()

  if (modelRoot)
    frameDuck(modelRoot, camera)
}

function tick() {
  frameId = requestAnimationFrame(tick)
  if (!renderer || !scene || !camera)
    return

  const delta = clock.getDelta()
  mixer?.update(delta)
  renderer.render(scene, camera)
  syncPopCanvas()
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh
    if (!mesh.isMesh)
      return
    mesh.geometry?.dispose()
    for (const material of meshMaterials(mesh)) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture)
          value.dispose()
      }
      material.dispose()
    }
  })
}

function teardown() {
  cancelled = true
  cancelAnimationFrame(frameId)
  resizeObserver?.disconnect()
  resizeObserver = null
  frameResizeObserver?.disconnect()
  frameResizeObserver = null
  if (rebakeTimer) {
    window.clearTimeout(rebakeTimer)
    rebakeTimer = 0
  }

  if (mixer) {
    mixer.stopAllAction()
    mixer = null
  }

  if (scene) {
    for (const child of [...scene.children])
      disposeObject(child)
    scene = null
  }

  renderer?.dispose()
  renderer = null
  camera = null
  modelRoot = null
  frameRimUrl.value = null
  clock = new THREE.Clock()
}

async function init() {
  const canvas = canvasRef.value
  const host = rootRef.value
  if (!canvas || !host || cancelled)
    return

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(32, 1, 0.01, 200)
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
    // Needed so the head pop-out canvas can sample each frame.
    preserveDrawingBuffer: true,
    powerPreference: 'high-performance',
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.style.background = 'transparent'

  const loader = new GLTFLoader()
  loader.setPath(MODEL_RESOURCE_PATH)

  const gltf = await new Promise<GLTF>((resolve, reject) => {
    loader.load(
      'scene.gltf',
      resolve,
      undefined,
      reject,
    )
  })

  if (cancelled)
    return

  hideNonDuckParts(gltf.scene)
  modelRoot = gltf.scene
  modelRoot.scale.setScalar(props.scale)
  scene.add(modelRoot)

  const clip =
    gltf.animations.find((animation) => animation.name === DUCK_ANIMATION_NAME) ??
    gltf.animations[0]

  if (clip) {
    mixer = new THREE.AnimationMixer(modelRoot)
    const action = mixer.clipAction(clip)
    action.reset()
    action.setLoop(THREE.LoopRepeat, Infinity)
    action.play()
  }

  frameDuck(modelRoot, camera)
  resize()
  tick()
  captureVfxRenderStatus('hero_shuba_duck', { mode: 'webgl' })

  resizeObserver = new ResizeObserver(() => resize())
  resizeObserver.observe(host)

  if (props.showFrame) {
    await nextTick()
    rebakeFrame()
    if (frameRef.value) {
      frameResizeObserver = new ResizeObserver(scheduleRebakeFrame)
      frameResizeObserver.observe(frameRef.value)
    }
  }
}

onMounted(() => {
  void init().catch((error) => {
    console.error('[ShubaDuckViewer] Failed to load duck model', error)
  })
})

onBeforeUnmount(teardown)
</script>

<template>
  <div ref="rootRef" class="shuba-duck-viewer" aria-hidden="true">
    <canvas ref="canvasRef" class="shuba-duck-viewer__canvas" />
    <div
      v-if="showFrame"
      ref="frameRef"
      class="shuba-duck-viewer__frame"
      :style="frameStyle"
    />
    <canvas
      v-if="showFrame"
      ref="popCanvasRef"
      class="shuba-duck-viewer__pop"
    />
  </div>
</template>

<style scoped>
.shuba-duck-viewer {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  box-shadow: none;
  overflow: visible;
  line-height: 0;
  perspective: 720px;
  perspective-origin: 42% 55%;
  pointer-events: none;
}

.shuba-duck-viewer__canvas {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
  pointer-events: none;
}

/* Prebaked cream chisel plate, hollowed + tilted in perspective */
.shuba-duck-viewer__frame {
  position: absolute;
  inset: 14.45% 10.3% 16.25% 12%;
  z-index: 2;
  border: none;
  border-radius: 0;
  background: transparent;
  pointer-events: none;
  transform:
    rotateY(-26deg)
    rotateX(6deg)
    rotateZ(7deg)
    translate3d(-2%, 2%, 0);
  transform-style: preserve-3d;
}

.shuba-duck-viewer__frame::before {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--chisel-bleed, 16px));
  background-image: var(--chisel-rim-image, none);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  /* Punch a hole so the duck body shows through the cream plate */
  padding: var(--duck-frame-band, 21px);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

/* Top of duck only — redrawn each frame so the hat breaks in front of the frame */
.shuba-duck-viewer__pop {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  pointer-events: none;
  /* Keep roughly hat + upper head; hide torso/feet so bottom bar covers them */
  clip-path: inset(0 0 48% 0);
}
</style>
