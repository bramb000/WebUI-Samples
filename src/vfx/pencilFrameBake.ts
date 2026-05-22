/**
 * Static PNG bake: flat panel fill + single hand-drawn frame stroke.
 * Straight edges with corner tapers, graphite grain, and subtle asymmetry per bake.
 */
import * as THREE from 'three'

export type PencilBakeVariant = 'frame' | 'hline' | 'vline'

/** Frame stroke outline — rectangle (panels) or ellipse (TOC highlight). */
export type PencilFrameShape = 'rect' | 'ellipse'

export type PencilFrameBakeOptions = {
  widthCss: number
  heightCss: number
  strokeColorHex: string
  fillColorHex: string
  bleedPx?: number
  seed?: number
  variant?: PencilBakeVariant
  /** Frame variant only: omit interior fill (stroke-only ring). */
  strokeOnly?: boolean
  /** Frame variant only. Default `rect`. */
  frameShape?: PencilFrameShape
}

export const PENCIL_FRAME_BLEED_PX = 14
export const PENCIL_DIVIDER_BLEED_PX = 8

/** Bold marker weight (CSS-pixel-relative). */
const PENCIL_STROKE_BOLD = 1.12

const MAX_BAKE_EDGE_PX = 1024

const PENCIL_FRAME_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_vpOrigin;
  uniform vec3 u_strokeColor;
  uniform vec3 u_fillColor;
  uniform vec2 u_innerHalf;
  uniform vec2 u_pCardCenter;
  uniform vec4 u_expandCss;
  uniform vec4 u_drawCss;
  uniform float u_strokeNorm;
  uniform float u_bakeMode;
  uniform float u_strokeOnly;
  uniform float u_frameEllipse;
  uniform vec3 u_seed;

  const float PI = 3.14159265;

  float hash11(float p) {
    return fract(sin(p * 127.1) * 43758.5453123);
  }

  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash11(dot(i, vec2(1.0, 57.0)));
    float b = hash11(dot(i + vec2(1.0, 0.0), vec2(1.0, 57.0)));
    float c = hash11(dot(i + vec2(0.0, 1.0), vec2(1.0, 57.0)));
    float d = hash11(dot(i + vec2(1.0, 1.0), vec2(1.0, 57.0)));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float pencilGrain(vec2 uv) {
    float g0 = vnoise(uv * vec2(38.0, 14.0) + u_seed.xy);
    float g1 = vnoise(uv * vec2(96.0, 40.0) - u_seed.yz);
    float g2 = vnoise(uv * vec2(180.0, 72.0) + u_seed.zx);
    return mix(mix(g0, g1, 0.5), g2, 0.35);
  }

  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  vec2 warpHandDrawn(vec2 q) {
    float rot = (hash11(u_seed.x * 1.73) - 0.5) * 0.028;
    float cs = cos(rot);
    float sn = sin(rot);
    vec2 r = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);
    float skewX = (hash11(u_seed.y + 4.1) - 0.5) * 0.014;
    float skewY = (hash11(u_seed.z + 9.3) - 0.5) * 0.014;
    r.x += r.y * skewX;
    r.y += r.x * skewY;
    return r;
  }

  vec2 cornerPos(vec2 signXY, float cornerId) {
    vec2 base = u_innerHalf * signXY;
    float nudge = u_strokeNorm * 4.2;
    vec2 jitter = hash22(vec2(cornerId, u_seed.x + u_seed.y * 0.31)) * nudge;
    float stretchX = 1.0 + (hash11(cornerId + u_seed.z) - 0.5) * 0.05;
    float stretchY = 1.0 + (hash11(cornerId + u_seed.z + 19.0) - 0.5) * 0.05;
    return base * vec2(stretchX, stretchY) + jitter;
  }

  vec2 pickStroke(vec2 best, vec2 next) {
    return next.x > best.x ? next : best;
  }

  /** Single straight segment; bold mid-span, tapered toward both ends (corners). */
  vec2 taperedSegment(vec2 p, vec2 a, vec2 b) {
    vec2 ba = b - a;
    float len2 = dot(ba, ba);
    if (len2 < 1e-8)
      return vec2(0.0);

    float segLen = sqrt(len2);
    float h = clamp(dot(p - a, ba) / len2, -0.03, 1.03);
    float t = clamp(h, 0.0, 1.0);
    vec2 closest = a + ba * t;
    float dist = length(p - closest);

    float along = sin(t * PI);
    along = pow(max(along, 0.0), 0.62);
    float halfW = u_strokeNorm * mix(0.22, 1.0, along);

    float normDist = dist / max(halfW, 1e-5);
    float rim = dist - halfW;
    float aa = max(fwidth(rim), 1e-5);

    float alongMask = smoothstep(-0.01, 0.05, t) * smoothstep(1.01, 0.95, t);
    float radialMask = smoothstep(1.1, 0.92, normDist);
    float strokeMask = (1.0 - smoothstep(0.0, aa * 1.1, rim)) * alongMask * radialMask;

    if (strokeMask < 0.002)
      return vec2(0.0);

    vec2 grainUv = vec2(t * segLen / u_strokeNorm * 1.4, normDist * 3.2);
    float graphite = pencilGrain(grainUv);
    float speck = vnoise(grainUv * vec2(210.0, 88.0) + u_seed.zx);
    float edgeMask = smoothstep(0.4, 1.0, normDist) * strokeMask;

    float edgeRoughIn = min(0.0, (pencilGrain(vec2(t * segLen / u_strokeNorm, normDist * 2.0)) - 0.5) * aa * 1.4);
    float cov = (1.0 - smoothstep(0.0, aa * 1.1, rim + edgeRoughIn)) * strokeMask;

    float densityInner = mix(0.82, 1.0, graphite);
    densityInner *= mix(1.0, mix(0.55, 1.0, speck), edgeMask * 0.85);
    densityInner *= mix(0.9, 1.0, vnoise(vec2(t * 52.0, normDist * 11.0) + u_seed.xy));
    float alpha = cov * mix(1.0, densityInner, strokeMask);

    float lumInner = mix(0.86, 1.02, graphite) * mix(1.0, 0.78, speck * edgeMask * 0.5);
    float lum = mix(1.0, lumInner, strokeMask);
    return vec2(alpha, lum);
  }

  /** Elliptical ring (TOC) — wobbly outline + variable pressure, not a perfect curve. */
  vec2 ellipseStroke(vec2 p) {
    vec2 radii = max(u_innerHalf, vec2(1e-4));
    radii.x *= 1.0 + (hash11(u_seed.x + 2.0) - 0.5) * 0.068;
    radii.y *= 1.0 + (hash11(u_seed.y + 5.0) - 0.5) * 0.068;

    float theta = atan(p.y, p.x);
    vec2 tangent = vec2(-sin(theta), cos(theta));

    float tangW = (vnoise(vec2(theta * 1.55 + u_seed.x, 0.6)) - 0.5) * u_strokeNorm * 4.2;
    vec2 pw = p + tangent * tangW;

    float wobble = 1.0
      + (vnoise(vec2(theta * 0.82 + u_seed.x, 0.25)) - 0.5) * 0.092
      + (vnoise(vec2(theta * 3.05 + u_seed.y, 1.15)) - 0.5) * 0.038
      + (vnoise(vec2(theta * 7.6 + u_seed.z, 2.4)) - 0.5) * 0.015;

    float ell = length(pw / radii) / max(wobble, 0.82);
    float d = ell - 1.0;

    float pressure = sin(theta * 2.0 + u_seed.x * 0.85) * 0.5 + 0.5;
    pressure *= sin(theta * 3.0 + u_seed.y * 1.35 + 0.4) * 0.5 + 0.5;
    pressure = pow(max(pressure, 0.0), 0.46);
    pressure *= mix(0.75, 1.2, vnoise(vec2(theta * 2.15 / 6.283 + u_seed.z, 3.2)));
    float halfW = u_strokeNorm * mix(0.22, 1.1, pressure);

    float normDist = abs(d) / max(halfW, 1e-5);
    float rim = abs(d) - halfW;
    float aa = max(fwidth(rim), 1e-5);
    float strokeMask = 1.0 - smoothstep(0.0, aa * 1.1, rim);

    if (strokeMask < 0.002)
      return vec2(0.0);

    vec2 grainUv = vec2(theta * 0.48 / u_strokeNorm, normDist * 3.1);
    float graphite = pencilGrain(grainUv);
    float speck = vnoise(grainUv * vec2(210.0, 88.0) + u_seed.zx);
    float edgeMask = smoothstep(0.35, 1.0, normDist) * strokeMask;

    float edgeRoughIn = min(0.0, (pencilGrain(vec2(theta * 0.38, normDist * 2.1)) - 0.5) * aa * 1.55);
    float cov = (1.0 - smoothstep(0.0, aa * 1.1, rim + edgeRoughIn)) * strokeMask;

    float densityInner = mix(0.82, 1.0, graphite);
    densityInner *= mix(1.0, mix(0.55, 1.0, speck), edgeMask * 0.85);
    densityInner *= mix(0.9, 1.0, vnoise(vec2(theta * 8.0, normDist * 11.0) + u_seed.xy));
    float alpha = cov * mix(1.0, densityInner, strokeMask);

    float lumInner = mix(0.86, 1.02, graphite) * mix(1.0, 0.78, speck * edgeMask * 0.5);
    float lum = mix(1.0, lumInner, strokeMask);
    return vec2(alpha, lum);
  }

  void main() {
    vec2 local = gl_FragCoord.xy - u_vpOrigin;
    vec2 uvFrag = local / u_resolution.xy;
    float xCss = u_drawCss.x + uvFrag.x * u_drawCss.z;
    float yCss = u_drawCss.y + u_drawCss.w - uvFrag.y * u_drawCss.w;
    float uvE_x = (xCss - u_expandCss.x) / max(u_expandCss.z, 1.0);
    float uvE_y = (u_expandCss.y + u_expandCss.w - yCss) / max(u_expandCss.w, 1.0);
    float aspectPin = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = vec2(
      (uvE_x * 2.0 - 1.0) * aspectPin,
      uvE_y * 2.0 - 1.0
    );

    vec2 q = warpHandDrawn(p - u_pCardCenter);

    float fillHalfX = u_innerHalf.x * (0.996 + (hash11(u_seed.x) - 0.5) * 0.018);
    float fillHalfY = u_innerHalf.y * (0.996 + (hash11(u_seed.y) - 0.5) * 0.018);
    float dIn = sdBox(q, vec2(fillHalfX, fillHalfY));
    float edgeW = max(fwidth(dIn) * 1.35, 1e-5);
    float fillAlpha = 1.0 - smoothstep(-edgeW, edgeW * 1.6, dIn);

    vec2 c0 = cornerPos(vec2(-1.0, -1.0), 0.0);
    vec2 c1 = cornerPos(vec2( 1.0, -1.0), 1.0);
    vec2 c2 = cornerPos(vec2( 1.0,  1.0), 2.0);
    vec2 c3 = cornerPos(vec2(-1.0,  1.0), 3.0);

    vec2 stroke = vec2(0.0);
    float strokeA = 0.0;
    float strokeLum = 1.0;

    if (u_bakeMode < 0.5) {
      if (u_frameEllipse > 0.5) {
        stroke = ellipseStroke(q);
      } else {
        stroke = taperedSegment(q, c0, c1);
        stroke = pickStroke(stroke, taperedSegment(q, c1, c2));
        stroke = pickStroke(stroke, taperedSegment(q, c2, c3));
        stroke = pickStroke(stroke, taperedSegment(q, c3, c0));
      }
      strokeA = min(stroke.x, 1.0);
      strokeLum = stroke.y;
    } else {
      float halfLen = u_innerHalf.x;
      float nudge = u_strokeNorm * 3.2;
      if (u_bakeMode < 1.5) {
        float stretch = 1.0 + (hash11(u_seed.z + 2.0) - 0.5) * 0.045;
        float y0 = (hash11(u_seed.x) - 0.5) * u_strokeNorm * 1.8;
        float y1 = y0 + (hash11(u_seed.y) - 0.5) * u_strokeNorm * 1.1;
        vec2 a = vec2(-halfLen * stretch, y0) + hash22(vec2(0.0, u_seed.x)) * nudge;
        vec2 b = vec2( halfLen * stretch, y1) + hash22(vec2(1.0, u_seed.y)) * nudge;
        stroke = taperedSegment(q, a, b);
      } else {
        float stretch = 1.0 + (hash11(u_seed.z + 5.0) - 0.5) * 0.045;
        float x0 = (hash11(u_seed.x) - 0.5) * u_strokeNorm * 1.8;
        float x1 = x0 + (hash11(u_seed.y) - 0.5) * u_strokeNorm * 1.1;
        vec2 a = vec2(x0, -halfLen * stretch) + hash22(vec2(u_seed.z, 0.0)) * nudge;
        vec2 b = vec2(x1,  halfLen * stretch) + hash22(vec2(u_seed.z, 1.0)) * nudge;
        stroke = taperedSegment(q, a, b);
      }
      strokeA = min(stroke.x, 1.0);
      strokeLum = stroke.y;
      fillAlpha = 0.0;
    }

    if (u_strokeOnly > 0.5)
      fillAlpha = 0.0;

    float aOut = max(fillAlpha, strokeA);
    vec3 strokeRgb = u_strokeColor * strokeLum;
    vec3 rgb = u_fillColor * fillAlpha;
    rgb = mix(rgb, strokeRgb, strokeA / max(aOut, 1e-5));
    gl_FragColor = vec4(rgb, aOut);
  }
`

const vertexShader = /* glsl */ `void main() {
  gl_Position = vec4(position, 1.0);
}`

const SHADER_REV = 15

let bakeRenderer: THREE.WebGLRenderer | null = null
let bakeScene: THREE.Scene | null = null
let bakeCamera: THREE.OrthographicCamera | null = null
let bakeMesh: THREE.Mesh | null = null
let bakeMaterial: THREE.ShaderMaterial | null = null
let shaderOk: boolean | null = null
let shaderRevLoaded = -1

function disposePencilBakeGl() {
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

function validatePencilProgram(): boolean {
  if (!bakeRenderer || !bakeMaterial || !bakeScene || !bakeCamera)
    return false
  try {
    bakeRenderer.setSize(32, 32, false)
    bakeRenderer.setClearColor(0x000000, 0)
    bakeRenderer.clear(true, true, true)
    bakeMaterial.uniforms.u_bakeMode.value = 1
    bakeMaterial.uniforms.u_innerHalf.value.set(1, 0.1)
    bakeMaterial.uniforms.u_strokeNorm.value = 0.032
    bakeRenderer.compile(bakeScene, bakeCamera)
    bakeRenderer.render(bakeScene, bakeCamera)
    const probe = bakeRenderer.domElement.toDataURL('image/png')
    return probe.length > 120
  }
  catch (err) {
    console.error('[pencilFrameBake] Shader link failed', err)
    return false
  }
}

function ensurePencilBakeGl(): boolean {
  if (bakeRenderer && shaderRevLoaded !== SHADER_REV)
    disposePencilBakeGl()

  if (bakeRenderer && shaderOk === true)
    return true

  if (bakeRenderer && shaderOk === false)
    disposePencilBakeGl()

  bakeRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    failIfMajorPerformanceCaveat: false,
  })
  bakeRenderer.setPixelRatio(1)

  bakeScene = new THREE.Scene()
  bakeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  bakeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      u_vpOrigin: { value: new THREE.Vector2(0, 0) },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_strokeColor: { value: new THREE.Color('#2a2520') },
      u_fillColor: { value: new THREE.Color('#e0d8c8') },
      u_innerHalf: { value: new THREE.Vector2(1, 1) },
      u_pCardCenter: { value: new THREE.Vector2(0, 0) },
      u_expandCss: { value: new THREE.Vector4(0, 0, 1, 1) },
      u_drawCss: { value: new THREE.Vector4(0, 0, 1, 1) },
      u_strokeNorm: { value: 0.032 },
      u_bakeMode: { value: 0 },
      u_strokeOnly: { value: 0 },
      u_frameEllipse: { value: 0 },
      u_seed: { value: new THREE.Vector3(1, 2, 3) },
    },
    vertexShader,
    fragmentShader: PENCIL_FRAME_FRAGMENT,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })

  bakeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial)
  bakeScene.add(bakeMesh)

  shaderOk = validatePencilProgram()
  if (!shaderOk)
    console.error('[pencilFrameBake] Pencil bake shader unavailable — panels will use CSS fallback')

  shaderRevLoaded = SHADER_REV
  return shaderOk === true
}

const BAKE_MODE: Record<PencilBakeVariant, number> = {
  frame: 0,
  hline: 1,
  vline: 2,
}

export function bakePencilFrameImage(opts: PencilFrameBakeOptions): string | null {
  const widthCss = opts.widthCss
  const heightCss = opts.heightCss
  const variant = opts.variant ?? 'frame'
  if (widthCss < 2 || heightCss < 2)
    return null

  if (!ensurePencilBakeGl())
    return null

  if (!bakeRenderer || !bakeMaterial || !bakeScene || !bakeCamera)
    return null

  const bleed = opts.bleedPx ?? (variant === 'frame' ? PENCIL_FRAME_BLEED_PX : PENCIL_DIVIDER_BLEED_PX)
  const wE = widthCss + bleed * 2
  const hE = heightCss + bleed * 2
  const pr = Math.min(window.devicePixelRatio ?? 1, 2)
  let vw = Math.max(4, Math.ceil(wE * pr))
  let vh = Math.max(4, Math.ceil(hE * pr))
  const scale = Math.min(1, MAX_BAKE_EDGE_PX / Math.max(vw, vh))
  vw = Math.max(4, Math.ceil(vw * scale))
  vh = Math.max(4, Math.ceil(vh * scale))

  bakeRenderer.setSize(vw, vh, false)
  bakeRenderer.setClearColor(0x000000, 0)
  bakeRenderer.setViewport(0, 0, vw, vh)
  bakeRenderer.clear(true, true, true)

  const seedBase = opts.seed ?? Math.random() * 1000
  const stroke = new THREE.Color(opts.strokeColorHex)
  const fill = new THREE.Color(opts.fillColorHex)

  const cardL = bleed
  const cardT = bleed
  const cardW = widthCss
  const cardH = heightCss
  const exB = hE

  bakeMaterial.uniforms.u_vpOrigin.value.set(0, 0)
  bakeMaterial.uniforms.u_resolution.value.set(vw, vh)
  bakeMaterial.uniforms.u_expandCss.value.set(0, 0, wE, hE)
  bakeMaterial.uniforms.u_drawCss.value.set(0, 0, wE, hE)
  bakeMaterial.uniforms.u_strokeColor.value.copy(stroke)
  bakeMaterial.uniforms.u_fillColor.value.copy(fill)
  bakeMaterial.uniforms.u_seed.value.set(
    seedBase * 1.017,
    seedBase * 2.331 + 17.5,
    seedBase * 0.773 + 41.2,
  )
  bakeMaterial.uniforms.u_bakeMode.value = BAKE_MODE[variant]
  bakeMaterial.uniforms.u_strokeOnly.value = opts.strokeOnly && variant === 'frame' ? 1 : 0
  bakeMaterial.uniforms.u_frameEllipse.value =
    variant === 'frame' && opts.frameShape === 'ellipse' ? 1 : 0

  const aspect = vw / Math.max(vh, 1)
  const uvx = (cardL + cardW * 0.5) / wE
  const uvy = (exB - (cardT + cardH * 0.5)) / hE
  bakeMaterial.uniforms.u_pCardCenter.value.set((uvx * 2 - 1) * aspect, uvy * 2 - 1)

  if (variant === 'hline') {
    bakeMaterial.uniforms.u_innerHalf.value.set(
      aspect * (cardW / wE) * 0.998,
      (cardH / hE) * 0.5,
    )
  }
  else if (variant === 'vline') {
    bakeMaterial.uniforms.u_innerHalf.value.set(
      (cardW / wE) * 0.5,
      (cardH / hE) * 0.998,
    )
  }
  else {
    bakeMaterial.uniforms.u_innerHalf.value.set(
      aspect * (cardW / wE) * 0.998,
      (cardH / hE) * 0.998,
    )
  }

  const shortPx = variant === 'vline'
    ? cardW * pr * scale
    : variant === 'hline'
      ? cardH * pr * scale
      : Math.min(cardW * pr * scale, cardH * pr * scale)
  const strokePx = variant === 'frame' ? 2.6 * 2 : 2.2 * 2
  const strokeBase = (strokePx * PENCIL_STROKE_BOLD) / Math.max(shortPx, 1)
  bakeMaterial.uniforms.u_strokeNorm.value = Math.max(
    0.014,
    Math.min(variant === 'frame' ? 0.052 : 0.048, strokeBase),
  )

  bakeRenderer.render(bakeScene, bakeCamera)
  return bakeRenderer.domElement.toDataURL('image/png')
}
