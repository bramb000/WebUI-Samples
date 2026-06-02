import { nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import { CARD_BLEED_PX } from '../vfx/chiselRimBake'
import {
  bakeRosterCardFrameGrainImage,
  onRosterPaintMaskReady,
} from '../vfx/rosterCardPaintBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

function readTokenNumber(el: HTMLElement, name: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

/**
 * Hue-shifted paint grain for parchment panel (not insight/metric cards).
 * Bakes to the full sheet + chisel bleed; composited with CSS mask from the baked plate.
 */
export type ChiselPlateGrainOptions = {
  bleedPx?: number
  /** CSS color token for hue-shifted multiply tint (e.g. parchment or insight fill). */
  fillCssVar?: string
  fillFallbackHex?: string
  grainOverlayStrengthVar?: string
}

export function useInsightCardGrain(
  frameRef: Ref<HTMLElement | null>,
  seed: Ref<number>,
  bleedPxOrOptions: number | ChiselPlateGrainOptions = CARD_BLEED_PX,
) {
  const opts =
    typeof bleedPxOrOptions === 'number'
      ? { bleedPx: bleedPxOrOptions }
      : bleedPxOrOptions
  const bleedPx = opts.bleedPx ?? CARD_BLEED_PX
  const fillCssVar = opts.fillCssVar ?? '--case-insight-surface-fill'
  const fillFallbackHex = opts.fillFallbackHex ?? '#6b3337'
  const grainOverlayStrengthVar =
    opts.grainOverlayStrengthVar ?? '--case-insight-grain-overlay-strength'
  const grainUrl = ref<string | null>(null)
  let resizeObserver: ResizeObserver | null = null
  let rebakeTimer = 0

  const stopMaskWatch = onRosterPaintMaskReady(() => scheduleRebake())

  function rebake(attempt = 0) {
    const el = frameRef.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const w = r.width + bleedPx * 2
    const h = r.height + bleedPx * 2
    if (w < 8 || h < 8) {
      if (attempt < 48)
        requestAnimationFrame(() => rebake(attempt + 1))
      return
    }

    const baseColorHex = resolveCssColorToHex(el, fillCssVar, fillFallbackHex)
    const overlayStrength = readTokenNumber(el, grainOverlayStrengthVar, 0.38)

    const url = bakeRosterCardFrameGrainImage({
      widthCss: w,
      heightCss: h,
      baseColorHex,
      seed: seed.value,
      overlayStrength,
    })

    if (!url) {
      if (attempt < 48)
        requestAnimationFrame(() => rebake(attempt + 1))
      return
    }

    grainUrl.value = url
  }

  function scheduleRebake() {
    if (rebakeTimer) window.clearTimeout(rebakeTimer)
    rebakeTimer = window.setTimeout(() => {
      rebakeTimer = 0
      rebake()
    }, 80)
  }

  onMounted(() => {
    nextTick(() => {
      scheduleRebake()
      const el = frameRef.value
      if (!el) return
      resizeObserver = new ResizeObserver(() => scheduleRebake())
      resizeObserver.observe(el)
    })
  })

  watch(seed, () => scheduleRebake())

  watch(frameRef, (el, prev) => {
    if (prev && resizeObserver) resizeObserver.unobserve(prev)
    if (el && resizeObserver) {
      resizeObserver.observe(el)
      scheduleRebake()
    }
  })

  onBeforeUnmount(() => {
    stopMaskWatch()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (rebakeTimer) {
      window.clearTimeout(rebakeTimer)
      rebakeTimer = 0
    }
    grainUrl.value = null
  })

  return {
    grainUrl,
    scheduleRebake,
  }
}
