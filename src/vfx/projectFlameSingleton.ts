import * as THREE from 'three'

let inited = false

let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let material: THREE.ShaderMaterial
let mesh: THREE.Mesh

let flameWrapper: HTMLDivElement | null = null
let targetOpacity = 0
/** Wall-clock second when flame was last attached — local time restarts each hover */
let flameAttachWallSec = 0

const RENDER_WIDTH = 300
const RENDER_HEIGHT = 450
const frustumSize = 5.0

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;

uniform float u_time; uniform float u_seed; uniform vec3 u_color; uniform float u_speed;
uniform float u_baseX; uniform float u_baseY; uniform float u_curveBend;
uniform float u_bulge; uniform float u_taper; uniform float u_maskFeather;
uniform float u_threshold; uniform float u_coreFeather;
uniform float u_wisp_amount; uniform float u_wispEdge; uniform float u_wispCurve;
uniform float u_glowSpread; uniform float u_glowIntensity; uniform float u_globalOpacity;
varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x), mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y); }
float fbm(vec2 p) { float f = 0.0; float amp = 0.5; for(int i = 0; i < 4; i++) { f += amp * noise(p); p *= 2.0; amp *= 0.5; } return f; }

void main() {
  float localY = clamp(vUv.y - u_baseY, 0.0, 1.0);
  float curveOffset = u_curveBend * 4.0 * localY * (1.0 - localY);
  vec2 warpedUv = vec2(vUv.x - u_baseX - curveOffset, vUv.y - u_baseY);

  float shapeWidth = sin(localY * 3.14159) * (u_bulge - localY * u_taper);
  float xDist = abs(warpedUv.x - 0.5) * 2.0;
  float masterMask = smoothstep(shapeWidth, shapeWidth - u_maskFeather, xDist);

  float topFade = clamp(1.2 - localY, 0.0, 1.0);
  float bottomCutoff = step(0.0, warpedUv.y);
  masterMask *= topFade * bottomCutoff;

  vec2 scrolledUv = warpedUv + vec2(0.0, -u_time * u_speed);
  float n = fbm(scrolledUv * 5.0 + vec2(u_seed * 1.73, u_seed * 0.41));
  float coreShape = n * masterMask;
  float coreAlpha = smoothstep(u_threshold, u_threshold + u_coreFeather, coreShape);

  vec2 wispUv = warpedUv + vec2(0.0, -u_time * (u_speed * 1.5));
  float wispNoise = fbm(wispUv * 9.0 + vec2(u_seed * 0.52, u_seed * 1.19));
  float wispLifecycle = pow(sin(localY * 3.14159), u_wispCurve);
  float wispMask = smoothstep(shapeWidth + 0.15, shapeWidth + 0.15 - u_maskFeather, xDist) * bottomCutoff;
  float wispShape = (wispNoise * wispLifecycle) * wispMask;
  float wispAlpha = smoothstep(u_threshold + u_wisp_amount, u_threshold + u_wisp_amount + u_wispEdge, wispShape);

  float hardAlpha = max(coreAlpha, wispAlpha);

  float coreGlow = smoothstep(u_threshold - u_glowSpread, u_threshold, coreShape);
  float wGlow = smoothstep(u_threshold + u_wisp_amount - u_glowSpread, u_threshold + u_wisp_amount, wispShape);
  float auraAlpha = max(coreGlow, wGlow) * u_glowIntensity;

  float finalAlpha = clamp(hardAlpha + auraAlpha, 0.0, 1.0) * u_globalOpacity;

  float innerHeat = smoothstep(u_threshold + 0.05, u_threshold + 0.2, coreShape);
  vec3 hotColor = mix(u_color, vec3(1.0), innerHeat * 0.6);
  gl_FragColor = vec4(mix(u_color, hotColor, hardAlpha), finalAlpha);
}
`

function init() {
  if (inited) return
  inited = true

  scene = new THREE.Scene()
  const aspect = RENDER_WIDTH / RENDER_HEIGHT
  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    10,
  )
  camera.position.z = 1

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(RENDER_WIDTH, RENDER_HEIGHT, false)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2))

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0.0 },
      u_seed: { value: 0.0 },
      u_color: { value: new THREE.Color('#20ffb0') },
      u_speed: { value: 0.067 },
      u_baseX: { value: 0.0 },
      u_baseY: { value: 0.0 },
      u_curveBend: { value: 0.33 },
      u_bulge: { value: 0.9 },
      u_taper: { value: 1.22 },
      u_maskFeather: { value: 0.32 },
      u_threshold: { value: 0.26 },
      u_coreFeather: { value: 0.001 },
      u_wisp_amount: { value: 0.2 },
      u_wispCurve: { value: 3.0 },
      u_wispEdge: { value: 0.026 },
      u_glowSpread: { value: 0.18 },
      u_glowIntensity: { value: 0.45 },
      u_globalOpacity: { value: 0.0 },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(frustumSize * aspect, frustumSize), material)
  mesh.position.set(0, 0, 0)
  scene.add(mesh)

  flameWrapper = document.createElement('div')
  flameWrapper.id = 'flame-wrapper'
  flameWrapper.appendChild(renderer.domElement)
}

export function attachProjectFlameToThumbnail(thumb: HTMLElement, innerCard: HTMLElement) {
  init()
  if (!flameWrapper) return
  if (flameWrapper.parentElement !== thumb) {
    thumb.insertBefore(flameWrapper, innerCard)
  }
  flameAttachWallSec = performance.now() / 1000
  material.uniforms.u_seed.value = Math.random() * 1000
  targetOpacity = 1.0
}

export function detachProjectFlame() {
  targetOpacity = 0.0
}

export function tickProjectFlame(_timeSeconds: number) {
  if (!inited) return
  material.uniforms.u_time.value = performance.now() / 1000 - flameAttachWallSec
  const u = material.uniforms.u_globalOpacity
  u.value += (targetOpacity - u.value) * 0.1
  if (u.value > 0.01) renderer.render(scene, camera)
}

