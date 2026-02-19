<script setup lang="ts">
import type { DetailedInfo } from '../../composables/useNodeGraph'

defineProps<{
  info: DetailedInfo
}>()

const emit = defineEmits<{
  (e: 'seeExamples'): void
}>()
</script>

<template>
  <div class="info-panel" role="region" aria-label="Detailed node information">
    <div class="info-separator" aria-hidden="true"></div>
    <div class="info-content">
      <p class="info-signature">{{ info.signature }}</p>
      <p class="info-description">{{ info.description }}</p>
      <div
        v-for="param in info.params"
        :key="param.name"
        class="info-param"
      >
        <span class="param-name">{{ param.name }}</span>
        <span class="param-desc">{{ param.description }}</span>
      </div>
      <button
        v-if="info.examplesLink"
        class="info-examples-link"
        @click.prevent="emit('seeExamples')"
        aria-label="See examples for this node"
      >
        See examples
      </button>
    </div>
  </div>
</template>

<style scoped>
.info-panel {
  animation: slideDown 0.2s ease;
}

.info-separator {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 6px 0;
}

.info-content {
  padding: 4px 0 2px;
}

.info-signature {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 6px;
  font-family: 'Inter', monospace;
}

.info-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px;
  line-height: 1.4;
}

.info-param {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
}

.param-name {
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  min-width: 50px;
}

.param-desc {
  color: rgba(255, 255, 255, 0.5);
}

.info-examples-link {
  display: inline-block;
  margin-top: 8px;
  font-size: 11px;
  color: #C5F4B2;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  text-decoration: none;
  transition: color 0.15s ease;
}

.info-examples-link:hover {
  color: #A8E89A;
  text-decoration: underline;
}

.info-examples-link:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 2px;
  border-radius: 2px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .info-panel {
    animation: none;
  }
}
</style>
