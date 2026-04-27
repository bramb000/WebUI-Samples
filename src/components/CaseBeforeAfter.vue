<script setup lang="ts">
import CaseImage from './CaseImage.vue';

defineProps<{
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
}>();
</script>

<template>
  <div class="baa-wrap">
    <div class="baa-grid">
      <!-- Before -->
      <div class="baa-col">
        <div class="baa-label baa-label--before">
          <span class="label-segment">Before</span>
        </div>
        <CaseImage
          :src="beforeImage"
          :alt="beforeAlt || 'Before Image'"
          img-class="baa-img"
        />
      </div>

      <!-- Divider -->
      <div class="baa-divider" aria-hidden="true"></div>

      <!-- After -->
      <div class="baa-col">
        <div class="baa-label baa-label--after">
          <span class="label-segment label-segment--accent">After</span>
        </div>
        <CaseImage
          :src="afterImage"
          :alt="afterAlt || 'After Image'"
          img-class="baa-img baa-img--after"
        />
      </div>
    </div>

    <p v-if="caption" class="baa-caption">{{ caption }}</p>
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
  .baa-grid { grid-template-columns: 1fr 2px 1fr; align-items: start; }
}

.baa-col { display: flex; flex-direction: column; gap: 8px; }
.baa-label { display: flex; }
.baa-label--after .label-segment { color: var(--color-accent); border-color: var(--color-accent); }

/* Orange vertical divider */
.baa-divider {
  display: none;
  background: var(--color-accent);
  box-shadow: 0 0 6px rgba(255, 87, 34, 0.35);
  border-radius: 1px;
  align-self: stretch;
  margin-top: 32px; /* align with image start */
}
@media (min-width: 768px) { .baa-divider { display: block; } }

.baa-img {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid var(--color-border);
  border-radius: 2px;
  object-fit: cover;
}
.baa-img--after {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent), 0 4px 12px rgba(255,87,34,0.15);
}

.baa-caption {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  text-align: center;
  color: var(--color-text-muted);
  opacity: 0.75;
  margin: 0;
}
</style>
