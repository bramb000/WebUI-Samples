<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHeroBackgroundGrain } from '../composables/useHeroBackgroundGrain'

const surfaceRef = ref<HTMLElement | null>(null)
const seed = computed(() => 613)
const { grainUrl } = useHeroBackgroundGrain(surfaceRef, seed)

const debugBytes = computed(() => (grainUrl.value ? grainUrl.value.length : 0))
const debugStatus = computed(() => (grainUrl.value ? 'ready' : 'pending'))
</script>

<template>
  <div
    class="hero-bg-texture"
    aria-hidden="true"
    :data-grain-status="debugStatus"
    :data-grain-bytes="debugBytes"
  >
    <div ref="surfaceRef" class="hero-bg-texture__surface">
      <img v-if="grainUrl" class="hero-bg-texture__grain" :src="grainUrl" alt="" aria-hidden="true" />
    </div>

    <div class="hero-bg-halftone hero-bg-halftone--tl" />
    <div class="hero-bg-halftone hero-bg-halftone--tr" />
    <div class="hero-bg-halftone hero-bg-halftone--bl" />
    <div class="hero-bg-halftone hero-bg-halftone--br" />
  </div>
</template>

<style scoped>
.hero-bg-texture {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}

.hero-bg-texture__surface {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background: transparent;
}

.hero-bg-texture__grain {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  mix-blend-mode: soft-light;
  opacity: var(--hero-bg-grain-opacity, 0.16);
}

.hero-bg-halftone {
  position: absolute;
  width: min(30vmin, 320px);
  height: min(30vmin, 320px);
  opacity: var(--hero-bg-halftone-opacity, 0.02);
  mix-blend-mode: soft-light;
  background-image: radial-gradient(circle, rgb(26 24 20 / 0.08) 0 1px, transparent 1.9px);
  background-size: 13px 13px;
  background-repeat: repeat;
  filter: blur(0.4px);
  transform: rotate(11deg);
}

.hero-bg-halftone--tl {
  top: 0;
  left: 0;
  background-position: 3px 7px;
  -webkit-mask-image: radial-gradient(circle at top left, #000 0 40%, transparent 74%);
  mask-image: radial-gradient(circle at top left, #000 0 40%, transparent 74%);
}
.hero-bg-halftone--tr {
  top: 0;
  right: 0;
  background-position: 9px 2px;
  -webkit-mask-image: radial-gradient(circle at top right, #000 0 40%, transparent 74%);
  mask-image: radial-gradient(circle at top right, #000 0 40%, transparent 74%);
}
.hero-bg-halftone--bl {
  bottom: 0;
  left: 0;
  background-position: 6px 11px;
  -webkit-mask-image: radial-gradient(circle at bottom left, #000 0 40%, transparent 74%);
  mask-image: radial-gradient(circle at bottom left, #000 0 40%, transparent 74%);
}
.hero-bg-halftone--br {
  bottom: 0;
  right: 0;
  background-position: 12px 5px;
  -webkit-mask-image: radial-gradient(circle at bottom right, #000 0 40%, transparent 74%);
  mask-image: radial-gradient(circle at bottom right, #000 0 40%, transparent 74%);
}
</style>

