import { PROJECT_ROUTE_BY_ID } from './projectRoutes'

/** Alternate URL slugs → roster project `id`. */
const WORK_PROJECT_SLUG_ALIASES: Record<string, string> = {
  'guild-of-guardians': 'guild',
  'login-interaction-1': 'login',
}

const VALID_WORK_PROJECT_IDS = new Set(Object.keys(PROJECT_ROUTE_BY_ID))

/** Resolve a `/work?project=` or `/work/select/:slug` value to a roster project id. */
export function resolveWorkProjectSlug(slug: string | null | undefined): string | null {
  if (!slug?.trim())
    return null
  const normalized = slug.trim().toLowerCase()
  const id = WORK_PROJECT_SLUG_ALIASES[normalized] ?? normalized
  return VALID_WORK_PROJECT_IDS.has(id) ? id : null
}

/** Query object for deep-linking to a project on `/work`. */
export function workProjectQuery(id: string) {
  return { project: id }
}
