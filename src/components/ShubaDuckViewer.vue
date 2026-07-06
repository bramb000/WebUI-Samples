<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { captureVfxRenderStatus } from '../analytics'

const props = withDefaults(
  defineProps<{
    /** Uniform model scale (hero uses 0.75 — 3× the prior 0.25). */
    scale?: number
  }>(),
  { scale: 1 },
)

const MODEL_RESOURCE_PATH = '/models/shuba-duck/'
const DUCK_ANIMATION_NAME = 'LironShuba'

/** Shuba duck body + cel outline only — excludes LironAtlas human streamer mesh. */
const DUCK_MATERIAL_NAMES = new Set(['Shuba', 'Outline'])

const canvasRef = ref<HTMLCanvasElement | null>(null)
const rootRef = ref<HTMLElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let mixer: THREE.AnimationMixer | null = null
let modelRoot: THREE.Group | null = null
let clock = new THREE.Clock()
let frameId = 0
let resizeObserver: ResizeObserver | null = null
let cancelled = false

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
  </div>
</template>

<style scoped>
.shuba-duck-viewer {
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
}

.shuba-duck-viewer__canvas {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  box-shadow: none;
}
</style>
