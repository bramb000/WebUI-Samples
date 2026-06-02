import type { RouteMetaSeo } from './types'

/** SEO metadata keyed by route name (see router/index.ts). */
export const ROUTE_SEO: Record<string, RouteMetaSeo> = {
  Home: {
    title: 'Bramha Dalvi | UX Designer for Games · Game Product Manager',
    description:
      'Portfolio of Bramha Dalvi — UX designer for games, aspiring game product manager, game designer, and data analyst for games. Case studies on mobile RPG retention, multi-platform game UX, and data-driven live ops.',
    keywords: ['game designer', 'UX designer for games', 'product manager for games', 'data analyst for games', 'game UX portfolio'],
    ogType: 'website',
  },
  About: {
    title: 'About Bramha Dalvi | Game UX & Product Design',
    description:
      'Product specialist with 7+ years turning player engagement into revenue. UX designer for games exploring game product management, game design, and analytics for live games.',
    keywords: ['about', 'game UX designer', 'product manager for games', 'game designer'],
  },
  Work: {
    title: 'Game Design & UX Case Studies | Bramha Dalvi',
    description:
      'Interactive roster of game UX and product work — mobile RPG retention, Rocksmith+ multi-platform UI, and experiments. For hiring managers seeking a UX designer for games or game product manager.',
    keywords: ['game UX case studies', 'UX designer for games', 'game product design'],
  },
  WorkList: {
    title: 'All Projects | Game UX & Product Portfolio',
    description:
      'Full list of game UX, product, and design projects by Bramha Dalvi — UX designer for games with data-driven live-ops experience.',
    keywords: ['game portfolio', 'UX designer for games', 'game designer portfolio'],
  },
  ProjectGuild: {
    title: 'Guild of Guardians Case Study | Data-Driven Game UX',
    description:
      'How data analysis and UX feature design raised D7 retention 25% and D7 LTV 12% on a live mobile RPG — relevant for game product manager and data analyst for games roles.',
    keywords: ['mobile RPG UX', 'game retention', 'data analyst for games', 'product manager for games', 'live ops'],
    ogImage: '/og-guild.jpg',
    ogType: 'article',
  },
  ProjectRocksmith: {
    title: 'Rocksmith+ Case Study | Multi-Platform Game UX',
    description:
      'UX lead case study: one scalable UI system across 5 platforms for a music learning game. Game designer and UX designer for games — accessibility, input systems, and console/mobile parity.',
    keywords: ['game UX', 'multi-platform game UI', 'UX designer for games', 'Ubisoft', 'accessibility'],
    ogImage: '/og-rocksmith.jpg',
    ogType: 'article',
  },
  LoginInteraction1: {
    title: 'Login Interaction Experiment',
    description: 'Micro-interaction prototype — not indexed.',
    robots: 'noindex, nofollow',
  },
  NodeGraph: {
    title: 'Node Graph Experiment',
    description: 'Design system experiment — not indexed.',
    robots: 'noindex, nofollow',
  },
  ExperimentPatapon: {
    title: 'Patapon UI Experiment',
    description: 'UI experiment — not indexed.',
    robots: 'noindex, nofollow',
  },
  ExperimentHelldivers: {
    title: 'Helldivers UI Experiment',
    description: 'UI experiment — not indexed.',
    robots: 'noindex, nofollow',
  },
  ExperimentJedi: {
    title: 'Jedi UI Experiment',
    description: 'UI experiment — not indexed.',
    robots: 'noindex, nofollow',
  },
  SalesModal: {
    title: 'Sales Modal Prototype',
    description: 'Prototype — not indexed.',
    robots: 'noindex, nofollow',
  },
  AccountTray: {
    title: 'Account Tray Prototype',
    description: 'Prototype — not indexed.',
    robots: 'noindex, nofollow',
  },
  VoiceChatSimulation: {
    title: 'Voice Chat Prototype',
    description: 'Prototype — not indexed.',
    robots: 'noindex, nofollow',
  },
  ProjectCozyCorner: {
    title: 'Building digital third spaces using SDKs and APIs | Design Engineer Case Study',
    description:
      'Design-engineer breakdown of a cozy pixel messaging app — Next.js, Supabase realtime, LiveKit voice, layered sprite avatars, and Canvas world sync.',
    keywords: ['design engineer', 'pixel UI', 'real-time chat', 'Next.js', 'social app UX'],
    ogType: 'article',
  },
}

export const DEFAULT_ROUTE_SEO: RouteMetaSeo = {
  title: 'Bramha Dalvi | UX Designer for Games',
  description:
    'Portfolio showcasing game UX, product thinking, and analytics — UX designer for games, game product manager, game designer, and data analyst for games.',
  keywords: [...['game designer', 'UX designer for games', 'product manager for games', 'data analyst for games']],
}
