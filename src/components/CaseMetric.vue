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
  '--case-insight-paint-mask': `url(${paintMaskUrl})`,
}))
</script>

<template>
  <ProceduralChiselFrame class="metric-frame" :color="frameAccent" :hover-flame="false">
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
  min-width: 0;
  --insight-accent: v-bind(frameAccent);
  --card-clip: polygon(4% 0, 100% 0, 100% 94%, 97% 100%, 0 100%, 0 7%);
  --card-hover-tilt: 0.8deg;
  transition: transform 200ms var(--ease-mechanical-spring);
  transform-origin: center bottom;
  will-change: transform;
}

.metric-frame::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid color-mix(in srgb, var(--insight-accent) 70%, #f4f4f5 30%);
  clip-path: var(--card-clip);
  opacity: 0;
  pointer-events: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--insight-accent) 22%, transparent 78%),
    0 10px 24px color-mix(in srgb, var(--insight-accent) 16%, transparent 84%);
  transition: opacity 140ms ease;
}

.metric-frame:nth-child(4n + 1) {
  --card-hover-tilt: 0.9deg;
}

.metric-frame:nth-child(4n + 2) {
  --card-hover-tilt: -0.55deg;
  --card-clip: polygon(0 0, 95% 0, 100% 7%, 100% 100%, 4% 100%, 0 92%);
}

.metric-frame:nth-child(4n + 3) {
  --card-hover-tilt: 0.65deg;
  --card-clip: polygon(3% 0, 100% 0, 100% 91%, 93% 100%, 0 100%, 0 4%);
}

.metric-frame:nth-child(4n + 4) {
  --card-hover-tilt: -1deg;
  --card-clip: polygon(0 0, 97% 0, 100% 4%, 100% 100%, 7% 100%, 0 89%);
}

.metric-frame:hover {
  transform: translateY(-6px) rotate(var(--card-hover-tilt));
}

.metric-frame:hover::after {
  opacity: 1;
}

.metric-wrap {
  position: relative;
  min-width: 0;
  width: 100%;
  min-height: 120px;
  overflow: hidden;
  clip-path: var(--card-clip);
}

.metric-wrap--chisel {
  color: var(--case-insight-on-fill);
}

.metric-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px 20px;
  flex: 1 1 auto;
  transition: box-shadow 200ms var(--ease-mechanical-spring);
}

.metric-frame:hover .metric-content {
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.28),
    0 0 0 1px color-mix(in srgb, var(--insight-accent) 22%, transparent 78%);
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
