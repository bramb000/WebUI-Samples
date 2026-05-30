<script setup lang="ts">
import { computed } from 'vue'
import { CASE_INSIGHT_THEME } from '../constants/caseInsightTheme'
import ProceduralChiselFrame from './ProceduralChiselFrame.vue'

const props = withDefaults(defineProps<{
  value: string | number;
  label: string;
  theme?: 'before' | 'after';
}>(), {
  theme: 'after',
});

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
    class="metric-frame"
    :color="surfaceHex"
    :hover-flame="false"
  >
    <div class="metric-wrap" :style="wrapStyle">
      <div class="metric-content">
        <div class="metric-lcd">
          <div class="lcd-glare"></div>
          <span class="metric-value">{{ value }}</span>
        </div>
        <div class="metric-label">
          <span class="metric-label-text">{{ label }}</span>
        </div>
      </div>
    </div>
  </ProceduralChiselFrame>
</template>

<style scoped>
.metric-frame {
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

.metric-frame:nth-child(4n + 1) {
  --card-hover-tilt: 0.9deg;
}

.metric-frame:nth-child(4n + 2) {
  --card-hover-tilt: -0.55deg;
}

.metric-frame:nth-child(4n + 3) {
  --card-hover-tilt: 0.65deg;
}

.metric-frame:nth-child(4n + 4) {
  --card-hover-tilt: -1deg;
}

.metric-frame:hover {
  transform: translateY(-6px) rotate(var(--card-hover-tilt));
}

@media (prefers-reduced-motion: reduce) {
  .metric-frame {
    transition: none;
    will-change: auto;
  }
  .metric-frame:hover {
    transform: none;
  }
}

.metric-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  min-width: 0;
  width: 100%;
  overflow: visible;
  color: var(--case-insight-on-fill);
}

.metric-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 10px;
  flex: 0 1 auto;
  box-sizing: border-box;
}

.metric-lcd {
  width: 80%;
  min-width: 80px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.metric-value {
  font-family: var(--font-sans);
  font-size: var(--text-heading-accent);
  font-weight: 900;
  color: color-mix(in srgb, var(--insight-accent) 58%, var(--case-insight-on-fill) 42%);
  letter-spacing: 0.05em;
  line-height: 1;
  text-shadow: 0 1px 3px rgb(0 0 0 / 0.55);
}

.metric-label-text {
  font-family: var(--font-sans);
  font-size: var(--text-label-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: color-mix(in srgb, var(--case-insight-on-fill-muted) 82%, var(--insight-accent) 18%);
}
</style>
