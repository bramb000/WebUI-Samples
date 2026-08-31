/** Indexable routes — keep in sync with src/seo/indexablePaths.ts */
export const INDEXABLE_PATHS = [
  '/',
  '/about',
  '/work',
  '/work/list',
  '/work/guild-of-guardians',
  '/work/rocksmith',
  '/work/cozy-corner',
  '/work/online-dice-simulator',
  '/work/planoverse',
]

export const SITEMAP_ENTRIES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/work', changefreq: 'weekly', priority: '0.9' },
  { loc: '/work/list', changefreq: 'weekly', priority: '0.85' },
  { loc: '/work/guild-of-guardians', changefreq: 'monthly', priority: '0.9' },
  { loc: '/work/rocksmith', changefreq: 'monthly', priority: '0.9' },
  { loc: '/work/cozy-corner', changefreq: 'monthly', priority: '0.85' },
  { loc: '/work/online-dice-simulator', changefreq: 'monthly', priority: '0.85' },
  { loc: '/work/planoverse', changefreq: 'monthly', priority: '0.85' },
]
