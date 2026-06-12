<script setup lang="ts">
import CaseImage from './CaseImage.vue'
import CasePencilChip from './CasePencilChip.vue'

defineProps<{
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  caption?: string
}>()
</script>

<template>
  <div class="baa-wrap">
    <div class="baa-grid">
      <div class="baa-col">
        <CasePencilChip label="Before" />
        <CaseImage
          :src="beforeImage"
          :alt="beforeAlt || 'Before'"
          lightbox-badge="Before"
          img-class="baa-img"
        />
      </div>

      <div class="baa-col">
        <CasePencilChip label="After" />
        <CaseImage
          :src="afterImage"
          :alt="afterAlt || 'After'"
          lightbox-badge="After"
          img-class="baa-img baa-img--after"
        />
      </div>
    </div>

    <div v-if="caption" class="baa-caption-block">
      <p class="baa-caption type-case-caption">{{ caption }}</p>
      <span class="case-text-divider" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
.baa-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.baa-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  position: relative;
}

@media (min-width: 768px) {
  .baa-grid {
    grid-template-columns: 1fr 1fr;
    align-items: start;
    gap: 24px;
  }
}

.baa-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.baa-img {
  width: 100%;
  aspect-ratio: 16 / 10;
  display: block;
  border: 1px solid var(--color-border);
  border-radius: var(--dl-border-radius);
  object-fit: cover;
}

.baa-img--after {
  border-color: var(--color-accent);
  box-shadow:
    0 0 0 1px var(--color-accent),
    var(--dl-glow-global);
}

.baa-caption-block {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: calc(var(--grid-1) / 2);
  width: 100%;
}

.baa-caption {
  text-align: left;
  margin: 0;
  opacity: 0.85;
}
</style>
