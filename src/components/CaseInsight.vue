<script setup lang="ts">
import { computed } from 'vue'
import ProceduralChiselFrame from './ProceduralChiselFrame.vue'

const props = withDefaults(
  defineProps<{
    stat?: string | number
    statLabel?: string
    theme?: 'neutral' | 'success' | 'danger'
  }>(),
  {
    theme: 'neutral',
  },
)

const frameAccent = computed(() => {
  switch (props.theme) {
    case 'success':
      return '#5eead4'
    case 'danger':
      return '#fb923c'
    default:
      return '#00ffcc'
  }
})
</script>

<template>
  <ProceduralChiselFrame class="insight-frame" :color="frameAccent">
    <div class="insight-wrap insight-wrap--chisel panel-recessed noise-overlay">

    <!-- Stat badge (if provided) -->
    <div v-if="stat || statLabel" class="insight-stat-block">
      <div class="insight-stat lcd-data">
        <span class="insight-stat-value">{{ stat }}</span>
      </div>
      <div v-if="statLabel" class="insight-stat-label">
        <span class="stat-label-text">{{ statLabel }}</span>
      </div>
    </div>

    <!-- Content Slot -->
    <div class="insight-body">
      <slot></slot>
    </div>
    </div>
  </ProceduralChiselFrame>
</template>

<style scoped>
.insight-frame {
  width: 100%;
  min-width: 0;
}

.insight-wrap {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  width: 100%;
  min-width: 0;
  transition:
    box-shadow 200ms var(--ease-mechanical-spring),
    transform  200ms var(--ease-mechanical-spring);
}

.insight-wrap--chisel {
  border-color: transparent;
}

.insight-wrap:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.12),
    0 10px 24px rgba(0, 0, 0, 0.18),
    0 1px 0 rgba(255, 255, 255, 0.9);
}

.insight-stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.insight-stat {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
}
.insight-stat-value {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: 800;
  color: var(--color-lcd-text);
  letter-spacing: 0.04em;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.insight-stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.stat-label-text {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}


.insight-body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.85;
  position: relative;
  z-index: 1;
}
</style>
