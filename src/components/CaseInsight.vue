<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInsightCardGrain } from '../composables/useInsightCardGrain'
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
  const label = `${props.stat ?? ''}-${props.statLabel ?? ''}-${props.theme}`
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
  <ProceduralChiselFrame class="insight-frame" :color="surfaceFill" :hover-flame="false">
    <div
      class="insight-wrap insight-wrap--chisel"
      :style="surfaceStyle"
    >
      <div ref="surfaceRef" class="case-insight-surface" aria-hidden="true">
        <img
          v-if="grainUrl"
          class="case-insight-surface__grain"
          :src="grainUrl"
          alt=""
        />
        <div v-else class="case-insight-surface__grain case-insight-surface__grain--fallback" />
      </div>

      <div class="case-insight-surface__content insight-content">
        <div v-if="stat || statLabel" class="insight-stat-block">
          <div class="insight-stat lcd-data">
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
  height: 100%;
  min-width: 0;
  --insight-accent: v-bind(frameAccent);
  --case-insight-surface-fill: v-bind(surfaceFill);
  --card-hover-tilt: 0.8deg;
  transition: transform 200ms var(--ease-mechanical-spring);
  transform-origin: center bottom;
  will-change: transform;
}

.insight-frame::after {
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

.insight-frame:hover::after {
  opacity: 1;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--case-insight-surface-fill) 22%, transparent 78%),
    0 14px 32px color-mix(in srgb, var(--case-insight-surface-fill) 28%, transparent 72%);
}

.insight-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  border-radius: 0;
}

.insight-wrap--chisel {
  color: var(--case-insight-on-fill);
}

.insight-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-items: stretch;
  gap: 0;
  min-height: 100%;
  box-sizing: border-box;
}

.insight-stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: calc(var(--grid-1) / 2);
  flex: 0 0 auto;
}

.insight-stat {
  padding: 0 12px;
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

.insight-stat-block + .insight-body {
  margin-top: var(--grid-2);
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
