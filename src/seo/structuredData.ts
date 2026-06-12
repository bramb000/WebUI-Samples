import { ASPIRATION_KEYWORDS, SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from './site'

const BUILD_DATE = import.meta.env.VITE_BUILD_DATE ?? '2026-05-30'

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
  jobTitle: SITE_TAGLINE,
  description:
    'UX designer for games with live-ops and multi-platform product experience. Aspiring game product manager, game designer, and data analyst for games.',
  knowsAbout: [...ASPIRATION_KEYWORDS, 'game UX', 'mobile RPG', 'retention', 'monetization', 'accessibility'],
  sameAs: ['https://www.linkedin.com/in/bramdal/'],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: `${SITE_NAME} — Game UX & Product Portfolio`,
  url: SITE_URL,
  description:
    'Portfolio targeting game designer, UX designer for games, product manager for games, and data analyst for games roles.',
  author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
  inLanguage: 'en',
}

export const creativeWorksGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CreativeWork',
      name: 'Repairing stickiness to increase revenue by 50%',
      url: absoluteUrl('/work/guild-of-guardians'),
      description: 'Data-driven UX on a live mobile RPG: +25% D7 retention, +12% D7 LTV.',
    },
    {
      '@type': 'CreativeWork',
      name: 'Accessible guitar lessons for 1M+ learners',
      url: absoluteUrl('/work/rocksmith'),
      description: 'UX lead for a music learning game across five platforms with unified UI.',
    },
  ],
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function articleSchema(opts: {
  headline: string
  description: string
  path: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    url: absoluteUrl(opts.path),
    dateModified: BUILD_DATE,
    author: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Person', name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(opts.path),
  }
}

export function profilePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: `About ${SITE_NAME}`,
    url: absoluteUrl('/about'),
    dateModified: BUILD_DATE,
    mainEntity: { '@type': 'Person', name: SITE_NAME, url: SITE_URL },
  }
}
