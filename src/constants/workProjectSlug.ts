import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { PROJECT_ROUTE_BY_ID } from './projectRoutes'

/** Alternate URL slugs → roster project `id`. */
const WORK_PROJECT_SLUG_ALIASES: Record<string, string> = {
  'guild-of-guardians': 'guild',
  'login-interaction-1': 'login',
}

const VALID_WORK_PROJECT_IDS = new Set(Object.keys(PROJECT_ROUTE_BY_ID))

export type WorkProjectSelectSource = 'roster_click' | 'deep_link' | 'url_sync'

/** Resolve a `/work?project=` or `/work/select/:slug` value to a roster project id. */
export function resolveWorkProjectSlug(slug: string | null | undefined): string | null {
  if (!slug?.trim())
    return null
  const normalized = slug.trim().toLowerCase()
  const id = WORK_PROJECT_SLUG_ALIASES[normalized] ?? normalized
  return VALID_WORK_PROJECT_IDS.has(id) ? id : null
}

/** Read raw slug from `/work?project=` or legacy hash deep links. */
export function readWorkProjectSlugFromQuery(
  query: RouteLocationNormalizedLoaded['query'],
): string | null {
  const q = query.project
  if (typeof q === 'string' && q.trim())
    return q.trim()
  if (Array.isArray(q) && typeof q[0] === 'string' && q[0].trim())
    return q[0].trim()
  return null
}

/** Resolve a standalone project route (e.g. `/work/rocksmith`) to roster id. */
export function resolveWorkProjectFromPath(pathname: string): string | null {
  for (const [id, routePath] of Object.entries(PROJECT_ROUTE_BY_ID)) {
    if (pathname === routePath)
      return id
  }
  return null
}

/** PostHog properties for work project context on `/work` and standalone project routes. */
export function workProjectAnalyticsProps(
  path: string,
  query: RouteLocationNormalizedLoaded['query'],
  hash = '',
): Record<string, string> {
  if (path === '/work') {
    const slugRaw =
      readWorkProjectSlugFromQuery(query) ?? (hash.replace(/^#/, '').trim() || null)
    if (!slugRaw)
      return {}
    const projectId = resolveWorkProjectSlug(slugRaw)
    if (!projectId)
      return {}
    return {
      work_project_id: projectId,
      work_project_slug_raw: slugRaw,
    }
  }

  const projectId = resolveWorkProjectFromPath(path)
  if (!projectId)
    return {}
  return { work_project_id: projectId }
}

/** Query object for deep-linking to a project on `/work`. */
export function workProjectQuery(id: string) {
  return { project: id }
}
