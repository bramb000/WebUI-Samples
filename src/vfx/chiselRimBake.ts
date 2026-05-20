/**
 * One-off static chisel rim bake for card frames (no live overlay / scroll sync).
 * Uses the same SDF recipe as `chiselFrameOverlay` with frozen time and no living ink.
 */
import * as THREE from 'three'

export type ChiselRimBakeOptions = {
  widthCss: number
  heightCss: number
  colorHex: string
  bleedPx?: number
  flatRim?: boolean
}

export const CARD_BLEED_PX = 10
const MAX_BAKE_EDGE_PX = 1024

const CHISEL_BAKE_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_vpOrigin;
  uniform float u_time;
  uniform vec3 u_color;
  uniform float u_borderWidth;
  uniform float u_wobble;
  uniform float u_chiselDepth;
  uniform float u_chiselDensity;
  uniform float u_chiselChaos;
  uniform float u_densityVar;
  uniform float u_depthEffect;
  uniform float u_hoverFlameState;
  uniform vec2 u_innerHalf;
  uniform vec2 u_pCardCenter;
  uniform vec4 u_expandCss;
  uniform vec4 u_drawCss;
  uniform float u_outerOrganicAmp;
  uniform float u_panelFill;
  uniform vec3 u_fillColor;
  uniform float u_flatRim;

  vec2 hash( vec2 p ) {
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
  }

  float noise( in vec2 p ) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step( a.y, a.x );
    vec2  o = vec2( m, 1.0 - m );
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5 - vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
  }

  float fbm(vec2 p) {
    float f = 0.0;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    float amp = 0.5;
    for (int i = 0; i < 4; ++i) {
      f += amp * noise(p);
      p = rot * p * 2.0;
      amp *= 0.5;
    }
    return f;
  }

  float angularCuts(vec2 p, float density, float chaos) {
    vec2 q = p * density;
    float wave1 = abs(fract(q.x * 0.8 + q.y * 1.2 + chaos * 0.5) - 0.5);
    float wave2 = abs(fract(q.x * -1.5 + q.y * 0.7 - chaos * 0.3) - 0.5);
    float wave3 = abs(fract(q.x * 1.1 - q.y * 1.9 + chaos * 0.8) - 0.5);
    float shards = (wave1 * wave2 * 4.0) + (wave3 * 0.5);
    float mask = smoothstep(0.1, 0.4, noise(p * 3.0 + u_time * 0.05));
    return shards * mask;
  }

  float sdBox( in vec2 p, in vec2 b ) {
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
  }

  float getBorderDistance(vec2 p) {
    vec2 q = p - u_pCardCenter;
    float dBox = sdBox(q, u_innerHalf);
    float rim = abs(dBox) - u_borderWidth;
    float dOut = max(0.0, dBox);
    float outerBand = smoothstep(u_borderWidth * 0.15, u_borderWidth * 2.8, dOut);
    float outerFall = 1.0 - smoothstep(u_borderWidth * 3.2, u_borderWidth * 10.0, dOut);
    float outerMask = outerBand * outerFall;
    float organic = fbm(p * 4.8 + u_time * 0.055 + fbm(p * 1.35 + u_time * 0.018)) * u_outerOrganicAmp;
    organic += fbm(p * 11.3 - vec2(0.0, u_time * 0.14)) * (u_outerOrganicAmp * 0.42) * outerMask;
    float baseDist = rim - organic * outerMask;
    float innerProtect = u_flatRim > 0.5 ? 1.0 : 1.0 - outerMask * 0.88;
    float cuts = angularCuts(q, u_chiselDensity, u_chiselChaos) * u_chiselDepth * innerProtect;
    float micro = fbm(p * 4.0) * u_wobble * (1.0 - outerMask * (u_flatRim > 0.5 ? 1.0 : 0.75));
    if (u_flatRim > 0.5) {
      cuts *= outerMask;
      micro *= outerMask;
    }
    float chiseledDist = baseDist + cuts + micro;
    vec2 fireUV = p * 10.0;
    fireUV.y -= u_time * 4.0;
    float flameDistortion = fbm(fireUV) * 0.1 * u_hoverFlameState * (0.3 + outerMask * 0.7);
    float topBias = smoothstep(0.0, 0.8, p.y) * u_hoverFlameState;
    return chiseledDist - flameDistortion * topBias;
  }

  void main() {
    vec2 local = gl_FragCoord.xy - u_vpOrigin;
    vec2 uvFrag = local / u_resolution.xy;
    float xCss = u_drawCss.x + uvFrag.x * u_drawCss.z;
    float yCss = u_drawCss.y + u_drawCss.w - uvFrag.y * u_drawCss.w;
    float uvE_x = (xCss - u_expandCss.x) / max(u_expandCss.z, 1.0);
    float uvE_y = (u_expandCss.y + u_expandCss.w - yCss) / max(u_expandCss.w, 1.0);
    vec2 p = vec2(
      (uvE_x * 2.0 - 1.0) * (u_resolution.x / max(u_resolution.y, 1.0)),
      uvE_y * 2.0 - 1.0
    );

    float dFinal = getBorderDistance(p);
    float densityMap = fbm(p * 4.0);
    float paintThickness = smoothstep(-1.0, 1.0, densityMap);
    float alphaMult = mix(1.0, paintThickness + 0.3, u_densityVar);

    vec3 finalColor = u_color;
    finalColor *= alphaMult;

    float borderAlpha = u_flatRim > 0.5
      ? 1.0 - smoothstep(-0.004, 0.016, dFinal)
      : 1.0 - smoothstep(0.0, 0.01, dFinal);

    float alpha = borderAlpha;

    if (u_depthEffect > 0.0) {
      float edgeScale = 0.35 / max(u_innerHalf.x, u_innerHalf.y);
      float dLight = getBorderDistance(p + vec2(0.005, -0.005) * edgeScale);
      float edgeDiff = (dFinal - dLight) * 20.0;
      float edgeMask = smoothstep(-0.03, 0.0, dFinal);
      float highlight = max(0.0, edgeDiff) * edgeMask;
      float selfShadow = max(0.0, -edgeDiff) * edgeMask;
      finalColor += vec3(0.6) * highlight * u_depthEffect * alpha;
      finalColor -= vec3(0.6) * selfShadow * u_depthEffect * alpha;
    }
    gl_FragColor = vec4(finalColor, alpha);
  }
`

const vertexShader = /* glsl */ `void main() {
  gl_Position = vec4(position, 1.0);
}`

let bakeRenderer: THREE.WebGLRenderer | null = null
let bakeScene: THREE.Scene | null = null
let bakeCamera: THREE.OrthographicCamera | null = null
let bakeMesh: THREE.Mesh | null = null
let bakeMaterial: THREE.ShaderMaterial | null = null

function ensureBakeGl() {
  if (bakeRenderer) return

  bakeRenderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
  })
  bakeRenderer.setPixelRatio(1)

  bakeScene = new THREE.Scene()
  bakeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms = {
    u_vpOrigin: { value: new THREE.Vector2(0, 0) },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_time: { value: 0 },
    u_color: { value: new THREE.Color('#00ffcc') },
    u_borderWidth: { value: 0.03 },
    u_wobble: { value: 0.01 },
    u_chiselDepth: { value: 0.0206 },
    u_chiselDensity: { value: 8.0 },
    u_chiselChaos: { value: 1.0 },
    u_densityVar: { value: 0 },
    u_depthEffect: { value: 0.164 },
    u_hoverFlameState: { value: 0 },
    u_innerHalf: { value: new THREE.Vector2(1, 1) },
    u_pCardCenter: { value: new THREE.Vector2(0, 0) },
    u_expandCss: { value: new THREE.Vector4(0, 0, 1, 1) },
    u_drawCss: { value: new THREE.Vector4(0, 0, 1, 1) },
    u_outerOrganicAmp: { value: 0.065 },
    u_panelFill: { value: 0 },
    u_fillColor: { value: new THREE.Color(0x0c0c0c) },
    u_flatRim: { value: 0 },
  }

  bakeMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: CHISEL_BAKE_FRAGMENT,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })

  bakeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bakeMaterial)
  bakeScene.add(bakeMesh)
}

/** Renders a transparent PNG data URL sized to the card + bleed (CSS px). */
export function bakeChiselRimImage(opts: ChiselRimBakeOptions): string | null {
  const widthCss = opts.widthCss
  const heightCss = opts.heightCss
  if (widthCss < 2 || heightCss < 2) return null

  ensureBakeGl()
  if (!bakeRenderer || !bakeMaterial || !bakeScene || !bakeCamera) return null

  const bleed = opts.bleedPx ?? CARD_BLEED_PX
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
  bakeRenderer.setScissorTest(false)
  bakeRenderer.setViewport(0, 0, vw, vh)
  bakeRenderer.clear(true, true, true)

  const color = new THREE.Color(opts.colorHex)
  const cardL = bleed
  const cardT = bleed
  const cardW = widthCss
  const cardH = heightCss
  const exB = hE

  bakeMaterial.uniforms.u_vpOrigin.value.set(0, 0)
  bakeMaterial.uniforms.u_resolution.value.set(vw, vh)
  bakeMaterial.uniforms.u_expandCss.value.set(0, 0, wE, hE)
  bakeMaterial.uniforms.u_drawCss.value.set(0, 0, wE, hE)
  bakeMaterial.uniforms.u_color.value.copy(color)
  bakeMaterial.uniforms.u_fillColor.value.set(0x0c0c0c)
  bakeMaterial.uniforms.u_time.value = 0
  bakeMaterial.uniforms.u_densityVar.value = 0
  bakeMaterial.uniforms.u_hoverFlameState.value = 0
  bakeMaterial.uniforms.u_panelFill.value = 0
  bakeMaterial.uniforms.u_flatRim.value = opts.flatRim ? 1 : 0
  /* Keep rim tint true to props.colorHex — depth lighting reads as lower-saturation on cards. */
  bakeMaterial.uniforms.u_depthEffect.value = 0

  const aspect = vw / Math.max(vh, 1)
  const uvx = (cardL + cardW * 0.5) / wE
  const uvy = (exB - (cardT + cardH * 0.5)) / hE
  bakeMaterial.uniforms.u_pCardCenter.value.set((uvx * 2 - 1) * aspect, uvy * 2 - 1)

  const inset = opts.flatRim ? 1.0 : 0.996
  bakeMaterial.uniforms.u_innerHalf.value.set(
    aspect * (cardW / wE) * inset,
    (cardH / hE) * inset,
  )

  const shortPx = Math.min(cardW * pr * scale, cardH * pr * scale)
  const borderNorm = Math.min(0.07, (3.1 * 2) / Math.max(shortPx, 1))
  bakeMaterial.uniforms.u_borderWidth.value = borderNorm
  const organicNorm = Math.min(0.11, (5.5 * 2) / Math.max(shortPx, 1))
  bakeMaterial.uniforms.u_outerOrganicAmp.value = organicNorm

  bakeRenderer.render(bakeScene, bakeCamera)
  return bakeRenderer.domElement.toDataURL('image/png')
}
