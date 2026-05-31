/**
 * Builds plain-text mirrors of prerendered pages under build/llm/ for LLM parsers.
 * Run after prerender.mjs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { INDEXABLE_PATHS } from './seo-routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BUILD = path.join(ROOT, 'build')
const LLM_DIR = path.join(BUILD, 'llm')
const SITE_URL = (process.env.VITE_SITE_URL || process.env.SITE_URL || 'https://bramha.work').replace(/\/$/, '')

/** Route → filename under /llm/ — keep in sync with src/seo/llmDiscovery.ts */
const MIRROR_FILE = {
  '/': 'home.txt',
  '/about': 'about.txt',
  '/work': 'work.txt',
  '/work/list': 'work-list.txt',
  '/work/guild-of-guardians': 'guild-of-guardians.txt',
  '/work/rocksmith': 'rocksmith.txt',
}

function htmlPathForRoute(route) {
  if (route === '/') return path.join(BUILD, 'index.html')
  return path.join(BUILD, route.replace(/^\//, ''), 'index.html')
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractTitle(html) {
  const raw = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? ''
  return decodeEntities(raw)
}

function extractMetaDescription(html) {
  return html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ?? ''
}

function extractCanonical(html) {
  return html.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i)?.[1]?.trim() ?? ''
}

/** Rough HTML → readable plain text (headings, lists, blocks preserved). */
function htmlToPlainText(html) {
  let body = html
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (bodyMatch) body = bodyMatch[1]

  return body
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[\s\S]*?<\/svg>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n')
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function mirrorUrlForRoute(route) {
  const file = MIRROR_FILE[route]
  return file ? `${SITE_URL}/llm/${file}` : null
}

if (!fs.existsSync(BUILD)) {
  console.error('generate-llm-mirror: build/ not found — run vite build + prerender first')
  process.exit(1)
}

fs.mkdirSync(LLM_DIR, { recursive: true })

const catalog = []

for (const route of INDEXABLE_PATHS) {
  const htmlFile = htmlPathForRoute(route)
  const outName = MIRROR_FILE[route]
  if (!outName) continue

  if (!fs.existsSync(htmlFile)) {
    console.error(`generate-llm-mirror: missing prerender ${path.relative(ROOT, htmlFile)}`)
    process.exit(1)
  }

  const html = fs.readFileSync(htmlFile, 'utf8')
  const title = extractTitle(html)
  const description = extractMetaDescription(html)
  const canonical = extractCanonical(html) || `${SITE_URL}${route === '/' ? '/' : route}`
  const body = htmlToPlainText(html)
  const mirrorUrl = mirrorUrlForRoute(route)

  const doc = `# ${title}

url: ${canonical}
route: ${route}
format: text/plain; charset=utf-8
llms-txt: ${SITE_URL}/llms.txt
llms-full: ${SITE_URL}/llms-full.txt
description: ${description}

---

${body}
`

  const outFile = path.join(LLM_DIR, outName)
  fs.writeFileSync(outFile, doc)
  catalog.push({ route, title, description, mirrorUrl, file: outName })
  console.log(`Wrote llm mirror ${route} → build/llm/${outName}`)
}

const indexLines = [
  '# Bramha Dalvi — Plain-text page index for LLMs',
  '',
  `site: ${SITE_URL}`,
  `summary: ${SITE_URL}/llms.txt`,
  `full-context: ${SITE_URL}/llms-full.txt`,
  `sitemap: ${SITE_URL}/sitemap.xml`,
  '',
  'Prefer these plain-text mirrors over parsing HTML. Each file is generated from prerendered page content.',
  '',
  '## Pages',
  '',
  ...catalog.map(({ route, title, mirrorUrl, file }) =>
    `- [${title}](${mirrorUrl}) — route \`${route}\` → /llm/${file}`),
  '',
  '## Quick start for AI systems',
  '',
  '1. Read /llms.txt for identity, skills, and case study summaries.',
  '2. Read /llms-full.txt for extended context.',
  '3. Fetch /llm/<page>.txt for the plain-text body of a specific page.',
  '',
]

fs.writeFileSync(path.join(LLM_DIR, 'index.txt'), indexLines.join('\n'))

// .well-known/llms.txt — secondary discovery path used by some LLM crawlers
const wellKnownDir = path.join(BUILD, '.well-known')
fs.mkdirSync(wellKnownDir, { recursive: true })
const publicLlms = path.join(ROOT, 'public', 'llms.txt')
if (fs.existsSync(publicLlms)) {
  fs.copyFileSync(publicLlms, path.join(wellKnownDir, 'llms.txt'))
}

console.log(`LLM mirrors complete (${catalog.length} pages + index.txt)`)
