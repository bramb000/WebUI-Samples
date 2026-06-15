<script setup lang="ts">
import type { CaseStudySummaryProcessItem } from '../../types/caseStudySummary'

defineProps<{
  items: CaseStudySummaryProcessItem[]
}>()

/** Pull scatter coordinates toward the board centre. */
function clumpCoord(value: number, factor = 0.84) {
  return 50 + (value - 50) * factor
}
</script>

<template>
  <div class="summary-clutter">
    <div class="summary-clutter__board" aria-hidden="false">
      <figure
        v-for="(item, index) in items"
        :key="`${item.alt}-${index}`"
        class="summary-clutter__item"
        :style="{
          '--clutter-x': `${clumpCoord(item.x)}%`,
          '--clutter-y': `${clumpCoord(item.y)}%`,
          '--clutter-rotate': `${item.rotate}deg`,
          '--clutter-scale': String(item.scale ?? 1),
          '--clutter-z': String(item.zIndex ?? index + 1),
        }"
      >
        <img
          :src="item.src"
          :alt="item.alt"
          class="summary-clutter__img"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  </div>
</template>

<style scoped>
.summary-clutter {
  overflow: visible;
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.summary-clutter__board {
  position: relative;
  width: 100%;
  min-height: clamp(320px, 56vw, 480px);
  padding-top: clamp(100px, 18vw, 160px);
  padding-bottom: clamp(48px, 8vw, 80px);
  overflow: visible;
}

.summary-clutter__item {
  position: absolute;
  left: var(--clutter-x);
  top: var(--clutter-y);
  z-index: var(--clutter-z);
  margin: 0;
  width: clamp(200px, 48%, 360px);
  transform:
    translate(-50%, -50%)
    rotate(var(--clutter-rotate))
    scale(var(--clutter-scale));
}

.summary-clutter__img {
  display: block;
  width: 100%;
  height: auto;
  border: var(--dl-border-width) solid var(--color-border);
  border-radius: max(2px, calc(var(--dl-border-radius) - var(--grid-unit)));
  box-shadow:
    0 10px 28px color-mix(in srgb, var(--color-text) 14%, transparent),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 18%, transparent);
  background: var(--color-surface);
}
</style>
