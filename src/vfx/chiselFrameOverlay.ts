/**
 * One shared WebGL context draws all procedural chisel frames.
 * Per-card WebGLRenderer instances exhaust the browser context limit (~8–16)
 * on dense case-study pages and can blank the tab.
 */
import * as THREE from 'three'

export type ChiselFrameOptions = {
  colorHex: string
  hoverFlame?: boolean
  /** Solid interior tint behind the procedural rim (work roster panels, etc.). */
  panelFill?: boolean
  /** Frozen rim: no time animation, no living-ink density variation, no hover flame. */
  staticRim?: boolean
  /** Override interior fill (parchment panels); defaults to dark tint derived from rim. */
  fillColorHex?: string
  /** CSS px bleed beyond track bounds so organic rim is visible outside the fill. */
  bleedPx?: number
  /** Work panels: clip to viewport only so overflow:hidden ancestors do not trim the outer paper edge. */
  skipAncestorClip?: boolean
  /** Rim only outside the fill edge — thinner outward band (often paired with panelFill). */
  flatRim?: boolean
  /** Monotone parchment-style interior: flat fill, no grain, no depth lighting seam. */
  monotoneFill?: boolean
}

type Entry = {
  id: number
  el: HTMLElement
  color: THREE.Color
  fillColor: THREE.Color
  hoverFlame: boolean
  panelFill: boolean
  staticRim: boolean
  bleedPx: number
  skipAncestorClip: boolean
  flatRim: boolean
  monotoneFill: boolean
  hoverTarget: number
  hoverSmoothed: number
}

function accentFillColor(accent: THREE.Color): THREE.Color {
  const fill = accent.clone()
  fill.lerp(new THREE.Color(0x0c0c0c), 0.74)
  return fill
}

type CssBox = { left: number; top: number; right: number; bottom: number }

function intersectBoxes(a: CssBox, b: CssBox): CssBox {
  const left = Math.max(a.left, b.left)
  const top = Math.max(a.top, b.top)
  const right = Math.min(a.right, b.right)
  const bottom = Math.min(a.bottom, b.bottom)
  return { left, top, right, bottom }
}

/** Intersection of viewport with self + ancestor overflow / contain:paint clip boxes (CSS client px, top-left origin). */
function getCumulativeClipRect(el: HTMLElement, winW: number, winH: number): CssBox {
  let clip: CssBox = { left: 0, top: 0, right: winW, bottom: winH }
  let p: HTMLElement | null = el
  const root = document.documentElement
  while (p) {
    const st = window.getComputedStyle(p)
    const ox = st.overflowX
    const oy = st.overflowY
    const clipsOverflow =
      (ox !== 'visible' && ox !== '' && ox !== 'overlay') ||
      (oy !== 'visible' && oy !== '' && oy !== 'overlay')
    if (clipsOverflow) {
      const br = p.getBoundingClientRect()
      clip = intersectBoxes(clip, {
        left: br.left,
        top: br.top,
        right: br.right,
        bottom: br.bottom,
      })
    }
    const ct = st.contain || ''
    if (/\b(paint|strict|content)\b/.test(ct)) {
      const br = p.getBoundingClientRect()
      clip = intersectBoxes(clip, {
        left: br.left,
        top: br.top,
        right: br.right,
        bottom: br.bottom,
      })
    }
    if (p === root) break
    p = p.parentElement
  }
  return clip
}

/**
 * Fixed header strip is not an ancestor of cards; clip frame pixels below it when
 * the rim bleeds into the nav band. Panels that start below the nav (e.g. `/work`
 * detail) must not be clipped or the deckled top edge renders as a straight cut.
 */
function applyFixedNavClip(clip: CssBox, winH: number, frameExpandedTop: number): CssBox {
  const ledge = document.querySelector('.dl-nav-ledge-bg')
  if (!(ledge instanceof HTMLElement)) return clip
  const br = ledge.getBoundingClientRect()
  if (br.height < 1 || br.bottom <= 0 || br.top >= winH) return clip
  if (frameExpandedTop >= br.bottom - 0.5) return clip
  return intersectBoxes(clip, {
    left: -1e6,
    top: br.bottom,
    right: 1e6,
    bottom: 1e6,
  })
}

const CHISEL_FRAGMENT = /* glsl */ `
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
  /** Card half-extents in expanded-viewport p-space (sharp inner edge of the frame). */
  uniform vec2 u_innerHalf;
  /** Card center in expanded-viewport p-space (handles clamped bleed / off-center expansion). */
  uniform vec2 u_pCardCenter;
  /** eL, eT, wE, hE — expanded draw rect in CSS client px (before clip). */
  uniform vec4 u_expandCss;
  /** dL, dT, wD, hD — visible sub-rect in CSS client px (intersection with overflow ancestors). */
  uniform vec4 u_drawCss;
  /** Amplitude of organic displacement on the outer side of the rim (fbm). */
  uniform float u_outerOrganicAmp;
  uniform float u_panelFill;
  uniform vec3 u_fillColor;
  uniform float u_flatRim;
  uniform float u_monotoneFill;

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
    /* Map fragment in cropped viewport back into full expanded-rect UV so the SDF matches DOM clipping. */
    float xCss = u_drawCss.x + uvFrag.x * u_drawCss.z;
    /* gl_FragCoord.y grows upward; uvFrag.y=0 is the viewport bottom = larger screen Y (CSS top-left origin). */
    float yCss = u_drawCss.y + u_drawCss.w - uvFrag.y * u_drawCss.w;
    float uvE_x = (xCss - u_expandCss.x) / max(u_expandCss.z, 1.0);
    float uvE_y = (u_expandCss.y + u_expandCss.w - yCss) / max(u_expandCss.w, 1.0);
    vec2 p = vec2(
      (uvE_x * 2.0 - 1.0) * (u_resolution.x / max(u_resolution.y, 1.0)),
      uvE_y * 2.0 - 1.0
    );

    vec2 q = p - u_pCardCenter;
    float dBox = sdBox(q, u_innerHalf);
    float dFinal = getBorderDistance(p);
    float densityMap = fbm(p * 4.0);
    float paintThickness = smoothstep(-1.0, 1.0, densityMap);
    float alphaMult = mix(1.0, paintThickness + 0.3, u_densityVar);

    vec3 finalColor = u_color;
    vec3 flameColor = mix(u_color, vec3(1.0, 1.0, 1.0), 0.4);
    finalColor = mix(finalColor, flameColor, u_hoverFlameState * paintThickness);
    finalColor *= alphaMult;

    float borderAlpha = u_flatRim > 0.5
      ? 1.0 - smoothstep(-0.004, 0.016, dFinal)
      : 1.0 - smoothstep(0.0, 0.01, dFinal);

    if (u_flatRim > 0.5) {
      float outwardOnly = smoothstep(-u_borderWidth * 0.25, u_borderWidth * 0.2, dBox);
      borderAlpha *= outwardOnly;
      finalColor = mix(u_fillColor, finalColor, borderAlpha);
    }

    float alpha = borderAlpha;

    if (u_panelFill > 0.5) {
      float fillAlpha = 1.0 - smoothstep(-0.004, 0.008, dBox);
      vec3 interior = u_fillColor;
      if (u_monotoneFill < 0.5) {
        float grain = fbm(p * 9.5) * 0.035;
        interior *= 1.0 - grain;
      }
      finalColor = mix(interior, finalColor, borderAlpha);
      alpha = max(fillAlpha, borderAlpha);
    }

    if (u_depthEffect > 0.0) {
      float edgeScale = 0.35 / max(u_innerHalf.x, u_innerHalf.y);
      float dLight = getBorderDistance(p + vec2(0.005, -0.005) * edgeScale);
      float edgeDiff = (dFinal - dLight) * 20.0;
      float edgeMask = smoothstep(-0.03, 0.0, dFinal);
      float highlight = max(0.0, edgeDiff) * edgeMask;
      float selfShadow = max(0.0, -edgeDiff) * edgeMask;
      finalColor += vec3(0.6) * highlight * u_depthEffect * alpha;
      finalColor -= vec3(0.6) * selfShadow * u_depthEffect * alpha;

      float shadowDist = getBorderDistance(p - vec2(0.02, -0.02) * edgeScale);
      float dropShadow = 1.0 - smoothstep(0.0, 0.15, shadowDist);
      if (alpha < 0.1) {
        finalColor = vec3(0.0);
        alpha = dropShadow * 0.6 * u_depthEffect;
      }
    }
    gl_FragColor = vec4(finalColor, alpha);
  }
`

const vertexShader = /* glsl */ `void main() {
  gl_Position = vec4(position, 1.0);
}`

let entries: Entry[] = []
let nextId = 1

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let mesh: THREE.Mesh | null = null
let material: THREE.ShaderMaterial | null = null
let clock: THREE.Clock | null = null
let raf = 0
let canvasEl: HTMLCanvasElement | null = null
let onWinResize: (() => void) | null = null

function disposeGl() {
  if (onWinResize) {
    window.removeEventListener('resize', onWinResize)
    onWinResize = null
  }
  cancelAnimationFrame(raf)
  raf = 0
  mesh?.geometry.dispose()
  mesh = null
  material?.dispose()
  material = null
  renderer?.dispose()
  renderer = null
  scene = null
  camera = null
  clock = null
  if (canvasEl?.parentNode) {
    canvasEl.parentNode.removeChild(canvasEl)
  }
  canvasEl = null
}

function ensureGl() {
  if (renderer) return

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  // Below NavBar/Footer/modals; above in-flow defaults so embedded parchment content can stack above (z-index 1).
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;display:block;transform:translateZ(0);backface-visibility:hidden;will-change:transform;contain:strict;'
  document.body.appendChild(canvas)
  canvasEl = canvas

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    premultipliedAlpha: false,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2))
  renderer.autoClear = true

  const syncCanvasSize = () => {
    if (!renderer) return
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    canvas.style.width = '100%'
    canvas.style.height = '100%'
  }
  syncCanvasSize()
  onWinResize = syncCanvasSize
  window.addEventListener('resize', onWinResize, { passive: true })

  const uniforms = {
    u_vpOrigin: { value: new THREE.Vector2(0, 0) },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_time: { value: 0.0 },
    u_color: { value: new THREE.Color('#00ffcc') },
    u_borderWidth: { value: 0.03 },
    u_wobble: { value: 0.01 },
    u_chiselDepth: { value: 0.0206 },
    u_chiselDensity: { value: 8.0 },
    u_chiselChaos: { value: 1.0 },
    u_densityVar: { value: 0.896 },
    u_depthEffect: { value: 0.164 },
    u_hoverFlameState: { value: 0.0 },
    u_innerHalf: { value: new THREE.Vector2(1, 1) },
    u_pCardCenter: { value: new THREE.Vector2(0, 0) },
    u_expandCss: { value: new THREE.Vector4(0, 0, 1, 1) },
    u_drawCss: { value: new THREE.Vector4(0, 0, 1, 1) },
    u_outerOrganicAmp: { value: 0.065 },
    u_panelFill: { value: 0.0 },
    u_fillColor: { value: new THREE.Color(0x0c0c0c) },
    u_flatRim: { value: 0.0 },
    u_monotoneFill: { value: 0.0 },
  }

  material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader: CHISEL_FRAGMENT,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  scene.add(mesh)

  clock = new THREE.Clock()

  const tick = () => {
    raf = requestAnimationFrame(tick)
    if (!renderer || !material || !scene || !camera || !clock) return

    const pr = renderer.getPixelRatio()
    const winW = window.innerWidth
    const winH = window.innerHeight
    const elapsed = clock.getElapsedTime()

    renderer.setClearColor(0x000000, 0)
    renderer.setScissorTest(false)
    renderer.clear(true, true, true)
    renderer.autoClear = false

    for (const entry of entries) {
      if (!document.contains(entry.el)) continue
      const r = entry.el.getBoundingClientRect()
      const bleedCss = entry.bleedPx
      if (
        r.width < 2 ||
        r.height < 2 ||
        r.right < -bleedCss ||
        r.left > winW + bleedCss ||
        r.bottom < -bleedCss ||
        r.top > winH + bleedCss
      ) continue

      if (entry.hoverFlame) {
        entry.hoverSmoothed += (entry.hoverTarget - entry.hoverSmoothed) * 0.12
      } else {
        entry.hoverSmoothed = 0
      }

      let exL = r.left - bleedCss
      let exT = r.top - bleedCss
      let exR = r.right + bleedCss
      let exB = r.bottom + bleedCss
      exL = Math.max(0, exL)
      exT = Math.max(0, exT)
      exR = Math.min(winW, exR)
      exB = Math.min(winH, exB)
      const wE = Math.max(4, exR - exL)
      const hE = Math.max(4, exB - exT)

      const expanded: CssBox = { left: exL, top: exT, right: exR, bottom: exB }
      let clip: CssBox = { left: 0, top: 0, right: winW, bottom: winH }
      if (!entry.skipAncestorClip) {
        clip = getCumulativeClipRect(entry.el, winW, winH)
      }
      clip = applyFixedNavClip(clip, winH, exT)
      const draw = intersectBoxes(expanded, clip)
      if (draw.right - draw.left < 2 || draw.bottom - draw.top < 2) continue

      const leftCss = draw.left
      const bottomCss = winH - draw.bottom
      const vwCss = draw.right - draw.left
      const vhCss = draw.bottom - draw.top
      const left = leftCss * pr
      const bottom = bottomCss * pr
      const vw = vwCss * pr
      const vh = vhCss * pr

      renderer.setViewport(leftCss, bottomCss, vwCss, vhCss)
      renderer.setScissorTest(true)
      renderer.setScissor(leftCss, bottomCss, vwCss, vhCss)
      material.uniforms.u_vpOrigin.value.set(left, bottom)
      material.uniforms.u_resolution.value.set(vw, vh)
      material.uniforms.u_expandCss.value.set(exL, exT, wE, hE)
      material.uniforms.u_drawCss.value.set(draw.left, draw.top, vwCss, vhCss)
      material.uniforms.u_color.value.copy(entry.color)
      material.uniforms.u_panelFill.value = entry.panelFill ? 1 : 0
      material.uniforms.u_fillColor.value.copy(entry.fillColor)
      material.uniforms.u_monotoneFill.value = entry.monotoneFill ? 1 : 0
      material.uniforms.u_time.value = entry.staticRim ? 0 : elapsed
      material.uniforms.u_densityVar.value =
        entry.staticRim || entry.monotoneFill ? 0 : 0.896
      let depthFx = entry.skipAncestorClip ? 0 : entry.panelFill ? 0.06 : 0.164
      if (entry.monotoneFill) depthFx = 0
      material.uniforms.u_depthEffect.value = depthFx
      material.uniforms.u_hoverFlameState.value = entry.hoverSmoothed
      material.uniforms.u_flatRim.value = entry.flatRim ? 1 : 0

      const aspect = vw / Math.max(vh, 1)
      const uvx = (r.left + r.width * 0.5 - exL) / wE
      const uvy = (exB - (r.top + r.height * 0.5)) / hE
      const pccx = (uvx * 2 - 1) * aspect
      const pccy = uvy * 2 - 1
      material.uniforms.u_pCardCenter.value.set(pccx, pccy)

      const inset = entry.flatRim ? 1.0 : 0.996
      material.uniforms.u_innerHalf.value.set(
        aspect * (r.width / wE) * inset,
        (r.height / hE) * inset,
      )

      const shortPx = Math.min(r.width * pr, r.height * pr)
      const isLargePanel = entry.panelFill || entry.bleedPx > 12
      const borderPx = isLargePanel ? 4.2 : 3.1
      let borderNorm = Math.min(0.07, (borderPx * 2) / Math.max(shortPx, 1))
      if (entry.monotoneFill && entry.panelFill) {
        borderNorm = Math.max(borderNorm, 0.038)
      }
      material.uniforms.u_borderWidth.value = borderNorm

      const organicPx = isLargePanel ? (entry.skipAncestorClip ? 10 : 7.5) : 5.5
      let organicNorm = Math.min(
        entry.skipAncestorClip ? 0.14 : 0.11,
        (organicPx * 2) / Math.max(shortPx, 1),
      )
      if (entry.monotoneFill && entry.panelFill) {
        organicNorm = Math.max(organicNorm, 0.058)
      }
      material.uniforms.u_outerOrganicAmp.value = organicNorm

      renderer.render(scene, camera)
    }

    renderer.autoClear = true
    renderer.setScissorTest(false)
    renderer.setViewport(0, 0, winW, winH)
  }

  tick()
}

export function registerChiselFrame(
  el: HTMLElement,
  colorHex: string,
  hoverFlame?: boolean,
): number
export function registerChiselFrame(el: HTMLElement, options: ChiselFrameOptions): number
export function registerChiselFrame(
  el: HTMLElement,
  colorOrOptions: string | ChiselFrameOptions,
  hoverFlame = true,
): number {
  const defaults = {
    hoverFlame: false,
    panelFill: false,
    staticRim: false,
    flatRim: false,
    monotoneFill: false,
    bleedPx: 10,
    skipAncestorClip: false,
  } satisfies Partial<ChiselFrameOptions>

  const cfg: ChiselFrameOptions =
    typeof colorOrOptions === 'string'
      ? {
          ...defaults,
          colorHex: colorOrOptions,
          hoverFlame,
        }
      : {
          ...defaults,
          ...colorOrOptions,
          colorHex: colorOrOptions.colorHex,
        }

  const color = new THREE.Color(cfg.colorHex)
  const fillColor = cfg.fillColorHex
    ? new THREE.Color(cfg.fillColorHex)
    : accentFillColor(color)
  const id = nextId++
  entries.push({
    id,
    el,
    color,
    fillColor,
    hoverFlame: cfg.hoverFlame ?? false,
    panelFill: cfg.panelFill ?? false,
    staticRim: cfg.staticRim ?? false,
    bleedPx: cfg.bleedPx ?? 10,
    skipAncestorClip: cfg.skipAncestorClip ?? false,
    flatRim: cfg.flatRim ?? false,
    monotoneFill: cfg.monotoneFill ?? false,
    hoverTarget: 0,
    hoverSmoothed: 0,
  })
  ensureGl()
  return id
}

export function unregisterChiselFrame(id: number) {
  entries = entries.filter((e) => e.id !== id)
  if (entries.length === 0) {
    disposeGl()
  }
}

export function setChiselFrameColor(
  id: number,
  colorHex: string,
  fillColorHex?: string,
) {
  const e = entries.find((x) => x.id === id)
  if (e) {
    e.color.set(colorHex)
    if (fillColorHex) e.fillColor.set(fillColorHex)
    else if (e.flatRim) e.fillColor.set(colorHex)
    else if (!e.panelFill) e.fillColor.copy(accentFillColor(e.color))
  }
}

export function setChiselFrameHover(id: number, target: number) {
  const e = entries.find((x) => x.id === id)
  if (e) e.hoverTarget = target
}
