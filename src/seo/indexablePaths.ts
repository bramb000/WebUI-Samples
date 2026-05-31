/** Indexable routes — keep in sync with scripts/seo-routes.mjs */
export const INDEXABLE_PATHS = [
  '/',
  '/about',
  '/work',
  '/work/list',
  '/work/guild-of-guardians',
  '/work/rocksmith',
  '/work/cozy-corner',
] as const

export type IndexablePath = (typeof INDEXABLE_PATHS)[number]
