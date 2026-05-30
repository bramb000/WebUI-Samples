/**
 * Prerenders indexable routes to static HTML under build/ using Playwright.
 * Run after `vite build` and before copying 404.html.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { INDEXABLE_PATHS } from './seo-routes.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const BUILD_DIR = path.join(ROOT, 'build')
const PORT = Number(process.env.PRERENDER_PORT || 4173)
const BASE = `http://127.0.0.1:${PORT}`

const ROUTE_WAIT_SELECTOR = {
  '/': '.detective-hero-intro__role',
  '/about': '.page-about',
  '/work': '#roster-pane',
  '/work/list': '.featured-case-studies',
  '/work/guild-of-guardians': '.project-hero',
  '/work/rocksmith': '.project-hero',
}

function waitForServer(ms = 180_000) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const res = await fetch(`${BASE}/`, { redirect: 'follow' })
        if (res.ok) return resolve()
      } catch {
        /* retry */
      }
      if (Date.now() - start > ms) reject(new Error('Preview server did not start in time'))
      else setTimeout(tick, 600)
    }
    tick()
  })
}

function startPreview() {
  return spawn('npm', ['run', 'preview', '--', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production' },
  })
}

function outFileForRoute(route) {
  if (route === '/') return path.join(BUILD_DIR, 'index.html')
  const dir = path.join(BUILD_DIR, route.replace(/^\//, ''))
  return path.join(dir, 'index.html')
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error('prerender: build/ not found — run vite build first')
  process.exit(1)
}

const preview = startPreview()
preview.stderr?.on('data', (chunk) => {
  const line = String(chunk)
  if (line.includes('error') || line.includes('Error')) console.error('[preview]', line.trim())
})

try {
  await waitForServer()
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()

  for (const route of INDEXABLE_PATHS) {
    const page = await context.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
    const selector = ROUTE_WAIT_SELECTOR[route] ?? 'main'
    await page.waitForSelector(selector, { timeout: 45_000 }).catch(() => {})
    await page.waitForTimeout(1200)

    const html = await page.content()
    const outFile = outFileForRoute(route)
    fs.mkdirSync(path.dirname(outFile), { recursive: true })
    fs.writeFileSync(outFile, html)
    console.log(`Prerendered ${route} → ${path.relative(ROOT, outFile)}`)
    await page.close()
  }

  await browser.close()
} finally {
  preview.kill('SIGTERM')
}

console.log(`Prerender complete (${INDEXABLE_PATHS.length} routes)`)
