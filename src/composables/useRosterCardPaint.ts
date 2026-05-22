import { onBeforeUnmount, ref } from 'vue'
import {
  ROSTER_DISCIPLINE_ACCENT,
  type RosterDiscipline,
} from '../constants/rosterDiscipline'
import {
  bakeRosterCardFrameGrainImage,
  onRosterPaintMaskReady,
  ROSTER_PAINT_MASK_URL,
} from '../vfx/rosterCardPaintBake'

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

    if (el instanceof HTMLElement) {
      thumbEls.set(id, el)
      gridObserver?.observe(el)
    }
    else {
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
      const plateH = r.height * NAME_PLATE_FRAC
      const discipline = (el.dataset.rosterDiscipline ?? 'ui-design') as RosterDiscipline
      const baseColorHex = ROSTER_DISCIPLINE_ACCENT[discipline] ?? ROSTER_DISCIPLINE_ACCENT['ui-design']
      const url = bakeRosterCardFrameGrainImage({
        widthCss: r.width,
        heightCss: plateH,
        baseColorHex,
        seed: seedFromId(id),
        overlayStrength: 0.38,
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
