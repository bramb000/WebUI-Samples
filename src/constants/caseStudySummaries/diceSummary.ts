import type { CaseStudySummaryData } from '../../types/caseStudySummary'
import crowdedTableImg from '../../assets/images/online-dice-simulator/crowded_game_table.png'
import laptopsTableImg from '../../assets/images/online-dice-simulator/laptops_game_table.png'
import heroImg from '../../assets/images/online-dice-simulator/screenshot_1.png'
import presetsImg from '../../assets/images/online-dice-simulator/dice_presets_ui.png'
import touchHeatmapImg from '../../assets/images/online-dice-simulator/thumb_touch_heatmap.png'
const rollMobileLoader = () => import('../../assets/images/online-dice-simulator/roll-mobile.webm')

export const diceSummary: CaseStudySummaryData = {
  metrics: [
    { value: '1.5k', label: 'Monthly Active (MAU)', theme: 'after' },
    { value: '$250', label: 'Monthly Revenue (MRR)', theme: 'after' },
  ],
  beats: [
    {
      kicker: '01 · Problem',
      text: 'Game nights are <strong>physically crowded</strong>: dice knock minis, laptops block eye contact, setup steals table space.',
    },
    {
      kicker: '02 · Insight',
      text: '60 player observations: the fix is a <strong>flat phone utility</strong> with zero install, thumb-reach controls, and instant rolls.',
    },
    {
      kicker: '03 · Outcome',
      text: 'Solo-built in 3 days → <strong>1.5k MAU</strong> and <strong>$250 MRR</strong> from cosmetic dice skins via organic Reddit & Discord.',
    },
  ],
  featureClip: {
    kind: 'lazy-video',
    loader: rollMobileLoader,
    title: '3D physics roll: mobile-first dice tray',
  },
  flows: [
    {
      phase: 'before',
      media: {
        kind: 'image',
        src: crowdedTableImg,
        title: 'Crowded physical game table',
      },
      insight: {
        stat: 'Chaos rolls',
        statLabel: 'dice in drinks, knocked minis, lost space',
      },
    },
    {
      phase: 'after',
      media: {
        kind: 'lazy-video',
        loader: rollMobileLoader,
        title: 'Mobile 3D physics roll',
      },
      insight: {
        stat: 'One hand',
        statLabel: 'thumb-zone controls, flat on the table',
      },
    },
  ],
  comparisons: [
    {
      beforeImage: crowdedTableImg,
      afterImage: heroImg,
      beforeAlt: 'Crowded D&D table with physical dice and books',
      afterAlt: 'Online Dice Simulator on phone',
      caption: 'Table space reclaimed. Dice live on a flat phone.',
    },
    {
      beforeImage: laptopsTableImg,
      afterImage: presetsImg,
      beforeAlt: 'Laptops blocking sightlines at game night',
      afterAlt: 'Dice presets UI on mobile',
      caption: 'Laptop barrier replaced by a lightweight web utility.',
    },
  ],
  processBoard: [
    { src: touchHeatmapImg, alt: 'Thumb reach heatmap', x: 24, y: 34, rotate: -7, scale: 1, zIndex: 3 },
    { src: presetsImg, alt: 'Dice presets interface', x: 70, y: 28, rotate: 5, scale: 0.92, zIndex: 2 },
    { src: heroImg, alt: 'Mobile roll breakdown UI', x: 48, y: 66, rotate: -3, scale: 0.88, zIndex: 4 },
  ],
}
