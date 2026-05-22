import { nextTick, onBeforeUnmount, onMounted, type Ref, watch } from 'vue'
import {
  bakePencilFrameImage,
  PENCIL_DIVIDER_BLEED_PX,
  PENCIL_FRAME_BLEED_PX,
  type PencilBakeVariant,
} from '../vfx/pencilFrameBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

const PENCIL_BAKED_CLASS = 'pencil-baked'
const HEADING_DIVIDER_CLASS = 'case-heading--has-divider'

type BoundKind = 'panel' | 'text-divider-h' | 'divider-v' | 'chip'

type BoundEntry = {
  kind: BoundKind
  ro: ResizeObserver | null
  timer: number
  blobUrl: string | null
}

const CASE_HEADING_SELECTOR = 'section :is(h2, h3, h4)[class*="type-case-"]'

function dataUrlToBlob(dataUrl: string): Blob {
  const [header = '', b64 = ''] = dataUrl.split(',')
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? 'image/png'
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++)
    bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

function shouldBindPanel(el: HTMLElement): boolean {
  if (!el.classList.contains('panel-recessed'))
    return false
  if (el.tagName === 'IMG')
    return false
  if (el.closest('.chisel-frame'))
    return false
  return true
}

function ensureTextDivider(host: HTMLElement): HTMLElement {
  let divider = host.querySelector<HTMLElement>(':scope > .case-text-divider')
  if (divider)
    return divider

  divider = document.createElement('span')
  divider.className = 'case-text-divider'
  divider.setAttribute('aria-hidden', 'true')
  host.appendChild(divider)
  return divider
}

/** Pencil line under heading copy (text width, not full section). */
function ensureHeadingTextDivider(heading: HTMLElement): HTMLElement {
  if (!heading.classList.contains(HEADING_DIVIDER_CLASS)) {
    const textWrap = document.createElement('span')
    textWrap.className = 'case-heading__text'
    while (heading.firstChild)
      textWrap.appendChild(heading.firstChild)
    heading.appendChild(textWrap)
    heading.classList.add(HEADING_DIVIDER_CLASS)
  }
  return ensureTextDivider(heading)
}

export function useCaseStudySketchPanels(rootRef: Ref<HTMLElement | null>) {
  const bound = new Map<HTMLElement, BoundEntry>()
  let scanMoTimer = 0
  let domObserver: MutationObserver | null = null

  function revokeBlob(el: HTMLElement) {
    const entry = bound.get(el)
    if (entry?.blobUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(entry.blobUrl)
      entry.blobUrl = null
    }
  }

  function clearBound(el: HTMLElement) {
    const entry = bound.get(el)
    if (entry) {
      if (entry.timer)
        window.clearTimeout(entry.timer)
      entry.ro?.disconnect()
      revokeBlob(el)
      bound.delete(el)
    }
    el.classList.remove(PENCIL_BAKED_CLASS)
    el.style.removeProperty('--pencil-frame-image')
    el.style.removeProperty('--pencil-bleed')
  }

  function teardown() {
    for (const el of [...bound.keys()])
      clearBound(el)
  }

  function applyBake(el: HTMLElement, dataUrl: string, bleedPx: number) {
    revokeBlob(el)
    const entry = bound.get(el)
    if (!entry)
      return

    const blobUrl = URL.createObjectURL(dataUrlToBlob(dataUrl))
    entry.blobUrl = blobUrl
    el.classList.add(PENCIL_BAKED_CLASS)
    el.style.setProperty('--pencil-frame-image', `url("${blobUrl}")`)
    el.style.setProperty('--pencil-bleed', `${bleedPx}px`)
  }

  function rebake(el: HTMLElement, attempt = 0) {
    const entry = bound.get(el)
    if (!entry)
      return

    const r = el.getBoundingClientRect()
    const minW = entry.kind === 'divider-v' ? 2 : 8
    const minH = entry.kind === 'text-divider-h' ? 2 : 8
    if (r.width < minW || r.height < minH) {
      if (attempt < 48)
        requestAnimationFrame(() => rebake(el, attempt + 1))
      return
    }

    const stroke = resolveCssColorToHex(el, 'var(--color-accent)', '#3d3830')
    const fill = resolveCssColorToHex(el, 'var(--color-surface)', '#e0d8c8')

    let variant: PencilBakeVariant = 'frame'
    let widthCss = r.width
    let heightCss = r.height
    let bleedPx = PENCIL_FRAME_BLEED_PX

    if (entry.kind === 'text-divider-h') {
      variant = 'hline'
      heightCss = Math.max(r.height, 10)
      bleedPx = PENCIL_DIVIDER_BLEED_PX
    }
    else if (entry.kind === 'divider-v') {
      variant = 'vline'
      widthCss = Math.max(r.width, 10)
      bleedPx = PENCIL_DIVIDER_BLEED_PX
    }
    else if (entry.kind === 'chip') {
      variant = 'frame'
      bleedPx = PENCIL_DIVIDER_BLEED_PX
    }

    const url = bakePencilFrameImage({
      widthCss,
      heightCss,
      strokeColorHex: stroke,
      fillColorHex: fill,
      bleedPx,
      variant,
      strokeOnly: entry.kind === 'chip',
      frameShape: entry.kind === 'chip' ? 'rect' : undefined,
    })

    if (!url) {
      if (attempt < 48)
        requestAnimationFrame(() => rebake(el, attempt + 1))
      return
    }

    applyBake(el, url, bleedPx)
  }

  function scheduleRebake(el: HTMLElement) {
    const entry = bound.get(el)
    if (!entry)
      return
    if (entry.timer)
      window.clearTimeout(entry.timer)
    entry.timer = window.setTimeout(() => {
      entry.timer = 0
      rebake(el)
    }, 120)
  }

  function bind(el: HTMLElement, kind: BoundKind, observeEl?: HTMLElement) {
    const existing = bound.get(el)
    if (existing) {
      if (!el.classList.contains(PENCIL_BAKED_CLASS))
        rebake(el)
      return
    }
    bound.set(el, { kind, ro: null, timer: 0, blobUrl: null })
    rebake(el)
    const ro = new ResizeObserver(() => scheduleRebake(el))
    ro.observe(observeEl ?? el)
    bound.get(el)!.ro = ro
  }

  function scan() {
    const root = rootRef.value
    if (!root) {
      teardown()
      return
    }

    const next = new Map<HTMLElement, { kind: BoundKind, observe?: HTMLElement }>()

    for (const el of root.querySelectorAll<HTMLElement>('.panel-recessed')) {
      if (shouldBindPanel(el))
        next.set(el, { kind: 'panel' })
    }

    for (const heading of root.querySelectorAll<HTMLElement>(CASE_HEADING_SELECTOR)) {
      const divider = ensureHeadingTextDivider(heading)
      next.set(divider, { kind: 'text-divider-h', observe: heading })
    }

    for (const divider of root.querySelectorAll<HTMLElement>('.case-divider--vertical')) {
      next.set(divider, { kind: 'divider-v' })
    }

    for (const chip of root.querySelectorAll<HTMLElement>('.case-pencil-chip:not([data-pencil-detached])')) {
      next.set(chip, { kind: 'chip' })
    }

    for (const el of [...bound.keys()]) {
      if (!next.has(el))
        clearBound(el)
    }

    for (const [el, { kind, observe }] of next)
      bind(el, kind, observe)
  }

  function scheduleScanFromDom() {
    if (scanMoTimer)
      window.clearTimeout(scanMoTimer)
    scanMoTimer = window.setTimeout(() => {
      scanMoTimer = 0
      scan()
    }, 80)
  }

  let visibilityObserver: IntersectionObserver | null = null

  onMounted(() => {
    nextTick(() => {
      scan()
      requestAnimationFrame(() => {
        scan()
        window.setTimeout(scan, 200)
        window.setTimeout(scan, 600)
        window.setTimeout(scan, 1500)
      })
    })

    domObserver = new MutationObserver(() => scheduleScanFromDom())

    visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting))
          scheduleScanFromDom()
      },
      { root: null, threshold: 0.01 },
    )
  })

  watch(
    () => rootRef.value,
    (root, prev) => {
      if (prev)
        visibilityObserver?.unobserve(prev)
      domObserver?.disconnect()
      if (root) {
        domObserver?.observe(root, { childList: true, subtree: true })
        visibilityObserver?.observe(root)
      }
      nextTick(scan)
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    domObserver?.disconnect()
    domObserver = null
    visibilityObserver?.disconnect()
    visibilityObserver = null
    if (scanMoTimer)
      window.clearTimeout(scanMoTimer)
    teardown()
  })
}
