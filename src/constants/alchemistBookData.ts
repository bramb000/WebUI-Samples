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
  subtitle: 'Principles for building what people pay for',
}

export const ALCHEMIST_BOOK_SPREADS: BookSpread[] = [
  {
    front: {
      layout: 'right',
      number: 'One',
      body: 'There is tons of nuance between a product that will catch a human\'s eye compared to a product that people will spend money on. Understand what users say and what users do to bridge that gap by knowing their problems and map the ideal solution where they are not only delighted, but willing to pay.',
    },
    back: {
      layout: 'left',
      imageKey: 'understand',
      header: 'Understand the customer',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Two',
      body: 'Organisations are driven by the vision and the culture of their humans. This results in unique and fun constraints ranging from philosophies on value proposition to tech stacks. It is imperative to fully understand all of them to build profitable products that don\'t go against the grain of what\'s available to work with and don\'t cost too much money or human happiness to make.',
    },
    back: {
      layout: 'left',
      imageKey: 'analyze',
      header: 'Understand the organisation',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Three',
      body: 'Because every problem is new, learning is the fastest and most reliable way to solve it. Learning requires tons of failure, so build processes that reduce the cost of failure and make pivots faster. The more you build process around learning cheaply, the more likely you are to find a solution quicker.',
    },
    back: {
      layout: 'left',
      imageKey: 'brew',
      header: 'Don\'t be afraid to fail',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Four',
      body: 'No one can go far without the support of their teammates and their customers. Respecting them will earn you their support.',
    },
    back: {
      layout: 'left',
      imageKey: 'deliver',
      header: 'Respect humans',
    },
  },
]

export const ALCHEMIST_PHASE_LABELS = [
  'Customer',
  'Organisation',
  'Fail',
  'Respect',
] as const
