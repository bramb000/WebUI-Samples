<script setup lang="ts">
import CaseMetric from '../CaseMetric.vue'
import CaseBeforeAfter from '../CaseBeforeAfter.vue'
import CaseInsight from '../CaseInsight.vue'
import CasePencilChip from '../CasePencilChip.vue'
import CaseStudySummaryFlowMedia from './CaseStudySummaryFlowMedia.vue'
import CaseStudySummaryClutter from './CaseStudySummaryClutter.vue'
import type { CaseStudySummaryData } from '../../types/caseStudySummary'

defineProps<{
  summary: CaseStudySummaryData
}>()
</script>

<template>
  <section
    class="case-study-summary panel-recessed--no-pencil-frame noise-overlay case-study-panel"
    aria-labelledby="case-study-summary-heading"
  >
    <header class="case-study-summary__header">
      <h2 id="case-study-summary-heading" class="type-case-section-accent" data-toc-label="Summary">
        Summary
      </h2>
    </header>

    <div class="case-study-panel__metric-grid">
      <CaseMetric
        v-for="(metric, index) in summary.metrics"
        :key="`${metric.label}-${index}`"
        :value="metric.value"
        :label="metric.label"
        :theme="metric.theme === 'before' ? 'before' : 'after'"
      />
    </div>

    <div v-if="summary.beats.length" class="case-study-summary__beats">
      <article
        v-for="(beat, index) in summary.beats"
        :key="`${beat.kicker}-${index}`"
        class="case-study-summary__beat"
      >
        <h3 class="type-case-kicker mb-1">
          {{ beat.kicker }}
        </h3>
        <p class="type-case-body" v-html="beat.text" />
      </article>
    </div>

    <div v-if="summary.featureClip" class="case-study-summary__feature">
      <CaseStudySummaryFlowMedia :media="summary.featureClip" :priority="summary.featureClip.kind !== 'youtube'" />
    </div>

    <div v-if="summary.flowTransform" class="case-study-summary__flow-transform">
      <h3 v-if="summary.flowTransform.title" class="type-case-kicker-muted">
        {{ summary.flowTransform.title }}
      </h3>
      <div class="case-study-summary__flow-transform-clip">
        <CaseStudySummaryFlowMedia :media="summary.flowTransform.media" priority />
      </div>
      <div
        v-if="summary.flowTransform.beforeInsight || summary.flowTransform.afterInsight"
        class="case-study-summary__flow-transform-insights"
        :class="{
          'case-study-summary__flow-transform-insights--single':
            Boolean(summary.flowTransform.beforeInsight) !== Boolean(summary.flowTransform.afterInsight),
        }"
      >
        <CaseInsight
          v-if="summary.flowTransform.beforeInsight"
          :stat="summary.flowTransform.beforeInsight.stat"
          :stat-label="summary.flowTransform.beforeInsight.statLabel"
          theme="before"
        />
        <CaseInsight
          v-if="summary.flowTransform.afterInsight"
          :stat="summary.flowTransform.afterInsight.stat"
          :stat-label="summary.flowTransform.afterInsight.statLabel"
          theme="after"
        />
      </div>
    </div>

    <div v-else-if="summary.flows?.length" class="case-study-summary__flows">
      <h3
        v-if="summary.flowsSectionTitle !== null"
        class="type-case-kicker-muted case-study-summary__flows-title"
      >
        {{ summary.flowsSectionTitle ?? 'User flows' }}
      </h3>
      <div class="case-study-summary__flow-layout">
        <div class="case-study-summary__flow-media-row">
          <div
            v-for="flow in summary.flows"
            :key="`media-${flow.phase}`"
            class="case-study-summary__flow-col"
            :class="`case-study-summary__flow-col--${flow.phase}`"
          >
            <CasePencilChip :label="flow.phase === 'before' ? 'Before' : 'After'" />
            <CaseStudySummaryFlowMedia :media="flow.media" :priority="flow.phase === 'after'" />
          </div>
        </div>
        <div
          v-if="summary.flows.some((flow) => flow.insight)"
          class="case-study-summary__flow-insights-row"
        >
          <template v-for="flow in summary.flows" :key="`insight-${flow.phase}`">
            <CaseInsight
              v-if="flow.insight"
              :stat="flow.insight.stat"
              :stat-label="flow.insight.statLabel"
              :theme="flow.phase"
            />
          </template>
        </div>
      </div>
    </div>

    <div v-if="summary.comparisons?.length" class="case-study-summary__comparisons">
      <h3 class="type-case-kicker-muted">
        Before &amp; after
      </h3>
      <div class="case-study-summary__comparison-stack">
        <CaseBeforeAfter
          v-for="(pair, index) in summary.comparisons"
          :key="`${pair.caption ?? index}`"
          :before-image="pair.beforeImage"
          :after-image="pair.afterImage"
          :before-alt="pair.beforeAlt"
          :after-alt="pair.afterAlt"
          :caption="pair.caption"
        />
      </div>
    </div>

    <CaseStudySummaryClutter
      v-if="summary.processBoard?.length"
      :items="summary.processBoard"
    />

    <p class="case-study-summary__continue type-body">
      Scroll for the full case study ↓
    </p>
  </section>
</template>

<style scoped>
.case-study-summary {
  gap: var(--dl-panel-gap-lg);
  padding-top: 0;
}

.case-study-summary__beats {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--dl-panel-gap);
}

@media (min-width: 768px) {
  .case-study-summary__beats {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
}

.case-study-summary__beat {
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--dl-border-radius);
  background: color-mix(in srgb, var(--color-surface) 88%, var(--color-elevated));
}

.case-study-summary__feature {
  width: 100%;
}

.case-study-summary__flow-transform {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.case-study-summary__flow-transform-clip :deep(.summary-flow-media__clip) {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent), var(--dl-glow-global);
}

.case-study-summary__flow-transform-insights {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.case-study-summary__flow-transform-insights--single {
  max-width: 22rem;
}

@media (min-width: 768px) {
  .case-study-summary__flow-transform-insights:not(.case-study-summary__flow-transform-insights--single) {
    grid-template-columns: 1fr 1fr;
  }
}

.case-study-summary__flows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.case-study-summary__flows-title {
  margin: 0;
}

.case-study-summary__flow-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.case-study-summary__flow-media-row,
.case-study-summary__flow-insights-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  align-items: stretch;
}

@media (min-width: 900px) {
  .case-study-summary__flow-media-row,
  .case-study-summary__flow-insights-row {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }
}

.case-study-summary__flow-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.case-study-summary__flow-col--after :deep(.summary-flow-media__clip) {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent), var(--dl-glow-global);
}

.case-study-summary__comparisons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.case-study-summary__comparison-stack {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.case-study-summary__continue {
  text-align: center;
  margin: 0;
}
</style>
