export type BookImageKey =
  | 'cover'
  | 'understand'
  | 'analyze'
  | 'brew'
  | 'deliver'
  | 'end'

/** Full-bleed image + embossed header at true page centre */
export type BookPageLeft = {
  layout: 'left'
  imageKey: BookImageKey
  header: string
  /** Optional line under header (e.g. cover kicker) */
  subtitle?: string
}

/** Spelled-out number header (centred) + calligraphy body (left-aligned) */
export type BookPageRight = {
  layout: 'right'
  /** Spelled out: One, Two, Three, Four */
  number: string
  body: string
}

export type BookPageFace = BookPageLeft | BookPageRight

export type BookSpread = { front: BookPageFace; back: BookPageFace }

/** Baked onto the hardcover boards (not a scroll leaf). */
export const ALCHEMIST_BOOK_COVER: BookPageLeft = {
  layout: 'left',
  imageKey: 'cover',
  header: 'My Product Textbook',
  subtitle: 'Brewing for success',
}

export const ALCHEMIST_BOOK_SPREADS: BookSpread[] = [
  {
    front: {
      layout: 'right',
      number: '',
      body: 'Turn the page to begin.',
    },
    back: {
      layout: 'left',
      imageKey: 'understand',
      header: 'Understand',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'One',
      body: 'I map the problem space — users, constraints, and the business outcomes the product must serve.',
    },
    back: {
      layout: 'left',
      imageKey: 'analyze',
      header: 'Analyze',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Two',
      body: 'Data, systems, and behaviour get distilled into clear hypotheses about what to change and why.',
    },
    back: {
      layout: 'left',
      imageKey: 'brew',
      header: 'Brew',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Three',
      body: 'Experiments, prototypes, and craft — shaping interactions that feel inevitable once they ship.',
    },
    back: {
      layout: 'left',
      imageKey: 'deliver',
      header: 'Deliver',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Four',
      body: 'Launch, learn, and refine — retention, revenue, and delight as proof the elixir worked.',
    },
    back: {
      layout: 'left',
      imageKey: 'end',
      header: 'Keep scrolling for case studies',
    },
  },
]

export const ALCHEMIST_PHASE_LABELS = [
  'Understand',
  'Analyze',
  'Brew',
  'Deliver',
] as const
