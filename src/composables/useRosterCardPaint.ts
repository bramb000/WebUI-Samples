import { onBeforeUnmount, ref } from 'vue'
import {
  bakeRosterCardFrameGrainImage,
  onRosterPaintMaskReady,
  ROSTER_PAINT_MASK_URL,
} from '../vfx/rosterCardPaintBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

/** Text plate band (no image) — bottom of card. */
const NAME_PLATE_FRAC = 0.4

function seedFromId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++)
    h = (h * 31 + id.charCodeAt(i)) | 0
  return Math.abs(h) % 1000
}

export function useRosterCardPaint() {
  const plateGrainBakes = ref<Record<string, string>>({})
  const thumbEls = new Map<string, HTMLElement>()
  let gridObserver: ResizeObserver | null = null
  let rebakeTimer = 0

  const stopMaskWatch = onRosterPaintMaskReady(() => scheduleRebake())

  function setThumbRef(id: string, el: unknown) {
    const prev = thumbEls.get(id)
    if (prev && gridObserver)
      gridObserver.unobserve(prev)

    const resolved =
      el instanceof HTMLElement
        ? el
        : el != null && typeof el === 'object' && '$el' in el && (el as { $el: unknown }).$el instanceof HTMLElement
          ? ((el as { $el: HTMLElement }).$el)
          : null

    if (resolved) {
      thumbEls.set(id, resolved)
      gridObserver?.observe(resolved)
    } else {
      thumbEls.delete(id)
    }
    scheduleRebake()
  }

  function rebakeAll(attempt = 0) {
    let pending = false
    for (const [id, el] of thumbEls) {
      const card = el.querySelector('.inner-card') as HTMLElement | null
      const r = (card ?? el).getBoundingClientRect()
      if (r.width < 8 || r.height < 8) {
        pending = true
        continue
      }
      const plateEl = card?.querySelector('.card-name-plate') as HTMLElement | null
      const plateRect = plateEl?.getBoundingClientRect()
      const plateH =
        plateRect && plateRect.height >= 8
          ? plateRect.height
          : r.height * NAME_PLATE_FRAC
      const baseColorHex = resolveCssColorToHex(
        card ?? el,
        'var(--roster-card-grain-base)',
        '#e0d8c8',
      )
      const overlayStrength = Number.parseFloat(
        getComputedStyle(card ?? el).getPropertyValue('--roster-card-grain-strength').trim(),
      )
      const url = bakeRosterCardFrameGrainImage({
        widthCss: r.width,
        heightCss: plateH,
        baseColorHex,
        seed: seedFromId(id),
        overlayStrength: Number.isFinite(overlayStrength) ? overlayStrength : 0.19,
      })
      if (!url) {
        pending = true
        continue
      }
      plateGrainBakes.value = { ...plateGrainBakes.value, [id]: url }
    }
    if (pending && attempt < 48)
      requestAnimationFrame(() => rebakeAll(attempt + 1))
  }

  function scheduleRebake() {
    if (rebakeTimer)
      window.clearTimeout(rebakeTimer)
    rebakeTimer = window.setTimeout(() => {
      rebakeTimer = 0
      rebakeAll()
    }, 80)
  }

  function observeGrid(el: HTMLElement | null) {
    if (gridObserver) {
      gridObserver.disconnect()
      gridObserver = null
    }
    if (!el)
      return
    gridObserver = new ResizeObserver(scheduleRebake)
    gridObserver.observe(el)
    for (const thumb of thumbEls.values())
      gridObserver.observe(thumb)
    scheduleRebake()
  }

  onBeforeUnmount(() => {
    stopMaskWatch()
    if (gridObserver) {
      gridObserver.disconnect()
      gridObserver = null
    }
    if (rebakeTimer) {
      window.clearTimeout(rebakeTimer)
      rebakeTimer = 0
    }
  })

  return {
    plateGrainBakes,
    rosterPaintMaskUrl: ROSTER_PAINT_MASK_URL,
    setThumbRef,
    observeGrid,
    scheduleRebake,
  }
}
