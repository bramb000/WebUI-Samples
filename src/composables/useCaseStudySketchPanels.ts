import { nextTick, onBeforeUnmount, onMounted, type Ref, watch } from 'vue'
import {
  bakePencilFrameImage,
  PENCIL_DIVIDER_BLEED_PX,
  PENCIL_FRAME_BLEED_PX,
  type PencilBakeVariant,
} from '../vfx/pencilFrameBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

const PENCIL_BAKED_CLASS = 'pencil-baked'

type BoundKind = 'panel' | 'divider-h' | 'divider-v'

type BoundEntry = {
  kind: BoundKind
  ro: ResizeObserver | null
  timer: number
  blobUrl: string | null
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

function dividerVariant(el: HTMLElement): PencilBakeVariant | null {
  if (!el.classList.contains('case-divider'))
    return null
  return el.classList.contains('case-divider--vertical') ? 'vline' : 'hline'
}

function ensureSectionDivider(section: HTMLElement): HTMLElement {
  let divider = section.querySelector<HTMLElement>(':scope > .case-divider')
  if (!divider) {
    divider = document.createElement('div')
    divider.className = 'case-divider'
    divider.setAttribute('aria-hidden', 'true')
    section.insertBefore(divider, section.firstChild)
  }
  return divider
}

export function useCaseStudySketchPanels(rootRef: Ref<HTMLElement | null>) {
  const bound = new Map<HTMLElement, BoundEntry>()

  function revokeBlob(el: HTMLElement) {
    const entry = bound.get(el)
    if (entry?.blobUrl) {
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

    el.classList.add(PENCIL_BAKED_CLASS)
    entry.blobUrl = dataUrl
    el.style.setProperty('--pencil-frame-image', `url("${dataUrl}")`)
    el.style.setProperty('--pencil-bleed', `${bleedPx}px`)
  }

  function rebake(el: HTMLElement, attempt = 0) {
    const entry = bound.get(el)
    if (!entry)
      return

    const r = el.getBoundingClientRect()
    const minW = entry.kind === 'divider-v' ? 2 : 8
    const minH = entry.kind === 'divider-h' ? 2 : 8
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

    if (entry.kind === 'divider-h') {
      variant = 'hline'
      heightCss = Math.max(r.height, 10)
      bleedPx = PENCIL_DIVIDER_BLEED_PX
    }
    else if (entry.kind === 'divider-v') {
      variant = 'vline'
      widthCss = Math.max(r.width, 10)
      bleedPx = PENCIL_DIVIDER_BLEED_PX
    }

    const url = bakePencilFrameImage({
      widthCss,
      heightCss,
      strokeColorHex: stroke,
      fillColorHex: fill,
      bleedPx,
      variant,
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

  function bind(el: HTMLElement, kind: BoundKind) {
    if (bound.has(el))
      return
    bound.set(el, { kind, ro: null, timer: 0, blobUrl: null })
    rebake(el)
    const ro = new ResizeObserver(() => scheduleRebake(el))
    ro.observe(el)
    bound.get(el)!.ro = ro
  }

  function scan() {
    const root = rootRef.value
    if (!root) {
      teardown()
      return
    }

    const next = new Map<HTMLElement, BoundKind>()

    for (const el of root.querySelectorAll<HTMLElement>('.panel-recessed')) {
      if (shouldBindPanel(el))
        next.set(el, 'panel')
    }

    for (const divider of root.querySelectorAll<HTMLElement>('.case-divider')) {
      const variant = dividerVariant(divider)
      if (variant)
        next.set(divider, variant === 'vline' ? 'divider-v' : 'divider-h')
    }

    for (const section of root.querySelectorAll<HTMLElement>('.case-divider-section')) {
      const divider = ensureSectionDivider(section)
      next.set(divider, 'divider-h')
    }

    for (const el of [...bound.keys()]) {
      if (!next.has(el))
        clearBound(el)
    }

    for (const [el, kind] of next)
      bind(el, kind)
  }

  onMounted(() => {
    nextTick(() => {
      scan()
      requestAnimationFrame(() => {
        scan()
        window.setTimeout(scan, 200)
      })
    })
  })

  watch(
    () => rootRef.value,
    () => nextTick(scan),
  )

  onBeforeUnmount(teardown)
}
