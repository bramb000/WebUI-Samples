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

const rootRef = ref<HTMLElement | null>(null)
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
    const el = rootRef.value
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
  <div ref="rootRef" class="chisel-frame">
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
  isolation: isolate;
}

.chisel-frame__body {
  position: relative;
  z-index: 0;
}
</style>
