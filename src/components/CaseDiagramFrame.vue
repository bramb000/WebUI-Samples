<script setup lang="ts">
defineProps<{
  title: string
  caption?: string
}>()
</script>

<template>
  <figure class="case-diagram case-study-beat-tile">
    <figcaption class="case-diagram__title type-case-kicker-muted">
      {{ title }}
    </figcaption>
    <div class="case-diagram__canvas">
      <slot />
    </div>
    <p v-if="caption" class="case-diagram__caption type-case-caption">
      {{ caption }}
    </p>
  </figure>
</template>

<style scoped>
.case-diagram {
  display: flex;
  flex-direction: column;
  gap: var(--grid-2);
  margin: var(--grid-2) 0 0;
  padding: var(--grid-3);
  overflow: hidden;
}

.case-diagram__title {
  margin: 0;
}

.case-diagram__canvas {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.case-diagram__canvas :deep(svg) {
  display: block;
  width: 100%;
  max-width: 100%;
  height: auto;
}

.case-diagram__caption {
  margin: 0;
  text-align: center;
  color: var(--color-text-muted);
}
</style>
