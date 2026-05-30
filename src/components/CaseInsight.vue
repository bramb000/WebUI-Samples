<script setup lang="ts">
import { computed } from 'vue'
import { CASE_INSIGHT_THEME } from '../constants/caseInsightTheme'
import ProceduralChiselFrame from './ProceduralChiselFrame.vue'

const props = withDefaults(
  defineProps<{
    stat?: string | number
    statLabel?: string
    theme?: 'before' | 'after'
  }>(),
  {
    theme: 'before',
  },
)

const frameAccent = computed(() =>
  props.theme === 'after'
    ? 'var(--case-insight-after)'
    : 'var(--case-insight-before)',
)

const surfaceFill = computed(() =>
  props.theme === 'after'
    ? 'var(--case-insight-surface-after)'
    : 'var(--case-insight-surface-before)',
)

const surfaceHex = computed(() => CASE_INSIGHT_THEME[props.theme].surface)

const wrapStyle = computed(() => ({
  '--insight-accent': frameAccent.value,
  '--case-insight-surface-fill': surfaceFill.value,
}))
</script>

<template>
  <ProceduralChiselFrame
    class="insight-frame"
    :color="surfaceHex"
    :hover-flame="false"
  >
    <div class="insight-wrap" :style="wrapStyle">
      <div class="insight-content">
        <div v-if="stat || statLabel" class="insight-stat-block">
          <div class="insight-stat">
            <span class="insight-stat-value">{{ stat }}</span>
          </div>
          <div v-if="statLabel" class="insight-stat-label">
            <span class="stat-label-text">{{ statLabel }}</span>
          </div>
        </div>

        <div class="insight-body">
          <slot />
        </div>
      </div>
    </div>
  </ProceduralChiselFrame>
</template>

<style scoped>
.insight-frame {
  width: 100%;
  height: auto;
  min-width: 0;
  --insight-accent: v-bind(frameAccent);
  --case-insight-surface-fill: v-bind(surfaceFill);
  --card-hover-tilt: 0.8deg;
  transition: transform 200ms var(--ease-mechanical-spring);
  transform-origin: center bottom;
  will-change: transform;
}

.insight-frame:nth-child(4n + 1) {
  --card-hover-tilt: 0.9deg;
}

.insight-frame:nth-child(4n + 2) {
  --card-hover-tilt: -0.55deg;
}

.insight-frame:nth-child(4n + 3) {
  --card-hover-tilt: 0.65deg;
}

.insight-frame:nth-child(4n + 4) {
  --card-hover-tilt: -1deg;
}

.insight-frame:hover {
  transform: translateY(-6px) rotate(var(--card-hover-tilt));
}

@media (prefers-reduced-motion: reduce) {
  .insight-frame {
    transition: none;
    will-change: auto;
  }
  .insight-frame:hover {
    transform: none;
  }
}

.insight-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  min-width: 0;
  width: 100%;
  overflow: visible;
  color: var(--case-insight-on-fill);
}

.insight-content {
  position: relative;
  z-index: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  align-items: stretch;
  gap: 8px;
  box-sizing: border-box;
}

.insight-stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.insight-stat {
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.insight-stat-value {
  font-family: var(--font-sans);
  font-size: var(--text-heading-accent);
  font-weight: 800;
  color: color-mix(in srgb, var(--insight-accent) 38%, var(--case-insight-on-fill) 62%);
  letter-spacing: 0.04em;
  line-height: 1;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.55);
}

.stat-label-text {
  font-family: var(--font-sans);
  font-size: var(--text-filter-tab);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  line-height: 1.38;
  text-align: center;
  max-width: 42rem;
  text-wrap: balance;
  color: color-mix(in srgb, var(--case-insight-on-fill-muted) 82%, var(--insight-accent) 18%);
  text-shadow: 0 1px 2px rgb(0 0 0 / 0.45);
}

.insight-body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.7;
  color: var(--case-insight-on-fill);
  flex: 0 0 auto;
  min-height: 0;
}

.insight-body :deep(p),
.insight-body :deep(li),
.insight-body :deep(.type-case-body),
.insight-body :deep(.type-case-body-lg),
.insight-body :deep(.type-case-caption) {
  color: var(--case-insight-on-fill-muted);
}

.insight-body :deep(strong) {
  color: var(--case-insight-on-fill);
}
</style>
