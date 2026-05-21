<script setup lang="ts">
import { computed } from 'vue'
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

const paperFill = computed(
  () => `color-mix(in srgb, ${frameAccent.value} 24%, rgb(12, 12, 12) 76%)`,
)
</script>

<template>
  <ProceduralChiselFrame class="metric-frame" :color="frameAccent" :hover-flame="false">
    <div class="metric-wrap metric-wrap--chisel panel-recessed panel-recessed--borderless noise-overlay">
      <!-- Side axle knobs (matching AccountTray) -->
      <div class="axle axle-left">
        <div class="axle-groove"></div>
        <div class="axle-groove"></div>
      </div>
      <div class="axle axle-right">
        <div class="axle-groove"></div>
        <div class="axle-groove"></div>
      </div>

      <!-- LCD value display -->
      <div class="metric-lcd lcd-data">
        <div class="lcd-glare"></div>
        <span class="metric-value">{{ value }}</span>
      </div>

      <!-- Label row -->
      <div class="metric-label">
        <span class="metric-label-text">{{ label }}</span>
      </div>
    </div>
  </ProceduralChiselFrame>
</template>

<style scoped>
.metric-frame {
  width: 100%;
  min-width: 0;
  --card-hover-tilt: 0.8deg;
  --card-hover-clip: polygon(4% 0, 100% 0, 100% 94%, 97% 100%, 0 100%, 0 7%);
  transition: transform 200ms var(--ease-mechanical-spring);
  transform-origin: center bottom;
  will-change: transform;
}

.metric-frame::after {
  content: '';
  position: absolute;
  inset: -4px;
  border: 2px solid color-mix(in srgb, v-bind(frameAccent) 70%, #f4f4f5 30%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  opacity: 0;
  pointer-events: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, v-bind(frameAccent) 22%, transparent 78%),
    0 10px 24px color-mix(in srgb, v-bind(frameAccent) 16%, transparent 84%);
  transition:
    opacity 140ms ease,
    clip-path 200ms var(--ease-mechanical-spring);
}

.metric-frame:nth-child(4n + 1) {
  --card-hover-tilt: 0.9deg;
}

.metric-frame:nth-child(4n + 2) {
  --card-hover-tilt: -0.55deg;
  --card-hover-clip: polygon(0 0, 95% 0, 100% 7%, 100% 100%, 4% 100%, 0 92%);
}

.metric-frame:nth-child(4n + 3) {
  --card-hover-tilt: 0.65deg;
  --card-hover-clip: polygon(3% 0, 100% 0, 100% 91%, 93% 100%, 0 100%, 0 4%);
}

.metric-frame:nth-child(4n + 4) {
  --card-hover-tilt: -1deg;
  --card-hover-clip: polygon(0 0, 97% 0, 100% 4%, 100% 100%, 7% 100%, 0 89%);
}

.metric-frame:hover {
  transform: translateY(-6px) rotate(var(--card-hover-tilt));
}

.metric-frame:hover::after {
  opacity: 1;
  clip-path: var(--card-hover-clip);
}

.metric-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px 20px;
  min-height: 120px;
  flex: 1 1 auto;
  transition:
    clip-path 200ms var(--ease-mechanical-spring),
    box-shadow 200ms var(--ease-mechanical-spring),
    transform  200ms var(--ease-mechanical-spring);
  width: 100%;
  min-width: 0;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.metric-wrap--chisel {
  border: none !important;
  background: v-bind(paperFill) !important;
  box-shadow: none !important;
}

.metric-frame:hover .metric-wrap {
  clip-path: var(--card-hover-clip);
  box-shadow:
    0 12px 28px rgba(0, 0, 0, 0.28),
    0 0 0 1px color-mix(in srgb, v-bind(frameAccent) 22%, transparent 78%);
}

/* ── Axle knobs (hidden — were decorative borders on the metric frame) ── */
.axle {
  display: none;
}

/* ── LCD Screen ── */
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
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 900;
  color: color-mix(in srgb, var(--color-lcd-text) 55%, #fafaf9 45%);
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  z-index: 1;
}

/* ── Label ── */
.metric-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.metric-label-text {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: color-mix(in srgb, #f4f4f5 68%, v-bind(frameAccent) 32%);
}

</style>
