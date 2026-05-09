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

/** Dark paper fill derived from chisel rim color — reads as tinted stock behind the frame */
const paperFill = computed(
  () => `color-mix(in srgb, ${frameAccent.value} 26%, rgb(12, 12, 12) 74%)`,
)
</script>

<template>
  <ProceduralChiselFrame class="insight-frame" :color="frameAccent">
    <div class="insight-wrap insight-wrap--chisel panel-recessed panel-recessed--borderless noise-overlay">

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
  border: none !important;
  background: v-bind(paperFill) !important;
  box-shadow:
    inset 0 3px 0 rgba(255, 255, 255, 0.05),
    inset 0 -2px 8px rgba(0, 0, 0, 0.45),
    inset 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.insight-wrap:hover {
  transform: translateY(-3px);
  box-shadow:
    inset 0 3px 0 rgba(255, 255, 255, 0.06),
    inset 0 -2px 12px rgba(0, 0, 0, 0.5),
    inset 0 2px 8px rgba(0, 0, 0, 0.15),
    0 14px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px color-mix(in srgb, v-bind(frameAccent) 22%, transparent 78%);
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
  /* LCD tint + lighten for AA on tinted paper / theme clashes (e.g. teal on teal) */
  color: color-mix(in srgb, var(--color-lcd-text) 55%, #fafaf9 45%);
  letter-spacing: 0.04em;
  line-height: 1;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.65), 0 0 28px rgb(255 255 255 / 0.05);
}

.insight-stat-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.stat-label-text {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  line-height: 1.38;
  text-align: center;
  max-width: 42rem;
  text-wrap: balance;
  color: color-mix(in srgb, #f4f4f5 74%, v-bind(frameAccent) 26%);
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.55);
}


.insight-body {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.7;
  color: color-mix(in srgb, #fafaf9 88%, v-bind(frameAccent) 12%);
  opacity: 1;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.4);
}
</style>
