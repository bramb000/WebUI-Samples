<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInsightCardGrain } from '../composables/useInsightCardGrain'
import ProceduralChiselFrame from './ProceduralChiselFrame.vue'

const props = withDefaults(defineProps<{
  value: string | number;
  label: string;
  theme?: 'neutral' | 'success' | 'danger';
}>(), {
  theme: 'neutral'
});

const frameAccent = computed(() => {
  switch (props.theme) {
    case 'success':
      return 'var(--case-insight-change)'
    case 'danger':
      return 'var(--case-insight-risk)'
    default:
      return 'var(--case-insight-observation)'
  }
})

const surfaceFill = computed(() => {
  switch (props.theme) {
    case 'success':
      return 'var(--case-insight-surface-change)'
    case 'danger':
      return 'var(--case-insight-surface-risk)'
    default:
      return 'var(--case-insight-surface-observation)'
  }
})

const grainSeed = computed(() => {
  const label = `${props.value}-${props.label}-${props.theme}`
  let h = 0
  for (let i = 0; i < label.length; i++)
    h = (h * 31 + label.charCodeAt(i)) | 0
  return Math.abs(h) % 1000
})

const surfaceRef = ref<HTMLElement | null>(null)
const { grainUrl, paintMaskUrl } = useInsightCardGrain(surfaceRef, grainSeed)

const surfaceStyle = computed(() => ({
  '--insight-accent': frameAccent.value,
  '--case-insight-surface-fill': surfaceFill.value,
  '--case-insight-paint-mask': `url(${paintMaskUrl})`,
}))
</script>

<template>
  <ProceduralChiselFrame class="metric-frame" :color="surfaceFill" :hover-flame="false">
    <div class="metric-wrap metric-wrap--chisel" :style="surfaceStyle">
      <div ref="surfaceRef" class="case-insight-surface" aria-hidden="true">
        <img
          v-if="grainUrl"
          class="case-insight-surface__grain"
          :src="grainUrl"
          alt=""
        />
        <div v-else class="case-insight-surface__grain case-insight-surface__grain--fallback" />
      </div>

      <div class="case-insight-surface__content metric-content">
        <div class="metric-lcd lcd-data">
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
  height: 100%;
  min-width: 0;
  --insight-accent: v-bind(frameAccent);
  --case-insight-surface-fill: v-bind(surfaceFill);
  --card-hover-tilt: 0.8deg;
  transition: transform 200ms var(--ease-mechanical-spring);
  transform-origin: center bottom;
  will-change: transform;
}

.metric-frame::after {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--dl-card-frame-width));
  border: var(--dl-card-frame-width) solid var(--dl-card-frame-color);
  border-radius: var(--dl-card-frame-radius);
  opacity: 0;
  pointer-events: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--case-insight-surface-fill) 22%, transparent 78%),
    0 10px 24px color-mix(in srgb, var(--case-insight-surface-fill) 16%, transparent 84%);
  transition: opacity 140ms ease;
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

.metric-frame:hover::after {
  opacity: 1;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--case-insight-surface-fill) 22%, transparent 78%),
    0 14px 32px color-mix(in srgb, var(--case-insight-surface-fill) 28%, transparent 72%);
}

.metric-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 120px;
  overflow: hidden;
  border-radius: 0;
}

.metric-wrap--chisel {
  color: var(--case-insight-on-fill);
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 12px 10px;
  flex: 1 1 auto;
  min-height: 100%;
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
  color: color-mix(in srgb, var(--insight-accent) 38%, var(--case-insight-on-fill) 62%);
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
