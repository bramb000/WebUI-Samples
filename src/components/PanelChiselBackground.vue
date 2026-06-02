<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { captureVfxRenderStatus } from '../analytics'
import { useInsightCardGrain } from '../composables/useInsightCardGrain'
import {
  registerChiselFrame,
  unregisterChiselFrame,
} from '../vfx/chiselFrameOverlay'
import { bakeChiselRimImage } from '../vfx/chiselRimBake'

/** Rim + fill match parchment (`--paper-surface-fill`) */
const PAPER_STROKE = '#ebe4d6'
/** Deckled edge bleeds into `.panel-chisel-bg` padding gutter */
const PANEL_BLEED_PX = 36

withDefaults(
  defineProps<{
    /** `/work` detail column — symmetric 8pt gutter + bleed on block axis */
    workStageInset?: boolean
  }>(),
  { workStageInset: false },
)

const trackRef = ref<HTMLElement | null>(null)
let frameId: number | null = null
let cancelled = false
let maskRebakeTimer = 0
let resizeObserver: ResizeObserver | null = null

/** Baked alpha mask only — live WebGL draws the visible plate */
const maskRimUrl = ref<string | null>(null)

const grainSeed = ref(8401)
const { grainUrl } = useInsightCardGrain(trackRef, grainSeed, {
  bleedPx: PANEL_BLEED_PX,
  fillCssVar: '--paper-surface-fill',
  fillFallbackHex: PAPER_STROKE,
  grainOverlayStrengthVar: '--paper-grain-overlay-strength',
})

const textureStyle = computed(() => {
  if (!maskRimUrl.value) return undefined
  return {
    '--panel-chisel-mask': `url("${maskRimUrl.value}")`,
    '--panel-chisel-bleed': `${PANEL_BLEED_PX}px`,
  } as Record<string, string>
})

function scheduleMaskRebake() {
  if (maskRebakeTimer) window.clearTimeout(maskRebakeTimer)
  maskRebakeTimer = window.setTimeout(() => {
    maskRebakeTimer = 0
    void rebakeMaskRim()
  }, 120)
}

async function rebakeMaskRim() {
  if (cancelled) return
  const el = trackRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return
  const url = bakeChiselRimImage({
    widthCss: r.width,
    heightCss: r.height,
    colorHex: PAPER_STROKE,
    bleedPx: PANEL_BLEED_PX,
    depthEffect: 0,
    cleanRim: false,
    flatRim: false,
    panelFill: true,
    monotoneFill: true,
    borderPx: 8,
  })
  if (!cancelled && url) maskRimUrl.value = url
}

function startLiveFrame() {
  const el = trackRef.value
  if (!el || frameId != null) return
  frameId = registerChiselFrame(el, {
    colorHex: PAPER_STROKE,
    fillColorHex: PAPER_STROKE,
    hoverFlame: false,
    panelFill: true,
    monotoneFill: true,
    flatRim: false,
    bleedPx: PANEL_BLEED_PX,
    skipAncestorClip: true,
  })
  captureVfxRenderStatus('work_panel_chisel', { mode: 'webgl' })
}

onMounted(() => {
  nextTick(() => {
    if (cancelled) return
    const el = trackRef.value
    if (!el) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return
        startLiveFrame()
        void rebakeMaskRim()
        resizeObserver = new ResizeObserver(() => scheduleMaskRebake())
        resizeObserver.observe(el)
      })
    })
  })
})

onBeforeUnmount(() => {
  cancelled = true
  if (maskRebakeTimer) window.clearTimeout(maskRebakeTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
  if (frameId != null) {
    unregisterChiselFrame(frameId)
    frameId = null
  }
  maskRimUrl.value = null
})
</script>

<template>
  <div
    class="panel-chisel-bg"
    :class="{ 'panel-chisel-bg--work-stage': workStageInset }"
    data-surface="paper"
  >
    <div ref="trackRef" class="panel-chisel-bg__sheet">
      <div
        v-if="grainUrl && maskRimUrl"
        class="panel-chisel-bg__texture"
        :style="textureStyle"
        aria-hidden="true"
      >
        <img class="panel-chisel-bg__texture-img" :src="grainUrl" alt="" aria-hidden="true" />
      </div>
      <div class="panel-chisel-bg__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-chisel-bg {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: visible;
  color: var(--color-text);
  box-sizing: border-box;
  padding: var(--grid-5);
}

.panel-chisel-bg--work-stage {
  padding-block: var(--panel-chisel-bleed, 36px);
  padding-inline: var(--work-panel-padding-inline, var(--grid-3));
}

.panel-chisel-bg__sheet {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: visible;
  background: transparent;
}

/* Paint grain — masked to plate shape; live WebGL draws fill + deckle underneath */
.panel-chisel-bg__texture {
  position: absolute;
  inset: calc(-1 * var(--panel-chisel-bleed, 36px));
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  -webkit-mask-image: var(--panel-chisel-mask, none);
  mask-image: var(--panel-chisel-mask, none);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-mode: alpha;
  mask-mode: alpha;
}

.panel-chisel-bg__texture-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  mix-blend-mode: var(--paper-grain-blend, multiply);
  opacity: var(--paper-grain-opacity, 0.48);
  user-select: none;
}

.panel-chisel-bg__content {
  position: relative;
  z-index: 2;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
