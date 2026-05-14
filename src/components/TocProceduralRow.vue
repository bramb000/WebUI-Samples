<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import tocBookmarkFrag from '../shaders/tocBookmark.frag?raw'

/**
 * Procedural uniforms mirror `src/vfx/chiselFrameOverlay.ts` (CHISEL_FRAGMENT).
 * Slider overrides you care about (density / depth) stay explicit; border width and
 * organic amplitude are recomputed each resize like the card overlay.
 */

const props = withDefaults(
  defineProps<{
    label: string
    active: boolean
    accentRoot?: HTMLElement | null
  }>(),
  { accentRoot: null },
)

const emit = defineEmits<{
  pick: []
}>()

const rootRef = ref<HTMLButtonElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let raf = 0
let resizeObs: ResizeObserver | null = null
let textCanvas: HTMLCanvasElement | null = null
let textTexture: THREE.CanvasTexture | null = null
let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let mesh: THREE.Mesh | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let clock: THREE.Clock | null = null
let threeReady = false

const vertexShader = /* glsl */ `void main() {
  gl_Position = vec4(position, 1.0);
}`

/** Fixed procedural “base hue” for the TOC bookmark (matches demo #00ffcc). */
const TOC_BOOKMARK_BASE_HUE = '#00ffcc'

function parseTextColor(): string {
  const root = props.accentRoot ?? document.documentElement
  const raw = getComputedStyle(root).getPropertyValue('--color-text').trim()
  return raw || '#ebe6e0'
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const out: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (ctx.measureText(test).width > maxW && cur) {
      out.push(cur)
      cur = w
    }
    else {
      cur = test
    }
  }
  if (cur)
    out.push(cur)
  return out.length ? out : [text]
}

function drawTextMask(bufW: number, bufH: number, label: string, cssW: number, fontFamily: string) {
  if (!textCanvas || !textTexture || !threeReady || !material)
    return

  textCanvas.width = Math.max(8, Math.floor(bufW))
  textCanvas.height = Math.max(8, Math.floor(bufH))

  const ctx = textCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return
  ctx.clearRect(0, 0, textCanvas.width, textCanvas.height)

  const fontPx = Math.max(11, Math.round(11 * (textCanvas.height / 36)))
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  const letterPx = Math.max(0.5, fontPx * 0.11)
  ctx.letterSpacing = `${letterPx}px`
  ctx.font = `800 ${fontPx}px ${fontFamily}`

  /* 8px grid: 16px gutter + 16px safe space clear of bookmark cutout (doubled from prior 8+8) */
  const padLeftCss = 32
  const padRightCss = 8
  const ratio = textCanvas.width / Math.max(cssW, 1)
  const xPad = Math.round(padLeftCss * ratio)
  const xPadRight = Math.round(padRightCss * ratio)
  const maxTextW = Math.max(32, textCanvas.width - xPad - xPadRight)
  const lines = wrapLines(ctx, label.toUpperCase(), maxTextW)
  const lh = fontPx * 1.42
  const block = Math.max(lh * lines.length, lh)
  let yStart = (textCanvas.height - block) * 0.5 + lh * 0.48

  for (const ln of lines) {
    ctx.fillText(ln, xPad, yStart)
    yStart += lh
  }

  textTexture.needsUpdate = true
}

function syncSizeAndRender() {
  if (!threeReady || !renderer || !material || !canvasRef.value || !rootRef.value)
    return

  const el = rootRef.value
  const w = Math.max(64, Math.floor(el.clientWidth))
  const h = Math.max(40, Math.floor(el.clientHeight))
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

  renderer.setPixelRatio(dpr)
  renderer.setSize(w, h, true)

  const bw = renderer.domElement.width
  const bh = renderer.domElement.height
  material.uniforms.u_resolution!.value.set(bw, bh)
  material.uniforms.u_color!.value.set(TOC_BOOKMARK_BASE_HUE)
  material.uniforms.u_textColor!.value.set(parseTextColor())
  material.uniforms.u_isActive!.value = props.active ? 1.0 : 0.0

  const shortPx = Math.min(w * dpr, h * dpr)
  const borderPx = 3.1
  const borderNorm = Math.min(0.07, (borderPx * 2) / Math.max(shortPx, 1))
  material.uniforms.u_borderWidth!.value = borderNorm
  const organicPx = 5.5
  const organicNorm = Math.min(0.11, (organicPx * 2) / Math.max(shortPx, 1))
  material.uniforms.u_organicAmp!.value = organicNorm

  const fontFamily = getComputedStyle(el).fontFamily || 'system-ui, sans-serif'
  drawTextMask(bw, bh, props.label, w, fontFamily)
  renderer.render(scene!, camera!)
}

function loop() {
  if (!threeReady || !renderer || !material || !scene || !camera || !clock) {
    raf = 0
    return
  }
  if (props.active)
    material.uniforms.u_time!.value = clock.getElapsedTime()
  renderer.render(scene, camera)
  raf = requestAnimationFrame(loop)
}

function stopLoop() {
  cancelAnimationFrame(raf)
  raf = 0
}

function startLoop() {
  stopLoop()
  raf = requestAnimationFrame(loop)
}

function disposeThree() {
  stopLoop()
  resizeObs?.disconnect()
  resizeObs = null

  clock = null
  if (textTexture) {
    textTexture.dispose()
    textTexture = null
  }
  textCanvas = null
  if (material) {
    material.dispose()
    material = null
  }
  if (mesh) {
    mesh.geometry.dispose()
    mesh = null
  }
  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  threeReady = false
}

async function initThree() {
  await nextTick()
  const cn = canvasRef.value
  if (!cn || threeReady)
    return

  textCanvas = document.createElement('canvas')
  textTexture = new THREE.CanvasTexture(textCanvas)
  textTexture.minFilter = THREE.LinearFilter
  textTexture.magFilter = THREE.LinearFilter
  textTexture.flipY = false

  renderer = new THREE.WebGLRenderer({
    canvas: cn,
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
    powerPreference: 'low-power',
  })
  renderer.setClearColor(0x000000, 0)

  clock = new THREE.Clock(true)
  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: tocBookmarkFrag,
    uniforms: {
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_time: { value: 0 },
      u_isActive: { value: props.active ? 1.0 : 0.0 },
      u_color: { value: new THREE.Color(TOC_BOOKMARK_BASE_HUE) },
      u_textColor: { value: new THREE.Color(parseTextColor()) },
      u_borderWidth: { value: 0.03 },
      u_wobble: { value: 0.01 },
      u_chiselDepth: { value: 0.5 },
      u_chiselDensity: { value: 10.26 },
      u_chiselChaos: { value: 1.0 },
      u_densityVar: { value: 0.896 },
      u_depthEffect: { value: 0.164 },
      u_hoverFlameState: { value: 0 },
      u_organicAmp: { value: 0.065 },
      u_textMask: { value: textTexture },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
  })

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  scene.add(mesh)

  threeReady = true

  if (rootRef.value) {
    resizeObs = new ResizeObserver(() => syncSizeAndRender())
    resizeObs.observe(rootRef.value)
  }

  syncSizeAndRender()
  if (props.active)
    startLoop()
}

watch(
  () => props.active,
  () => {
    if (!threeReady || !material)
      return
    material.uniforms.u_isActive!.value = props.active ? 1.0 : 0.0
    syncSizeAndRender()
    if (props.active)
      startLoop()
    else
      stopLoop()
  },
)

watch(
  () => [props.label, props.accentRoot] as const,
  () => {
    if (threeReady)
      syncSizeAndRender()
  },
)

onBeforeUnmount(() => {
  disposeThree()
})

onMounted(async () => {
  await nextTick()
  await initThree()
})
</script>

<template>
  <button
    ref="rootRef"
    type="button"
    class="toc-proc-row"
    :aria-current="active ? 'location' : undefined"
    :aria-label="label"
    @click="emit('pick')"
  >
    <canvas
      ref="canvasRef"
      class="toc-proc-row__canvas"
      aria-hidden="true"
    />
  </button>
</template>

<style scoped>
.toc-proc-row {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  line-height: 1.42;
  min-height: 40px;
  padding: 8px 8px 8px 32px;
  border: none;
  border-radius: 0;
  cursor: pointer;
  background: transparent;
  overflow: hidden;
  transition: background 110ms var(--ease-te-snap, ease);
  overflow-wrap: anywhere;
}

.toc-proc-row__canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
}

.toc-proc-row:not([aria-current='location']):hover {
  background: color-mix(in srgb, var(--color-accent) 8%, transparent 92%);
}

.toc-proc-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 8px;
}
</style>
