<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import tocActivePunchFrag from '../shaders/tocActivePunch.frag?raw'

interface TocItem {
  id: string
  text: string
}

const items = ref<TocItem[]>([])
const activeId = ref<string>('')
const tocRootRef = ref<HTMLElement | null>(null)
const listWrapRef = ref<HTMLElement | null>(null)
const punchCanvasRef = ref<HTMLCanvasElement | null>(null)

let observer: IntersectionObserver | null = null
let scrollRootEl: HTMLElement | null = null
let scrollCleanup: (() => void) | null = null

let rafThree = 0
let syncRaf = 0
let listResizeObs: ResizeObserver | null = null
let clock: THREE.Clock | null = null
let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let mesh: THREE.Mesh | null = null
let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | null = null
let textCanvas: HTMLCanvasElement | null = null
let textTexture: THREE.CanvasTexture | null = null
let threeReady = false

const vertexShader = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

function parseAccent(root: HTMLElement | null): string {
  if (!root)
    return '#00ffcc'
  const raw = getComputedStyle(root).getPropertyValue('--color-accent').trim()
  if (!raw)
    return '#00ffcc'
  return raw
}

function slugifyHeading(text: string, index: number) {
  const s = text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
  return s || `section-${index}`
}

function getScrollParent(el: HTMLElement | null): HTMLElement | Window {
  if (!el)
    return window
  let p: HTMLElement | null = el.parentElement
  while (p) {
    const { overflowY } = getComputedStyle(p)
    if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight + 4)
      return p
    p = p.parentElement
  }
  return window
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

function drawTextMask(shellWcss: number, shellHcss: number, label: string) {
  if (!textCanvas || !textTexture || !threeReady || !material)
    return

  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
  const w = Math.max(8, Math.floor(shellWcss * dpr))
  const h = Math.max(8, Math.floor(shellHcss * dpr))
  textCanvas.width = w
  textCanvas.height = h

  const ctx = textCanvas.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return
  ctx.clearRect(0, 0, w, h)

  const fontPx = 10 * dpr
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${fontPx}px Barlow, system-ui, sans-serif`

  const xPad = 12 * dpr
  const maxTextW = Math.max(44, shellWcss - 20) * dpr
  const lines = wrapLines(ctx, label.toUpperCase(), maxTextW)
  const lh = fontPx * 1.38
  const block = Math.max(lh * lines.length, lh)
  let yStart = (h - block) * 0.5 + lh * 0.45

  for (const ln of lines) {
    ctx.fillText(ln, xPad, yStart)
    yStart += lh
  }

  textTexture.needsUpdate = true
}

function syncCompositor() {
  if (!threeReady || !renderer || !material || !punchCanvasRef.value || !listWrapRef.value)
    return

  const wrap = listWrapRef.value
  const cn = punchCanvasRef.value

  const btn = wrap.querySelector<HTMLElement>('.toc-btn--active')
  if (!activeId.value || !btn) {
    cn.style.opacity = '0'
    return
  }

  const wr = wrap.getBoundingClientRect()
  const br = btn.getBoundingClientRect()
  const top = br.top - wr.top + wrap.scrollTop
  const height = Math.max(br.height, 36)

  cn.style.top = `${Math.max(0, top)}px`
  cn.style.height = `${height}px`
  cn.style.opacity = '1'

  const bw = Math.max(120, wrap.clientWidth)
  const bh = height
  const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

  renderer.setPixelRatio(dpr)
  renderer.setSize(bw, bh, false)

  material.uniforms.u_resolution!.value.set(bw * dpr, bh * dpr)
  // Height-normalized p halves vertical span vs UV×zoom; use a higher zoom band.
  material.uniforms.u_shapeZoom!.value = THREE.MathUtils.clamp(
    310 / Math.max(bh, 26),
    3.4,
    8.2,
  )
  material.uniforms.u_color!.value.set(parseAccent(tocRootRef.value))

  const txt = items.value.find(i => i.id === activeId.value)?.text ?? ''
  drawTextMask(bw, bh, txt)

  renderer.render(scene!, camera!)
}

function scheduleSync() {
  cancelAnimationFrame(syncRaf)
  syncRaf = requestAnimationFrame(() => {
    syncCompositor()
    syncRaf = 0
  })
}

function bindScrollResizeSync() {
  if (scrollCleanup) {
    scrollCleanup()
    scrollCleanup = null
  }

  const onMove = () => scheduleSync()
  window.addEventListener('resize', onMove, { passive: true })

  const scrollRoots: HTMLElement[] = []
  if (scrollRootEl instanceof HTMLElement)
    scrollRoots.push(scrollRootEl)

  for (const sr of scrollRoots)
    sr.addEventListener('scroll', onMove, { passive: true })

  scrollCleanup = () => {
    window.removeEventListener('resize', onMove)
    for (const sr of scrollRoots)
      sr.removeEventListener('scroll', onMove)
  }
}

function animateThree() {
  rafThree = requestAnimationFrame(animateThree)
  if (!threeReady || !material || !renderer || !scene || !camera || !clock)
    return
  if (!activeId.value || !listWrapRef.value)
    return
  material.uniforms.u_time!.value = clock.getElapsedTime()
  renderer.render(scene, camera)
}

function disposeThree() {
  cancelAnimationFrame(rafThree)
  cancelAnimationFrame(syncRaf)
  rafThree = 0
  syncRaf = 0

  listResizeObs?.disconnect()
  listResizeObs = null

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

function initThree() {
  const cn = punchCanvasRef.value
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
    fragmentShader: tocActivePunchFrag,
    uniforms: {
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_time: { value: 0 },
      u_color: { value: new THREE.Color(parseAccent(tocRootRef.value)) },
      u_wobble: { value: 0.0361 },
      u_chiselDepth: { value: 0.0206 },
      u_chiselDensity: { value: 8 },
      u_chiselChaos: { value: 1 },
      u_densityVar: { value: 0.896 },
      u_depthEffect: { value: 0.164 },
      u_hoverFlameState: { value: 0 },
      u_shapeZoom: { value: 6 },
      u_textMask: { value: textTexture },
    },
    transparent: true,
    depthWrite: false,
    depthTest: false,
  })

  mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
  scene.add(mesh)

  threeReady = true
  rafThree = requestAnimationFrame(animateThree)
}

function collectHeadings() {
  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (scrollCleanup) {
    scrollCleanup()
    scrollCleanup = null
  }

  items.value.length = 0
  activeId.value = ''
  scrollRootEl = null

  const caseRoot = tocRootRef.value?.closest('.animate-fade-in') ?? null
  if (!caseRoot) {
    return
  }

  const headings = Array.from(caseRoot.querySelectorAll('section h2')) as HTMLElement[]
  if (headings.length === 0) {
    return
  }

  const firstTarget = headings[0]!
  scrollRootEl =
    (firstTarget.closest('.dl-embedded') as HTMLElement | null)
    ?? ((getScrollParent(firstTarget) instanceof HTMLElement)
      ? (getScrollParent(firstTarget) as HTMLElement)
      : null)

  bindScrollResizeSync()

  const usedSectionIds = new Set<string>()
  headings.forEach((heading, index) => {
    const text = heading.textContent?.trim()
    if (!text)
      return

    const sec = heading.closest('section') as HTMLElement | null
    const slug = slugifyHeading(text, index)

    let scrollId: string
    if (sec) {
      if (!sec.id) {
        let candidate = slug
        for (let n = 2; document.getElementById(candidate); n++)
          candidate = `${slug}-${n}`
        sec.id = candidate
        scrollId = sec.id
        usedSectionIds.add(sec.id)
      }
      else if (!usedSectionIds.has(sec.id)) {
        usedSectionIds.add(sec.id)
        scrollId = sec.id
      }
      else {
        const hid = `toc-h2-${slug}-${index}`
        if (!heading.id)
          heading.id = hid
        scrollId = heading.id
      }
    }
    else {
      const hid = heading.id || `toc-h2-${slug}-${index}`
      if (!heading.id)
        heading.id = hid
      scrollId = heading.id
    }

    items.value.push({ id: scrollId, text })
  })

  const ioOpts: IntersectionObserverInit =
    scrollRootEl
      ? {
          root: scrollRootEl,
          rootMargin: '-12% 0px -45% 0px',
          threshold: [0, 0.15, 0.35, 0.55, 0.75, 1.0],
        }
      : {
          rootMargin: '-10% 0px -60% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1.0],
        }

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = visibleEntries[0]!.target.id
        activeId.value = id
      }
    },
    ioOpts,
  )

  items.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el)
      observer!.observe(el)
  })
}

watch(activeId, async () => {
  await nextTick()
  if (!threeReady && punchCanvasRef.value && items.value.length)
    initThree()
  scheduleSync()
})

onMounted(async () => {
  await nextTick()
  await nextTick()
  collectHeadings()
  await nextTick()
  if (listWrapRef.value) {
    listResizeObs?.disconnect()
    listResizeObs = new ResizeObserver(() => scheduleSync())
    listResizeObs.observe(listWrapRef.value)
  }
  if (punchCanvasRef.value && items.value.length && !threeReady)
    initThree()
  scheduleSync()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (scrollCleanup) {
    scrollCleanup()
    scrollCleanup = null
  }
  disposeThree()
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el)
    return

  activeId.value = id

  const scroller = scrollRootEl ?? getScrollParent(el)
  const offset = 96

  if (scroller === window) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
  else {
    const s = scroller as HTMLElement
    const elRect = el.getBoundingClientRect()
    const rootRect = s.getBoundingClientRect()
    const y = elRect.top - rootRect.top + s.scrollTop - offset
    s.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }

  window.setTimeout(() => scheduleSync(), 320)
}
</script>

<template>
  <nav ref="tocRootRef" class="toc-panel">
    <div class="toc-header">
      <h4 class="toc-title">
        Contents
      </h4>
    </div>

    <div ref="listWrapRef" class="toc-list-wrap">
      <canvas
        ref="punchCanvasRef"
        class="toc-active-punch"
        aria-hidden="true"
      />
      <ul class="toc-list" role="list">
        <li v-for="item in items" :key="item.id" class="toc-item">
          <button
            type="button"
            class="toc-btn"
            :class="{ 'toc-btn--active': activeId === item.id }"
            :aria-current="activeId === item.id ? 'location' : undefined"
            @click="scrollTo(item.id)"
          >
            <span class="toc-btn__label">{{ item.text }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.toc-panel {
  width: 100%;
  padding: 16px;
  position: relative;
  background: transparent;
  border: none;
  box-shadow: none;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 35%, transparent 65%);
}

.toc-title {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-text-muted);
  margin: 0;
}

.toc-list-wrap {
  position: relative;
  isolation: isolate;
}

/* Punch-out sits beneath the stacked rows (only row geometry is drawn by JS). */
.toc-active-punch {
  position: absolute;
  left: 0;
  width: 100%;
  height: 0;
  top: 0;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
  display: block;
  border-radius: 0 6px 6px 0;
  transition: opacity 0.14s ease;
}

.toc-list {
  position: relative;
  z-index: 2;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toc-item {
  margin: 0;
}

.toc-btn {
  width: 100%;
  text-align: left;
  padding: 8px 8px 8px 12px;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition:
    background 110ms var(--ease-te-snap),
    border-color 110ms ease;
  overflow-wrap: anywhere;
}

.toc-btn__label {
  display: inline;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  line-height: 1.45;
}

.toc-btn:hover .toc-btn__label {
  color: var(--color-text);
}

.toc-btn:hover {
  background: color-mix(in srgb, var(--color-accent) 8%, transparent 92%);
  border-left-color: color-mix(in srgb, var(--color-accent) 45%, transparent 55%);
}

.toc-btn--active {
  border-left-color: var(--color-accent);
  background: color-mix(in srgb, var(--color-elevated, #1a1512) 45%, transparent 55%);
}

/* Stroked glyphs so punched regions still read cleanly over animated fill */
.toc-btn--active .toc-btn__label {
  color: transparent;
  font-weight: 800;
  -webkit-text-stroke: 0.75px rgba(255, 250, 240, 0.92);
  text-shadow:
    0 0 16px rgba(0, 0, 0, 0.6),
    0 3px 8px rgba(0, 0, 0, 0.75);
}

.toc-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
</style>
