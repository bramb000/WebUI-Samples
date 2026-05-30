/**
 * Writes build/sitemap.xml after vite build.
 * Set SITE_URL env to override canonical host (default: https://bramha.work).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITEMAP_ENTRIES } from './seo-routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BUILD_DIR = path.join(ROOT, 'build')
const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://bramha.work').replace(/\/$/, '')

const lastmod = new Date().toISOString().slice(0, 10)

const urls = SITEMAP_ENTRIES.map(
  ({ loc, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
).join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

if (!fs.existsSync(BUILD_DIR)) {
  console.error('generate-sitemap: build/ not found — run vite build first')
  process.exit(1)
}

for (const name of ['llms.txt', 'llms-full.txt', 'humans.txt']) {
  const src = path.join(ROOT, 'public', name)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(BUILD_DIR, name))
}

fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'), xml)
console.log(`Wrote sitemap.xml (${SITEMAP_ENTRIES.length} URLs) → ${SITE_URL}`)
