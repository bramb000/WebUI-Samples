/**
 * Post-build checks for prerendered SEO artifacts.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { INDEXABLE_PATHS } from './seo-routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BUILD = path.join(ROOT, 'build')

const PHRASE = 'UX designer for games'

function htmlPathForRoute(route) {
  if (route === '/') return path.join(BUILD, 'index.html')
  return path.join(BUILD, route.replace(/^\//, ''), 'index.html')
}

let failed = 0

for (const route of INDEXABLE_PATHS) {
  const file = htmlPathForRoute(route)
  if (!fs.existsSync(file)) {
    console.error(`FAIL: missing prerender ${path.relative(ROOT, file)}`)
    failed++
    continue
  }
  const html = fs.readFileSync(file, 'utf8')
  if (!/<title>[^<]+<\/title>/i.test(html)) {
    console.error(`FAIL: ${route} missing <title>`)
    failed++
  }
  if (!/name="description"/i.test(html)) {
    console.error(`FAIL: ${route} missing meta description`)
    failed++
  }
}

const homeHtml = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8')
if (!homeHtml.includes(PHRASE) && !homeHtml.includes('game designer')) {
  console.error(`FAIL: home prerender missing target SEO phrases`)
  failed++
}

const sitemap = path.join(BUILD, 'sitemap.xml')
if (!fs.existsSync(sitemap)) {
  console.error('FAIL: build/sitemap.xml missing')
  failed++
} else {
  const xml = fs.readFileSync(sitemap, 'utf8')
  const count = (xml.match(/<url>/g) ?? []).length
  if (count !== INDEXABLE_PATHS.length) {
    console.error(`FAIL: sitemap has ${count} URLs, expected ${INDEXABLE_PATHS.length}`)
    failed++
  }
}

for (const name of ['llms.txt', 'llms-full.txt', 'robots.txt', 'sitemap.xml']) {
  if (!fs.existsSync(path.join(BUILD, name))) {
    console.error(`FAIL: build/${name} missing`)
    failed++
  }
}

if (failed > 0) {
  console.error(`seo-smoke-test: ${failed} failure(s)`)
  process.exit(1)
}

console.log(`seo-smoke-test: OK (${INDEXABLE_PATHS.length} prerendered routes)`)
