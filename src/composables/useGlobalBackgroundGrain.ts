import { nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import { bakeRosterCardFrameGrainImage, onRosterPaintMaskReady } from '../vfx/rosterCardPaintBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

function readTokenNumber(el: HTMLElement, name: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export function useGlobalBackgroundGrain(surfaceRef: Ref<HTMLElement | null>, seed: Ref<number>) {
  const grainUrl = ref<string | null>(null)
  let resizeObserver: ResizeObserver | null = null
  let rebakeTimer = 0

  const stopMaskWatch = onRosterPaintMaskReady(() => scheduleRebake())

  function rebake(attempt = 0) {
    const el = surfaceRef.value
    if (!el) return

    const r = el.getBoundingClientRect()
    if (r.width < 8 || r.height < 8) {
      if (attempt < 48) requestAnimationFrame(() => rebake(attempt + 1))
      return
    }

    const baseColorHex = resolveCssColorToHex(el, 'var(--color-bg)', '#111113')
    const overlayStrength = readTokenNumber(el, '--global-bg-grain-overlay-strength', 0.14)

    const url = bakeRosterCardFrameGrainImage({
      widthCss: r.width,
      heightCss: r.height,
      baseColorHex,
      seed: seed.value,
      overlayStrength,
    })

    if (!url) {
      if (attempt < 48) requestAnimationFrame(() => rebake(attempt + 1))
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
      const el = surfaceRef.value
      if (!el) return
      resizeObserver = new ResizeObserver(() => scheduleRebake())
      resizeObserver.observe(el)
    })
  })

  watch(seed, () => scheduleRebake())

  watch(surfaceRef, (el, prev) => {
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

