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
 * Hue-shifted paint grain for insight/metric plates.
 * Bakes to the full card + chisel bleed; composited with CSS mask from the baked plate.
 */
export function useInsightCardGrain(
  frameRef: Ref<HTMLElement | null>,
  seed: Ref<number>,
  bleedPx = CARD_BLEED_PX,
) {
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

    const baseColorHex = resolveCssColorToHex(
      el,
      'var(--case-insight-surface-fill)',
      '#b84e55',
    )
    const overlayStrength = readTokenNumber(
      el,
      '--case-insight-grain-overlay-strength',
      0.38,
    )

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
