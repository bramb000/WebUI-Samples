import type { CaseStudySummaryData } from '../../types/caseStudySummary'
import traditionalRocksmith from '../../assets/images/rocksmith/executive-summary/000_traditional-rocksmith.webp'
import interactionMatrix from '../../assets/images/rocksmith/solution/026_interaction-matrix-abstraction.webp'
import inputSystem from '../../assets/images/rocksmith/solution/027_input-system.webp'
import kitchenContext from '../../assets/images/rocksmith/research/005_rocksmith-kitchen-context.webp'
import cognitiveLoad from '../../assets/images/rocksmith/solution/025_cognitive-load-problem.webp'
import rocksmithOutdoors from '../../assets/images/rocksmith/research/007_rocksmith-outdoors.webp'

export const rocksmithSummary: CaseStudySummaryData = {
  metrics: [
    { value: '5', label: 'Platforms' },
    { value: '1', label: 'UI System' },
  ],
  beats: [
    {
      kicker: '01 · Problem',
      text: 'PC-first MVP had to ship on <strong>mobile, tablet, and console</strong> simultaneously, without tripling design and engineering cost.',
    },
    {
      kicker: '02 · Design System',
      text: 'Developing a robust set of components, interactions, and underlying technology to support <strong>5 platforms with 1 design system</strong>',
    },
    {
      kicker: '03 · Backed by Research',
      text: 'Intense research to retain focus on <strong>most important user needs</strong> to keep all teams aligned',
    },
  ],
  flows: [
    {
      phase: 'before',
      media: {
        kind: 'image',
        src: traditionalRocksmith,
        title: 'Legacy desktop-only experience',
      },
      insight: {
        stat: 'Sit down experience only',
        statLabel: 'Fixed to your big screen',
      },
    },
    {
      phase: 'after',
      media: {
        kind: 'image',
        src: rocksmithOutdoors,
        title: 'User playing guitar with Rocksmith+ on iPad outdoors',
      },
      insight: {
        stat: 'Any device, anywhere',
        statLabel: 'Learn on the go, learn where you want',
      },
    },
  ],
  processBoard: [
    { src: kitchenContext, alt: 'Kitchen counter guitar setup', x: 20, y: 40, rotate: -5, scale: 1, zIndex: 2 },
    { src: cognitiveLoad, alt: 'Cross-platform cognitive load diagram', x: 72, y: 38, rotate: 6, scale: 0.95, zIndex: 3 },
    { src: interactionMatrix, alt: 'Interaction matrix abstraction', x: 38, y: 68, rotate: -4, scale: 0.92, zIndex: 4 },
    { src: inputSystem, alt: 'Unified input system diagram', x: 82, y: 72, rotate: 3, scale: 0.9, zIndex: 2 },
  ],
}
