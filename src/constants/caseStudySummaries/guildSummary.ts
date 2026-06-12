import type { CaseStudySummaryData } from '../../types/caseStudySummary'
import galBeforeGoal from '../../assets/images/guild/tldr/002_screenshot-20250915-114738-guild-of-guardians-2-thumbnail.webp'
import galAfterGoal from '../../assets/images/guild/tldr/003_screenshot-20251105-150223-guild-of-guardians-1-2-thumbnail.webp'
import galBeforeOffer from '../../assets/images/guild/tldr/004_screenshot-20251117-090321-guild-of-guardians-thumbnail.webp'
import galAfterOffer from '../../assets/images/guild/tldr/005_new-offer-thumbnail.webp'
import galBeforeRecs from '../../assets/images/guild/tldr/006_screenshot-20250828-080318-guild-of-guardians-thumbnail.webp'
import galAfterRecs from '../../assets/images/guild/tldr/007_screenshot-20251105-150237-guild-of-guardians-thumbnail.webp'
import gameLoopNegative from '../../assets/images/guild/tldr/012_game-loop-negative-2.webp'
import gameLoopPositive from '../../assets/images/guild/tldr/013_game-loop-positive.webp'
import wireframeFlow from '../../assets/images/guild/tldr/014_afk-wireframe-flow.webp'
import handSketches from '../../assets/images/guild/tldr/015_hand-sketches.webp'
import persona from '../../assets/images/guild/tldr/011_persona-3.webp'
import userFlowFigma from '../../assets/images/guild/tldr/025_figma-user-flow-2.webp'
import kShapeProblem from '../../assets/images/guild/tldr/010_k-shape-problem.webp'

export const guildSummary: CaseStudySummaryData = {
  metrics: [
    { value: '+25%', label: 'Retention (D7)', theme: 'after' },
    { value: '+12%', label: 'Revenue (D7 LTV)', theme: 'after' },
  ],
  beats: [
    {
      kicker: '01 · Problem',
      text: 'D7 retention lagged. The game asked for <strong>3-4 sessions a day</strong> when most players only had time for one or two.',
    },
    {
      kicker: '02 · Insight',
      text: 'SQL + surveys revealed <strong>K-shaped behaviour</strong>: power users masked a worse experience for everyone else.',
    },
    {
      kicker: '03 · Shift',
      text: 'Reframed the sentiment "I\'m missing out" to "a gift is waiting" for reactivation and nudging users to come back the next day.',
    },
  ],
  comparisons: [
    {
      beforeImage: galBeforeGoal,
      afterImage: galAfterGoal,
      beforeAlt: 'Before: no visual progression path',
      afterAlt: 'After: checkpoint progression path',
      caption: 'Visual goal setting on the dungeon map.',
    },
    {
      beforeImage: galBeforeOffer,
      afterImage: galAfterOffer,
      beforeAlt: 'Before: generic monetisation popup',
      afterAlt: 'After: lore-driven offer with clear value',
      caption: 'Lore-driven monetisation outperforms generic popups.',
    },
    {
      beforeImage: galBeforeRecs,
      afterImage: galAfterRecs,
      beforeAlt: 'Before: no recommendations after defeat',
      afterAlt: 'After: community team recommendations',
      caption: 'Recommendations when players get stuck.',
    },
  ],
  processBoard: [
    { src: kShapeProblem, alt: 'K-shaped session distribution chart', x: 18, y: 28, rotate: -6, scale: 1.05, zIndex: 2 },
    { src: persona, alt: 'Casual Connoisseur persona', x: 78, y: 22, rotate: 5, scale: 0.95, zIndex: 3 },
    { src: gameLoopNegative, alt: 'Negative game loop diagram', x: 32, y: 62, rotate: -3, scale: 0.9, zIndex: 1 },
    { src: gameLoopPositive, alt: 'Positive AFK game loop', x: 68, y: 68, rotate: 4, scale: 0.92, zIndex: 4 },
    { src: handSketches, alt: 'Hand-drawn AFK concepts', x: 52, y: 38, rotate: -8, scale: 0.88, zIndex: 5 },
    { src: wireframeFlow, alt: 'Wireframe golden path', x: 14, y: 78, rotate: 7, scale: 0.85, zIndex: 2 },
    { src: userFlowFigma, alt: 'Figma user flow prototype', x: 86, y: 52, rotate: -4, scale: 0.9, zIndex: 3 },
  ],
}
