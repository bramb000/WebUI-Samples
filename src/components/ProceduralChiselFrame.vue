<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  registerChiselFrame,
  setChiselFrameColor,
  setChiselFrameHover,
  unregisterChiselFrame,
} from '../vfx/chiselFrameOverlay'

const props = withDefaults(
  defineProps<{
    color?: string
    hoverFlame?: boolean
  }>(),
  {
    color: '#00ffcc',
    hoverFlame: true,
  },
)

const trackRef = ref<HTMLElement | null>(null)
let frameId: number | null = null
let cancelled = false
let boundEl: HTMLElement | null = null

const onEnter = () => {
  if (frameId != null && props.hoverFlame) setChiselFrameHover(frameId, 1)
}
const onLeave = () => {
  if (frameId != null) setChiselFrameHover(frameId, 0)
}

watch(
  () => props.color,
  (c) => {
    if (frameId != null) setChiselFrameColor(frameId, c)
  },
)

onMounted(() => {
  nextTick(() => {
    if (cancelled) return
    const el = trackRef.value
    if (!el) return
    boundEl = el
    frameId = registerChiselFrame(el, props.color, props.hoverFlame)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
  })
})

onBeforeUnmount(() => {
  cancelled = true
  if (boundEl) {
    boundEl.removeEventListener('pointerenter', onEnter)
    boundEl.removeEventListener('pointerleave', onLeave)
    boundEl = null
  }
  if (frameId != null) {
    unregisterChiselFrame(frameId)
    frameId = null
  }
})
</script>

<template>
  <div class="chisel-frame">
    <!-- Track inner body for WebGL bounds = same box as the filled card (root can differ if outer has decorative overflow). -->
    <div ref="trackRef" class="chisel-frame__body">
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
  /* Grid items still stretch via align-items; height:auto avoids filling a
     tall block parent (e.g. case-study column) when not in a grid cell. */
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.chisel-frame__body {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  width: 100%;
}
</style>
