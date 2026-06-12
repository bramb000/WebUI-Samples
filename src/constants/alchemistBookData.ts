export type AlchemistBookImageKey =
  | 'cover'
  | 'understand'
  | 'analyze'
  | 'brew'
  | 'deliver'
  | 'end'

export type TalesBookImageKey =
  | 'tale-cover'
  | 'tale-back'
  | 'tale-07'
  | 'tale-08'
  | 'tale-09'
  | 'tale-10'
  | 'tale-11'
  | 'tale-12'
  | 'tale-13'

export type BookImageKey = AlchemistBookImageKey | TalesBookImageKey

/** Blank parchment leaf (e.g. first front / last back). */
export type BookPageEmpty = {
  layout: 'empty'
}

/** Full-bleed image (optional embossed title on cover board only). */
export type BookPageLeft = {
  layout: 'left'
  imageKey: BookImageKey
  header?: string
  subtitle?: string
}

/** Hardcover board — optional art panel + embossed title. */
export type BookCoverPage = {
  imageKey?: BookImageKey
  header?: string
  subtitle?: string
  /** When true, image fills the board with no leather frame, scrim, or title overlay. */
  fullBleed?: boolean
}

/** Spelled-out number header (centred) + calligraphy body (left-aligned) */
export type BookPageRight = {
  layout: 'right'
  /** Spelled out: One, Two, Three, Four — omit for testimonial pages */
  number?: string
  body: string
  /** Name + role below body (testimonial pages) */
  attribution?: string
}

export type BookPageFace = BookPageEmpty | BookPageLeft | BookPageRight

export type BookLeaf = { front: BookPageFace; back: BookPageFace }

/** Baked onto the hardcover boards (not a scroll leaf). */
export const ALCHEMIST_BOOK_COVER: BookPageLeft = {
  layout: 'left',
  imageKey: 'cover',
  header: 'My Product Philosophy',
}

/** Hardcover board content for the 3D scene. */
export const ALCHEMIST_BOOK_COVER_BOARD: BookCoverPage = {
  imageKey: 'cover',
  header: 'My Product Philosophy',
}

/**
 * Leaf stack: image on back of leaf N, paired text on front of leaf N+1.
 * First front and last back are empty endpapers.
 */
export const ALCHEMIST_BOOK_LEAVES: BookLeaf[] = [
  {
    front: { layout: 'empty' },
    back: {
      layout: 'left',
      imageKey: 'understand',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'One',
      body: 'There is tons of nuance between a product that will catch a human\'s eye compared to a product that people will spend money on. Understand what users say and what users do to bridge that gap by knowing their problems and map the ideal solution where they are not only delighted, but willing to pay.',
    },
    back: {
      layout: 'left',
      imageKey: 'analyze',
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
      imageKey: 'brew',
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
      imageKey: 'deliver',
    },
  },
  {
    front: {
      layout: 'right',
      number: 'Four',
      body: 'No one can go far without the support of their teammates and their customers. Respecting them will earn you their support.',
    },
    back: { layout: 'empty' },
  },
]

export const ALCHEMIST_PHASE_LABELS = [
  'Customer',
  'Organisation',
  'Fail',
  'Respect',
] as const
