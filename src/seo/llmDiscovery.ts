import { absoluteUrl } from './site'

export const LLMS_TXT_PATH = '/llms.txt'
export const LLMS_FULL_PATH = '/llms-full.txt'
export const LLM_MIRROR_INDEX_PATH = '/llm/index.txt'

/** Plain-text mirror path per indexable route — keep in sync with scripts/generate-llm-mirror.mjs */
const LLM_MIRROR_BY_ROUTE: Record<string, string> = {
  '/': '/llm/home.txt',
  '/about': '/llm/about.txt',
  '/work': '/llm/work.txt',
  '/work/list': '/llm/work-list.txt',
  '/work/guild-of-guardians': '/llm/guild-of-guardians.txt',
  '/work/rocksmith': '/llm/rocksmith.txt',
}

export function llmMirrorPathForRoute(routePath: string): string | null {
  const path = routePath.split('?')[0] || '/'
  return LLM_MIRROR_BY_ROUTE[path] ?? null
}

/** Head links + meta so crawlers and in-browser LLMs discover machine-readable content. */
export function llmDiscoveryHead(routePath: string, { indexable = true }: { indexable?: boolean } = {}) {
  const llmsUrl = absoluteUrl(LLMS_TXT_PATH)
  const llmsFullUrl = absoluteUrl(LLMS_FULL_PATH)
  const mirrorIndexUrl = absoluteUrl(LLM_MIRROR_INDEX_PATH)

  const link: Array<{
    rel: 'alternate'
    type: 'text/plain'
    href: string
    title: string
  }> = [
    { rel: 'alternate', type: 'text/plain', href: llmsUrl, title: 'LLM site summary (llms.txt)' },
    { rel: 'alternate', type: 'text/plain', href: llmsFullUrl, title: 'LLM full portfolio context' },
    { rel: 'alternate', type: 'text/plain', href: mirrorIndexUrl, title: 'LLM plain-text page index' },
  ]

  if (indexable) {
    const mirror = llmMirrorPathForRoute(routePath)
    if (mirror) {
      link.push({
        rel: 'alternate',
        type: 'text/plain',
        href: absoluteUrl(mirror),
        title: 'Plain-text mirror of this page (for LLMs)',
      })
    }
  }

  const meta = [
    { name: 'llms-txt', content: llmsUrl },
    { name: 'ai-content-summary', content: llmsUrl },
  ]

  return { link, meta }
}
