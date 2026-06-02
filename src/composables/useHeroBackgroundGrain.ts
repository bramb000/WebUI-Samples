import { nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import { bakeRosterCardFrameGrainImage, onRosterPaintMaskReady } from '../vfx/rosterCardPaintBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

function readTokenNumber(el: HTMLElement, name: string, fallback: number): number {
  const raw = getComputedStyle(el).getPropertyValue(name).trim()
  const n = Number.parseFloat(raw)
  return Number.isFinite(n) ? n : fallback
}

export function useHeroBackgroundGrain(surfaceRef: Ref<HTMLElement | null>, seed: Ref<number>) {
  const grainUrl = ref<string | null>(null)
  let resizeObserver: ResizeObserver | null = null
  let rebakeTimer = 0

  const isDev = import.meta.env.DEV
  const log = (msg: string, extra?: unknown) => {
    if (!isDev) return
    // eslint-disable-next-line no-console
    console.debug(`[hero-grain] ${msg}`, extra ?? '')
  }

  const stopMaskWatch = onRosterPaintMaskReady(() => {
    log('paint mask ready → rebake')
    scheduleRebake()
  })

  function rebake(attempt = 0) {
    const el = surfaceRef.value
    if (!el) return

    const r = el.getBoundingClientRect()
    if (r.width < 8 || r.height < 8) {
      if (attempt < 48) requestAnimationFrame(() => rebake(attempt + 1))
      return
    }

    const baseColorHex = resolveCssColorToHex(el, 'var(--color-bg)', '#f5f2eb')
    const overlayStrength = readTokenNumber(el, '--hero-bg-grain-overlay-strength', 0.16)

    const url = bakeRosterCardFrameGrainImage({
      widthCss: r.width,
      heightCss: r.height,
      baseColorHex,
      seed: seed.value,
      overlayStrength,
    })

    if (!url) {
      if (attempt === 0) {
        log('bake returned null', {
          w: r.width,
          h: r.height,
          baseColorHex,
          overlayStrength,
          seed: seed.value,
        })
      }
      if (attempt < 48) requestAnimationFrame(() => rebake(attempt + 1))
      return
    }

    grainUrl.value = url
    log('bake ok', { w: r.width, h: r.height, bytes: url.length })
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

