<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { bakeChiselRimImage, CARD_BLEED_PX } from '../vfx/chiselRimBake'

/** Resolves `var(--token)` / `color-mix(...)` etc. for the static WebGL rim bake (needs a concrete hex). */
function resolveColorPropToHex(el: HTMLElement, cssColor: string): string {
  const t = cssColor.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(t) || /^#[0-9a-fA-F]{3}$/.test(t)) return t
  const probe = document.createElement('span')
  probe.style.cssText = `position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;color:${cssColor}`
  el.appendChild(probe)
  const rgb = getComputedStyle(probe).color
  el.removeChild(probe)
  const m = rgb.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (!m) return '#4ade80'
  const r = Math.round(Number(m[1]))
  const g = Math.round(Number(m[2]))
  const b = Math.round(Number(m[3]))
  return (
    '#' +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  )
}

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
  const hex = resolveColorPropToHex(el, props.color)
  const url = bakeChiselRimImage({
    widthCss: r.width,
    heightCss: r.height,
    colorHex: hex,
    bleedPx: CARD_BLEED_PX,
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
  min-width: 0;
  width: 100%;
}
</style>
