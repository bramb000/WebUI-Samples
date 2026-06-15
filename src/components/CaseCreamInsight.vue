<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { CASE_INSIGHT_THEME } from '../constants/caseInsightTheme'
import { useInsightCardGrain } from '../composables/useInsightCardGrain'
import ProceduralChiselFrame from './ProceduralChiselFrame.vue'

const props = defineProps<{
  stat?: string | number
  statLabel?: string
  /** Video/image shell — no stat chrome, no hover tilt, flush media */
  mediaOnly?: boolean
  /** Stable grain seed when stat/statLabel are absent */
  grainKey?: string
}>()

const frameAccent = 'var(--case-insight-cream-accent)'
const surfaceFill = 'var(--case-insight-cream-surface)'
const surfaceHex = computed(() => CASE_INSIGHT_THEME.cream.surface)

const grainSeed = computed(() => {
  const label = props.grainKey ?? `${props.stat ?? ''}-${props.statLabel ?? ''}-cream`
  let h = 0
  for (let i = 0; i < label.length; i++)
    h = (h * 31 + label.charCodeAt(i)) | 0
  return Math.abs(h) % 1000
})

const frameRef = ref<{ rootEl: HTMLElement | null } | null>(null)
const grainFrameEl = computed(() =>
  props.mediaOnly ? null : frameRef.value?.rootEl ?? null,
)

const { grainUrl, scheduleRebake } = useInsightCardGrain(grainFrameEl, grainSeed, {
  fillCssVar: '--case-insight-cream-surface',
  fillFallbackHex: '#ebe4d6',
  grainOverlayStrengthVar: '--case-insight-cream-grain-overlay-strength',
})

const chiselPlateColor = computed(() =>
  props.mediaOnly ? '#ebe4d6' : surfaceHex.value,
)

const displayGrainUrl = computed(() => (props.mediaOnly ? null : grainUrl.value))

watch(surfaceHex, () => scheduleRebake())

const wrapStyle = computed(() => ({
  '--insight-accent': frameAccent,
  '--case-insight-surface-fill': surfaceFill,
}))

/** Metrics like 5, +25%, ~90% stay centred; prose stats align left. */
const isNumericStat = computed(() => {
  const { stat } = props
  if (stat == null || stat === '') return false
  if (typeof stat === 'number') return true
  const s = String(stat).trim()
  if (/\b[a-zA-Z]{4,}\b/.test(s)) return false
  return /^[+\-~$]?[\d]/.test(s)
})
</script>

<template>
  <ProceduralChiselFrame
    ref="frameRef"
    class="cream-insight-frame"
    :class="{ 'cream-insight-frame--media-only': mediaOnly }"
    :color="chiselPlateColor"
    :texture-grain-url="displayGrainUrl"
    :plate-stroke-only="mediaOnly"
    plate-fill="var(--home-work-video-cream)"
    :hover-flame="false"
  >
    <div class="cream-insight-wrap" :style="wrapStyle">
      <div
        class="cream-insight-content"
        :class="{ 'cream-insight-content--media-only': mediaOnly }"
      >
        <div
          v-if="stat || statLabel"
          class="cream-insight-stat-block"
          :class="{ 'cream-insight-stat-block--numeric': isNumericStat }"
        >
          <div class="cream-insight-stat">
            <span
              class="cream-insight-stat-value"
              :class="{ 'cream-insight-stat-value--numeric': isNumericStat }"
            >{{ stat }}</span>
          </div>
          <div v-if="statLabel" class="cream-insight-stat-label">
            <span class="cream-insight-stat-label-text">{{ statLabel }}</span>
          </div>
        </div>

        <div
          class="cream-insight-body"
          :class="{ 'cream-insight-body--media-only': mediaOnly }"
        >
          <slot />
        </div>
      </div>
    </div>
  </ProceduralChiselFrame>
</template>

<style scoped>
.cream-insight-frame {
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

.cream-insight-frame:nth-child(4n + 1) {
  --card-hover-tilt: 0.9deg;
}

.cream-insight-frame:nth-child(4n + 2) {
  --card-hover-tilt: -0.55deg;
}

.cream-insight-frame:nth-child(4n + 3) {
  --card-hover-tilt: 0.65deg;
}

.cream-insight-frame:nth-child(4n + 4) {
  --card-hover-tilt: -1deg;
}

.cream-insight-frame:hover {
  transform: translateY(-6px) rotate(var(--card-hover-tilt));
}

.cream-insight-frame :deep(.chisel-frame__texture-img) {
  mix-blend-mode: var(--case-insight-cream-grain-blend);
  opacity: var(--case-insight-cream-grain-opacity);
}

@media (prefers-reduced-motion: reduce) {
  .cream-insight-frame {
    transition: none;
    will-change: auto;
  }
  .cream-insight-frame:hover {
    transform: none;
  }
}

.cream-insight-frame--media-only {
  height: 100%;
  transition: none;
  will-change: auto;
}

.cream-insight-frame--media-only:hover {
  transform: none;
}

.cream-insight-frame--media-only .cream-insight-wrap,
.cream-insight-frame--media-only :deep(.chisel-frame__body) {
  height: 100%;
  flex: 1 1 auto;
}

.cream-insight-content--media-only {
  padding: 0;
  gap: 0;
  height: 100%;
  overflow: hidden;
}

.cream-insight-body--media-only {
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cream-insight-body--media-only :deep(video),
.cream-insight-body--media-only :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cream-insight-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  min-width: 0;
  width: 100%;
  overflow: visible;
  color: var(--case-insight-cream-on-fill);
}

.cream-insight-content {
  position: relative;
  z-index: 1;
  padding: var(--grid-2);
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  align-items: stretch;
  gap: var(--grid-1);
  box-sizing: border-box;
}

.cream-insight-stat-block {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: calc(var(--grid-1) / 2);
  flex: 0 0 auto;
}

.cream-insight-stat-block--numeric {
  align-items: center;
}

.cream-insight-stat {
  padding: var(--grid-1) var(--grid-2) 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.cream-insight-stat-block--numeric .cream-insight-stat {
  justify-content: center;
}

.cream-insight-stat-label {
  width: 100%;
  padding: 0 var(--grid-2);
  text-align: left;
}

.cream-insight-stat-value {
  display: block;
  width: 100%;
  font-family: var(--font-sans);
  font-size: var(--text-heading-accent);
  font-weight: 800;
  color: color-mix(in srgb, var(--insight-accent) 42%, var(--case-insight-cream-on-fill) 58%);
  letter-spacing: 0.04em;
  line-height: 1.15;
  text-align: left;
  text-wrap: balance;
}

.cream-insight-stat-value--numeric {
  text-align: center;
  width: auto;
}

.cream-insight-stat-label-text {
  font-family: var(--font-sans);
  font-size: var(--text-filter-tab);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  line-height: 1.15;
  text-align: left;
  max-width: var(--case-study-prose-max);
  text-wrap: balance;
  color: color-mix(in srgb, var(--case-insight-cream-on-fill-muted) 88%, var(--insight-accent) 12%);
}

.cream-insight-stat-block--numeric .cream-insight-stat-label {
  text-align: center;
}

.cream-insight-stat-block--numeric .cream-insight-stat-label-text {
  text-align: center;
}

.cream-insight-body {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.7;
  color: var(--case-insight-cream-on-fill);
  flex: 0 0 auto;
  min-height: 0;
  text-align: left;
}

.cream-insight-body :deep(p),
.cream-insight-body :deep(li),
.cream-insight-body :deep(.type-case-body),
.cream-insight-body :deep(.type-case-body-lg),
.cream-insight-body :deep(.type-case-caption) {
  color: var(--case-insight-cream-on-fill-muted);
  text-align: left;
}

.cream-insight-body :deep(strong) {
  color: var(--case-insight-cream-on-fill);
}
</style>
