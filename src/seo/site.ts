/** Canonical production URL (override with VITE_SITE_URL in CI if needed). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '')
  || 'https://bramha.work'

export const SITE_NAME = 'Bramha Dalvi'
export const SITE_TAGLINE = 'UX designer for games · game product manager · data analyst for games'

/** Target search phrases — woven into titles, descriptions, and llms.txt. */
export const ASPIRATION_KEYWORDS = [
  'game designer',
  'product manager for games',
  'UX designer for games',
  'data analyst for games',
] as const

export const DEFAULT_OG_IMAGE_PATH = '/og-image.jpg'

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function joinKeywords(extra: string[] = []): string {
  return [...new Set([...ASPIRATION_KEYWORDS, ...extra])].join(', ')
}
