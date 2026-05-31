/**
 * Bakes a hue-shifted grain layer for multiply compositing on the name plate
 * (the card region without project art). Alpha from paint mask, stretched to fit.
 */
import * as THREE from 'three'
import paintMaskUrl from '../shaders/IMG_0558.webp'

/** Root-relative path from Vite — avoids baking localhost preview URLs into prerendered HTML. */
export const ROSTER_PAINT_MASK_URL = paintMaskUrl

/** Peak alpha in source PNG (8-bit); used to normalize the mask. */
const PAINT_MASK_ALPHA_MAX = 189 / 255

const ROSTER_FRAME_GRAIN_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec3 u_baseColor;
  uniform float u_hueBias;
  uniform float u_overlayStrength;
  uniform sampler2D u_paintMask;

  const float MASK_ALPHA_MAX = ${PAINT_MASK_ALPHA_MAX.toFixed(6)};

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(p.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
    uv.y = 1.0 - uv.y;

    float raw = texture2D(u_paintMask, uv).a / MASK_ALPHA_MAX;
    float mask = pow(clamp(raw, 0.0, 1.0), 0.5);

    vec3 hsv = rgb2hsv(u_baseColor);
    hsv.x = fract(hsv.x + u_hueBias + 0.04);
    hsv.y = clamp(hsv.y * 1.08, 0.0, 1.0);
    hsv.z = clamp(hsv.z * 1.12, 0.0, 1.0);
    vec3 tint = hsv2rgb(hsv);

    float alpha = mask * u_overlayStrength;
    gl_FragColor = vec4(tint, alpha);
  }
`

const vertexShader = /* glsl */ `void main() {
  gl_Position = vec4(position, 1.0);
}`

export type RosterCardFrameGrainBakeOptions = {
  widthCss: number
  heightCss: number
  /** Reference tone under the art (drives hue-shifted multiply tint). */
  baseColorHex?: string
  seed?: number
  overlayStrength?: number
}

/** @deprecated Use RosterCardFrameGrainBakeOptions */
export type RosterCardPaintBakeOptions = RosterCardFrameGrainBakeOptions

const SHADER_REV = 5
const MAX_BAKE_EDGE_PX = 768

let bakeRenderer: THREE.WebGLRenderer | null = null
let bakeScene: THREE.Scene | null = null
let bakeCamera: THREE.OrthographicCamera | null = null
let bakeMesh: THREE.Mesh | null = null
let bakeMaterial: THREE.ShaderMaterial | null = null
let paintMaskTex: THREE.Texture | null = null
let maskReady = false
let shaderOk: boolean | null = null
let shaderRevLoaded = -1
const maskReadyListeners = new Set<() => void>()

function notifyMaskReady() {
  for (const fn of maskReadyListeners)
    fn()
}

export function onRosterPaintMaskReady(fn: () => void): () => void {
  if (maskReady)
    fn()
  maskReadyListeners.add(fn)
  return () => maskReadyListeners.delete(fn)
}

function ensurePaintMaskTexture(): THREE.Texture | null {
  if (paintMaskTex)
    return paintMaskTex
  const loader = new THREE.TextureLoader()
  paintMaskTex = loader.load(
    ROSTER_PAINT_MASK_URL,
    (tex) => {
      tex.wrapS = THREE.ClampToEdgeWrapping
      tex.wrapT = THREE.ClampToEdgeWrapping
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.colorSpace = THREE.NoColorSpace
      tex.needsUpdate = true
      maskReady = true
      notifyMaskReady()
    },
    undefined,
    (err) => {
      console.error('[rosterCardPaintBake] Failed to load paint mask', err)
    },
  )
  return paintMaskTex
}

function disposeRosterPaintBakeGl() {
  bakeMesh?.geometry.dispose()
  bakeMaterial?.dispose()
  bakeRenderer?.dispose()
  bakeRenderer = null
  bakeScene = null
  bakeCamera = null
  bakeMesh = null
  bakeMaterial = null
  shaderOk = null
}

function ensureRosterPaintBakeGl(): boolean {
  if (bakeRenderer && shaderRevLoaded !== SHADER_REV)
    disposeRosterPaintBakeGl()

  if (bakeRenderer)
    return shaderOk === true

  ensurePaintMaskTexture()

  bakeRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  })
  bakeRenderer.setPixelRatio(1)

  bakeScene = new THREE.Scene()
  bakeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  bakeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_baseColor: { value: new THREE.Color('#1a181e') },
      u_hueBias: { value: 0.0 },
      u_overlayStrength: { value: 0.38 },
      u_paintMask: { value: paintMaskTex },
    },
    vertexShader,
    fragmentShader: ROSTER_FRAME_GRAIN_FRAGMENT,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })

  bakeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial)
  bakeScene.add(bakeMesh)

  try {
    bakeRenderer.compile(bakeScene, bakeCamera)
    shaderOk = true
  }
  catch (err) {
    console.error('[rosterCardPaintBake] Shader compile failed', err)
    shaderOk = false
  }

  shaderRevLoaded = SHADER_REV
  return shaderOk === true
}

export function bakeRosterCardFrameGrainImage(opts: RosterCardFrameGrainBakeOptions): string | null {
  const widthCss = opts.widthCss
  const heightCss = opts.heightCss
  if (widthCss < 2 || heightCss < 2)
    return null

  if (!ensurePaintMaskTexture() || !maskReady || !paintMaskTex)
    return null

  if (!ensureRosterPaintBakeGl())
    return null

  if (!bakeRenderer || !bakeMaterial || !bakeScene || !bakeCamera)
    return null

  bakeMaterial.uniforms.u_paintMask.value = paintMaskTex

  const pr = Math.min(window.devicePixelRatio ?? 1, 2)
  let vw = Math.max(4, Math.ceil(widthCss * pr))
  let vh = Math.max(4, Math.ceil(heightCss * pr))
  const scale = Math.min(1, MAX_BAKE_EDGE_PX / Math.max(vw, vh))
  vw = Math.max(4, Math.ceil(vw * scale))
  vh = Math.max(4, Math.ceil(vh * scale))

  bakeRenderer.setSize(vw, vh, false)
  bakeRenderer.setClearColor(0x000000, 0)
  bakeRenderer.setViewport(0, 0, vw, vh)
  bakeRenderer.clear(true, true, true)

  const seed = opts.seed ?? 0
  const base = new THREE.Color(opts.baseColorHex ?? '#1a181e')
  const strength = opts.overlayStrength ?? 0.38

  bakeMaterial.uniforms.u_resolution.value.set(vw, vh)
  bakeMaterial.uniforms.u_baseColor.value.copy(base)
  bakeMaterial.uniforms.u_overlayStrength.value = strength
  bakeMaterial.uniforms.u_hueBias.value = ((seed % 1000) / 1000) * 0.08 - 0.04

  bakeRenderer.render(bakeScene, bakeCamera)
  return bakeRenderer.domElement.toDataURL('image/png')
}

/** Alias for frame-grain bake (multiply overlay). */
export function bakeRosterCardPaintImage(opts: RosterCardPaintBakeOptions): string | null {
  return bakeRosterCardFrameGrainImage(opts)
}

ensurePaintMaskTexture()
