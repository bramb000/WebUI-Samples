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
    color: 'var(--case-insight-change)',
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
  const hex = resolveCssColorToHex(el, props.color, '#4ade80')
  const url = bakeChiselRimImage({
    widthCss: r.width,
    heightCss: r.height,
    colorHex: hex,
    bleedPx: CARD_BLEED_PX,
    depthEffect: 0,
  })
  if (!cancelled && url) rimUrl.value = url
}

onMounted(() => {
  nextTick(() => {
    if (cancelled) return
    const el = rootRef.value
    if (!el) return
    void rebakeRim()
    resizeObserver = new ResizeObserver(() => scheduleRebake())
    resizeObserver.observe(el)
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
}

.chisel-frame::before {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--chisel-bleed, 10px));
  background-image: var(--chisel-rim-image);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 2;
}

.chisel-frame__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
