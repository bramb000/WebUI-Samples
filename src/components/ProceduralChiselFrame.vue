<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  bakeChiselRimImage,
  CARD_BLEED_PX,
  CARD_ORGANIC_AMP_PX,
  CHISEL_PLATE_CORNER_RADIUS_CSS,
} from '../vfx/chiselRimBake'
import { resolveCssColorToHex, resolveCssLengthPx } from '../vfx/resolveCssColorToHex'

const props = withDefaults(
  defineProps<{
    color?: string
    /** Cards use a prebaked static rim; live ink is reserved for work panels. */
    hoverFlame?: boolean
    /** Gutter beyond bounds for chisel rim bleed (parchment uses a larger bleed). */
    bleedPx?: number
    borderPx?: number
    /**
     * Chisel stroke only — interior fill comes from {@link plateFill} on the body
     * (hero videos: flat cream must match keyed letterbox pixels, not baked tone).
     */
    plateStrokeOnly?: boolean
    /** CSS color for plate interior when {@link plateStrokeOnly} */
    plateFill?: string
    /** Multiply grain baked to full plate + bleed; masked by the chisel bake. */
    textureGrainUrl?: string | null
  }>(),
  {
    color: 'var(--case-insight-surface-before)',
    hoverFlame: false,
    bleedPx: CARD_BLEED_PX,
    borderPx: 8,
    plateStrokeOnly: false,
    plateFill: 'var(--home-work-video-cream)',
    textureGrainUrl: null,
  },
)

const rootRef = ref<HTMLElement | null>(null)

defineExpose({ rootEl: rootRef })
const rimUrl = ref<string | null>(null)
let cancelled = false
let resizeObserver: ResizeObserver | null = null
let rebakeTimer = 0

const bleedCss = computed(() => `${props.bleedPx}px`)

const rimStyle = computed(() => {
  if (!rimUrl.value) return undefined
  return {
    '--chisel-rim-image': `url("${rimUrl.value}")`,
    '--chisel-bleed': bleedCss.value,
  } as Record<string, string>
})

function scheduleRebake() {
  if (rebakeTimer) window.clearTimeout(rebakeTimer)
  rebakeTimer = window.setTimeout(() => {
    rebakeTimer = 0
    void rebakeRim()
  }, 120)
}

async function rebakeRim() {
  if (cancelled) return
  const el = rootRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  if (r.width < 2 || r.height < 2) return
  const trimmed = props.color.trim()
  const hex =
    /^#[0-9a-fA-F]{6}$/.test(trimmed) || /^#[0-9a-fA-F]{3}$/.test(trimmed)
      ? trimmed
      : resolveCssColorToHex(el, props.color, '#c4565e')
  const url = bakeChiselRimImage({
    widthCss: r.width,
    heightCss: r.height,
    colorHex: hex,
    bleedPx: props.bleedPx,
    depthEffect: 0,
    flatRim: false,
    panelFill: !props.plateStrokeOnly,
    monotoneFill: !props.plateStrokeOnly,
    organicAmpPx: props.plateStrokeOnly ? 0 : CARD_ORGANIC_AMP_PX,
    borderPx: props.borderPx,
    cornerRadiusCss: resolveCssLengthPx(
      el,
      'var(--dl-border-radius)',
      CHISEL_PLATE_CORNER_RADIUS_CSS,
    ),
  })
  if (!cancelled && url) rimUrl.value = url
}

onMounted(() => {
  nextTick(() => {
    if (cancelled) return
    const el = rootRef.value
    if (!el) return
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return
        void rebakeRim().then(() => {
          if (!cancelled && !rimUrl.value) scheduleRebake()
        })
        resizeObserver = new ResizeObserver(() => scheduleRebake())
        resizeObserver.observe(el)
      })
    })
  })
})

watch(
  () =>
    [
      props.color,
      props.borderPx,
      props.bleedPx,
      props.plateStrokeOnly,
      props.plateFill,
    ] as const,
  () => scheduleRebake(),
)

onBeforeUnmount(() => {
  cancelled = true
  if (rebakeTimer) window.clearTimeout(rebakeTimer)
  resizeObserver?.disconnect()
  resizeObserver = null
  rimUrl.value = null
})
</script>

<template>
  <div
    ref="rootRef"
    class="chisel-frame"
    :class="{ 'chisel-frame--stroke-only-plate': plateStrokeOnly }"
    :style="rimStyle"
  >
    <div
      v-if="textureGrainUrl && rimUrl"
      class="chisel-frame__texture"
      aria-hidden="true"
    >
      <img class="chisel-frame__texture-img" :src="textureGrainUrl" alt="" />
    </div>
    <div class="chisel-frame__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.chisel-frame {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: auto;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  overflow: visible;
}

/* Baked plate (fill + deckle) — must live in DOM; page bg sits above fixed WebGL canvas */
/* Baked plate: fill + chisel border in one tone */
.chisel-frame::before {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--chisel-bleed, 16px));
  z-index: 0;
  background-image: var(--chisel-rim-image, none);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
}

/* Paint grain — full piece, clipped to the baked plate alpha */
.chisel-frame__texture {
  position: absolute;
  inset: calc(-1 * var(--chisel-bleed, 16px));
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
  -webkit-mask-image: var(--chisel-rim-image, none);
  mask-image: var(--chisel-rim-image, none);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-mode: alpha;
  mask-mode: alpha;
}

.chisel-frame__texture-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
  mix-blend-mode: var(--case-insight-grain-blend, multiply);
  opacity: var(--case-insight-grain-opacity, 0.58);
  user-select: none;
}

.chisel-frame__body {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  min-height: 0;
}

.chisel-frame--stroke-only-plate .chisel-frame__body {
  background: v-bind('plateFill');
}
</style>
