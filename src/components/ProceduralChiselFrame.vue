<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { bakeChiselRimImage, CARD_BLEED_PX } from '../vfx/chiselRimBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

const props = withDefaults(
  defineProps<{
    color?: string
    /** Cards use a prebaked static rim; live ink is reserved for work panels. */
    hoverFlame?: boolean
  }>(),
  {
    color: 'var(--case-insight-surface-before)',
    hoverFlame: false,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const rimUrl = ref<string | null>(null)
let cancelled = false
let resizeObserver: ResizeObserver | null = null
let rebakeTimer = 0

const rimStyle = computed(() => {
  if (!rimUrl.value) return undefined
  return {
    '--chisel-rim-image': `url("${rimUrl.value}")`,
    '--chisel-bleed': `${CARD_BLEED_PX}px`,
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
  const hex = /^#[0-9a-fA-F]{6}$/.test(trimmed) || /^#[0-9a-fA-F]{3}$/.test(trimmed)
    ? trimmed
    : resolveCssColorToHex(el, props.color, '#b84e55')
  const url = bakeChiselRimImage({
    widthCss: r.width,
    heightCss: r.height,
    colorHex: hex,
    bleedPx: CARD_BLEED_PX,
    depthEffect: 0,
    cleanRim: false,
    flatRim: false,
    panelFill: true,
    monotoneFill: true,
    borderPx: 8,
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
  () => props.color,
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
  <div ref="rootRef" class="chisel-frame" :style="rimStyle">
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

.chisel-frame__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  min-height: 0;
}
</style>
