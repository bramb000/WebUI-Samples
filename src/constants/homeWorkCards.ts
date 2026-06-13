import type { RouteLocationRaw } from 'vue-router'
import { homeWorkCardArt } from '../assets/images/home-work-cards/homeWorkCardImages'
import { workProjectQuery } from './workProjectSlug'

export type HomeWorkCardData = {
  id: string
  year: string
  company: string
  title: string
  description: string
  to: RouteLocationRaw
  poster?: string
  video?: string
  visualPlaceholder?: boolean
  transparentVisual?: boolean
  featherVisualEdges?: boolean | 'strong'
}

export const homeWorkCards: HomeWorkCardData[] = [
  {
    id: 'rocksmith',
    year: '2020–2022',
    company: 'Ubisoft',
    title: 'Accessible guitar lessons for 1M+ learners',
    description: 'One scalable UI system across five platforms for a music learning game.',
    to: { path: '/work', query: workProjectQuery('rocksmith') },
    ...homeWorkCardArt('rocksmith'),
  },
  {
    id: 'guild',
    year: '2025',
    company: 'Immutable',
    title: 'Repairing stickiness to increase revenue by 50%',
    description: 'Data-driven design on a live mobile RPG: +25% D7 retention, +12% D7 LTV.',
    to: { path: '/work', query: workProjectQuery('guild') },
    ...homeWorkCardArt('guild'),
  },
]
