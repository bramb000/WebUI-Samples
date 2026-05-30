/** Indexable routes — keep in sync with src/seo/indexablePaths.ts */
export const INDEXABLE_PATHS = [
  '/',
  '/about',
  '/work',
  '/work/list',
  '/work/guild-of-guardians',
  '/work/rocksmith',
]

export const SITEMAP_ENTRIES = [
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/about', changefreq: 'monthly', priority: '0.8' },
  { loc: '/work', changefreq: 'weekly', priority: '0.9' },
  { loc: '/work/list', changefreq: 'weekly', priority: '0.85' },
  { loc: '/work/guild-of-guardians', changefreq: 'monthly', priority: '0.9' },
  { loc: '/work/rocksmith', changefreq: 'monthly', priority: '0.9' },
]
