<script setup lang="ts">
import CaseImage from './CaseImage.vue'
import CasePencilChip from './CasePencilChip.vue'

withDefaults(
  defineProps<{
    beforeImage: string
    afterImage: string
    beforeAlt?: string
    afterAlt?: string
    beforeCaption?: string
    afterCaption?: string
    caption?: string
    imageFit?: 'cover' | 'contain'
  }>(),
  {
    imageFit: 'cover',
  },
)
</script>

<template>
  <div class="baa-wrap" :class="{ 'baa-wrap--contain': imageFit === 'contain' }">
    <div class="baa-grid" :class="{ 'baa-grid--contain': imageFit === 'contain' }">
      <div class="baa-col">
        <CasePencilChip label="Before" />
        <CaseImage
          :src="beforeImage"
          :alt="beforeAlt || 'Before'"
          :caption="beforeCaption"
          lightbox-badge="Before"
          :img-class="imageFit === 'contain' ? 'baa-img--contain' : 'baa-img'"
        />
      </div>

      <div class="baa-col baa-col--after">
        <CasePencilChip label="After" />
        <CaseImage
          :src="afterImage"
          :alt="afterAlt || 'After'"
          :caption="afterCaption"
          lightbox-badge="After"
          :img-class="imageFit === 'contain' ? 'baa-img--contain' : 'baa-img baa-img--after'"
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

  .baa-grid--contain {
    align-items: stretch;
  }
}

.baa-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.baa-wrap--contain .baa-col {
  align-items: stretch;
  width: 100%;
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

/* Contain mode: equal frames on the trigger; image scales inside with padding */
.baa-wrap--contain :deep(.case-image) {
  display: flex;
  flex-direction: column;
  gap: var(--grid-2);
  margin: 0;
  width: 100%;
}

.baa-wrap--contain :deep(.case-image__trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 4 / 3;
  padding: var(--dl-panel-padding-inline);
  background: var(--color-surface);
  border: var(--dl-border-width) solid var(--color-border);
  border-radius: var(--dl-border-radius);
  box-shadow: var(--dl-glow-global);
  overflow: hidden;
  min-height: 0;
}

.baa-wrap--contain :deep(.baa-img--contain) {
  display: block;
  flex: 0 1 auto;
  min-width: 0;
  min-height: 0;
  width: auto !important;
  height: auto !important;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  border: none !important;
  box-shadow: none !important;
  border-radius: var(--dl-border-radius);
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
