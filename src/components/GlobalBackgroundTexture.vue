<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGlobalBackgroundGrain } from '../composables/useGlobalBackgroundGrain'

const surfaceRef = ref<HTMLElement | null>(null)
const seed = computed(() => 613)
const { grainUrl } = useGlobalBackgroundGrain(surfaceRef, seed)
</script>

<template>
  <Teleport to="body">
    <div class="global-bg-texture" aria-hidden="true">
      <div ref="surfaceRef" class="global-bg-texture__surface">
        <img v-if="grainUrl" class="global-bg-texture__grain" :src="grainUrl" alt="" aria-hidden="true" />
      </div>

      <div class="global-bg-halftone global-bg-halftone--tl" />
      <div class="global-bg-halftone global-bg-halftone--tr" />
      <div class="global-bg-halftone global-bg-halftone--bl" />
      <div class="global-bg-halftone global-bg-halftone--br" />
    </div>
  </Teleport>
</template>

<style scoped>
.global-bg-texture {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  user-select: none;
}

.global-bg-texture__surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
}

.global-bg-texture__grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  mix-blend-mode: multiply;
  opacity: var(--global-bg-grain-opacity, 0.12);
}

.global-bg-halftone {
  position: absolute;
  width: min(34vmin, 360px);
  height: min(34vmin, 360px);
  opacity: var(--global-bg-halftone-opacity, 0.045);
  mix-blend-mode: soft-light;
  background-image: radial-gradient(circle, rgb(255 255 255 / 0.22) 0 1px, transparent 1.8px);
  background-size: 11px 11px;
  filter: blur(0.2px);
}

.global-bg-halftone--tl {
  top: 0;
  left: 0;
  -webkit-mask-image: radial-gradient(circle at top left, #000 0 40%, transparent 72%);
  mask-image: radial-gradient(circle at top left, #000 0 40%, transparent 72%);
}
.global-bg-halftone--tr {
  top: 0;
  right: 0;
  -webkit-mask-image: radial-gradient(circle at top right, #000 0 40%, transparent 72%);
  mask-image: radial-gradient(circle at top right, #000 0 40%, transparent 72%);
}
.global-bg-halftone--bl {
  bottom: 0;
  left: 0;
  -webkit-mask-image: radial-gradient(circle at bottom left, #000 0 40%, transparent 72%);
  mask-image: radial-gradient(circle at bottom left, #000 0 40%, transparent 72%);
}
.global-bg-halftone--br {
  bottom: 0;
  right: 0;
  -webkit-mask-image: radial-gradient(circle at bottom right, #000 0 40%, transparent 72%);
  mask-image: radial-gradient(circle at bottom right, #000 0 40%, transparent 72%);
}
</style>

