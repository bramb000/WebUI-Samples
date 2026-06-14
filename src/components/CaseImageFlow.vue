<script setup lang="ts">
import CaseImage from './CaseImage.vue'

defineProps<{
  step1Src: string
  step1Alt: string
  step1Caption: string
  step2Src: string
  step2Alt: string
  step2Caption: string
}>()
</script>

<template>
  <div class="case-image-flow">
    <div class="case-image-flow__cell case-image-flow__cell--1">
      <CaseImage
        :src="step1Src"
        :alt="step1Alt"
        img-class="case-image-flow__img"
      />
    </div>
    <span class="case-image-flow__arrow" aria-hidden="true">
      <span class="case-image-flow__arrow-mobile">↓</span>
      <span class="case-image-flow__arrow-desktop">→</span>
    </span>
    <div class="case-image-flow__cell case-image-flow__cell--2">
      <CaseImage
        :src="step2Src"
        :alt="step2Alt"
        img-class="case-image-flow__img"
      />
    </div>
    <p class="case-image-flow__caption case-image-flow__caption--1 type-case-caption text-center">
      {{ step1Caption }}
    </p>
    <p class="case-image-flow__caption case-image-flow__caption--2 type-case-caption text-center">
      {{ step2Caption }}
    </p>
  </div>
</template>

<style scoped>
.case-image-flow {
  display: grid;
  gap: var(--grid-2) var(--grid-3);
  align-items: center;
  justify-items: center;
  grid-template-columns: minmax(0, 1fr);
  grid-template-areas:
    "img1"
    "cap1"
    "arrow"
    "img2"
    "cap2";
}

.case-image-flow__cell--1 {
  grid-area: img1;
  width: 100%;
}

.case-image-flow__cell--2 {
  grid-area: img2;
  width: 100%;
}

.case-image-flow__caption--1 {
  grid-area: cap1;
  margin: 0;
  width: 100%;
}

.case-image-flow__caption--2 {
  grid-area: cap2;
  margin: 0;
  width: 100%;
}

.case-image-flow__arrow {
  grid-area: arrow;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
  font-size: var(--text-heading-accent);
  line-height: 1;
}

.case-image-flow__arrow-desktop {
  display: none;
}

.case-image-flow :deep(.case-image) {
  margin: 0;
  width: 100%;
}

.case-image-flow :deep(.case-image__trigger) {
  display: block;
  width: 100%;
}

.case-image-flow :deep(.case-image-flow__img) {
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: var(--dl-border-radius);
}

@media (min-width: 768px) {
  .case-image-flow {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    grid-template-areas:
      "img1 arrow img2"
      "cap1 . cap2";
    row-gap: var(--grid-2);
    column-gap: var(--grid-3);
  }

  .case-image-flow__arrow {
    align-self: center;
    padding-inline: var(--grid-1);
  }

  .case-image-flow__arrow-mobile {
    display: none;
  }

  .case-image-flow__arrow-desktop {
    display: inline;
  }
}
</style>
