<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { bakePencilFrameImage } from '../vfx/pencilFrameBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

const props = defineProps<{
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  pick: []
}>()

const TOC_RING_PAD_PX = 5
const TOC_RING_BLEED_PX = 10

const rowRef = ref<HTMLElement | null>(null)
const ringImage = ref<string | null>(null)

let resizeObserver: ResizeObserver | null = null
let rebakeTimer = 0

function rebakeRing(attempt = 0) {
  const el = rowRef.value
  if (!el || !props.active)
    return

  const r = el.getBoundingClientRect()
  if (r.width < 8 || r.height < 8) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeRing(attempt + 1))
    return
  }

  const stroke = resolveCssColorToHex(el, 'var(--color-accent)', '#6b5a32')
  const url = bakePencilFrameImage({
    widthCss: r.width + TOC_RING_PAD_PX * 2,
    heightCss: r.height + TOC_RING_PAD_PX * 2,
    strokeColorHex: stroke,
    fillColorHex: '#000000',
    variant: 'frame',
    strokeOnly: true,
    bleedPx: TOC_RING_BLEED_PX,
  })

  if (!url) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeRing(attempt + 1))
    return
  }

  ringImage.value = url
}

function scheduleRebake() {
  if (rebakeTimer)
    window.clearTimeout(rebakeTimer)
  rebakeTimer = window.setTimeout(() => {
    rebakeTimer = 0
    rebakeRing()
  }, 100)
}

function startRing() {
  rebakeRing()
  if (!rowRef.value || resizeObserver)
    return
  resizeObserver = new ResizeObserver(scheduleRebake)
  resizeObserver.observe(rowRef.value)
}

function stopRing() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (rebakeTimer) {
    window.clearTimeout(rebakeTimer)
    rebakeTimer = 0
  }
  ringImage.value = null
}

watch(
  () => props.active,
  async (isActive) => {
    if (!isActive) {
      stopRing()
      return
    }
    await nextTick()
    startRing()
  },
  { immediate: true },
)

onBeforeUnmount(stopRing)

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('pick')
  }
}
</script>

<template>
  <div
    ref="rowRef"
    role="button"
    tabindex="0"
    class="toc-proc-row"
    :class="{ 'toc-proc-row--active': active }"
    :aria-current="active ? 'location' : undefined"
    :aria-label="label"
    @click="emit('pick')"
    @keydown="onKeydown"
  >
    <span
      v-if="active && ringImage"
      class="toc-pencil-ring toc-pencil-ring--draw"
      aria-hidden="true"
      :style="{
        backgroundImage: `url('${ringImage}')`,
        '--toc-ring-pad': `${TOC_RING_PAD_PX}px`,
        '--toc-ring-bleed': `${TOC_RING_BLEED_PX}px`,
      }"
    />
    <span class="toc-proc-row__label">{{ label }}</span>
  </div>
</template>

<style scoped>
@property --toc-ring-sweep {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

.toc-proc-row {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  line-height: 1.42;
  min-height: 40px;
  padding-block: 8px;
  padding-inline: 32px 8px;
  border-radius: 0;
  cursor: pointer;
  background: transparent;
  overflow: visible;
  transition: color 110ms var(--ease-te-snap, ease);
}

.toc-pencil-ring {
  position: absolute;
  inset: calc(-1 * var(--toc-ring-pad, 5px));
  z-index: 0;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  -webkit-mask-image: conic-gradient(
    from -90deg,
    #000 0deg,
    #000 var(--toc-ring-sweep, 0deg),
    transparent var(--toc-ring-sweep, 0deg)
  );
  mask-image: conic-gradient(
    from -90deg,
    #000 0deg,
    #000 var(--toc-ring-sweep, 0deg),
    transparent var(--toc-ring-sweep, 0deg)
  );
}

.toc-pencil-ring--draw {
  animation: toc-pencil-ring-draw 0.58s cubic-bezier(0.33, 1, 0.38, 1) forwards;
}

@keyframes toc-pencil-ring-draw {
  to {
    --toc-ring-sweep: 360deg;
  }
}

@media (prefers-reduced-motion: reduce) {
  .toc-pencil-ring--draw {
    animation: none;
    --toc-ring-sweep: 360deg;
  }
}

.toc-proc-row__label {
  position: relative;
  z-index: 1;
  display: block;
  white-space: normal;
  overflow-wrap: anywhere;
  text-wrap: balance;
  color: var(--color-text);
}

.toc-proc-row--active .toc-proc-row__label {
  color: var(--color-text);
}

.toc-proc-row:hover .toc-proc-row__label {
  color: var(--color-text);
}

.toc-proc-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 8px;
}
</style>
