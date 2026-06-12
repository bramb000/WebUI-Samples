export type CaseStudySummaryMetric = {
  value: string
  label: string
  theme?: 'before' | 'after' | 'default'
}

export type CaseStudySummaryBeat = {
  kicker: string
  text: string
}

export type CaseStudySummaryFlowMedia =
  | { kind: 'youtube'; embedUrl: string; title: string }
  | { kind: 'video'; src: string; poster?: string; title: string }
  | { kind: 'image'; src: string; title: string }
  | { kind: 'lazy-video'; loader: () => Promise<{ default: string }>; poster?: string; title: string }

export type CaseStudySummaryFlow = {
  phase: 'before' | 'after'
  media: CaseStudySummaryFlowMedia
  insight?: { stat: string; statLabel: string }
}

export type CaseStudySummaryBeforeAfter = {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  caption?: string
}

/** Scattered process artifact on the thought-board collage */
export type CaseStudySummaryProcessItem = {
  src: string
  alt: string
  x: number
  y: number
  rotate: number
  scale?: number
  zIndex?: number
}

export type CaseStudySummaryFlowInsight = {
  stat: string
  statLabel: string
}

export type CaseStudySummaryData = {
  metrics: CaseStudySummaryMetric[]
  beats: CaseStudySummaryBeat[]
  /** Hero loop — Julius-style featured motion clip */
  featureClip?: CaseStudySummaryFlowMedia
  /** Single artistic before→after flow clip (replaces side-by-side YouTube embeds) */
  flowTransform?: {
    media: CaseStudySummaryFlowMedia
    title?: string
    beforeInsight?: CaseStudySummaryFlowInsight
    afterInsight?: CaseStudySummaryFlowInsight
  }
  flows?: CaseStudySummaryFlow[]
  comparisons?: CaseStudySummaryBeforeAfter[]
  processBoard?: CaseStudySummaryProcessItem[]
}
