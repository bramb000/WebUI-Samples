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
const SERVER_WAIT_MS = Number(process.env.PRERENDER_SERVER_WAIT_MS || 180_000)
const FETCH_TIMEOUT_MS = 10_000
const PAGE_TIMEOUT_MS = 90_000

const ROUTE_WAIT_SELECTOR = {
  '/': '.detective-hero-intro__role',
  '/about': '.page-about',
  '/work': '#roster-pane',
  '/work/list': '.featured-case-studies',
  '/work/guild-of-guardians': '.project-hero',
  '/work/rocksmith': '.project-hero',
}

/** Block WebGL during prerender — headless CI can hang on Three.js init. */
const PRERENDER_INIT_SCRIPT = () => {
  window.__PRERENDER__ = true
  const originalGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    if (typeof type === 'string' && /webgl/i.test(type))
      return null
    return originalGetContext.call(this, type, attrs)
  }
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fetch(url, { redirect: 'follow', signal: controller.signal })
  }
  finally {
    clearTimeout(timer)
  }
}

function waitForServer(ms = SERVER_WAIT_MS) {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const tick = async () => {
      const elapsed = Date.now() - start
      if (elapsed > ms) {
        reject(new Error('Preview server did not start in time'))
        return
      }

      try {
        const res = await fetchWithTimeout(`${BASE}/`, Math.min(FETCH_TIMEOUT_MS, ms - elapsed))
        if (res.ok)
          return resolve()
      }
      catch {
        /* retry */
      }

      setTimeout(tick, 600)
    }
    tick()
  })
}

function startPreview() {
  return spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'],
    {
      cwd: ROOT,
      // Piped stdio without draining can deadlock the preview process on CI.
      stdio: 'ignore',
      env: { ...process.env, NODE_ENV: 'production' },
    },
  )
}

function stopPreview(preview) {
  if (!preview || preview.killed)
    return
  preview.kill('SIGTERM')
  setTimeout(() => {
    if (!preview.killed)
      preview.kill('SIGKILL')
  }, 3000).unref()
}

function outFileForRoute(route) {
  if (route === '/')
    return path.join(BUILD_DIR, 'index.html')
  const dir = path.join(BUILD_DIR, route.replace(/^\//, ''))
  return path.join(dir, 'index.html')
}

if (!fs.existsSync(BUILD_DIR)) {
  console.error('prerender: build/ not found — run vite build first')
  process.exit(1)
}

let preview = null
let browser = null

try {
  preview = startPreview()
  await waitForServer()

  browser = await chromium.launch({
    headless: true,
    timeout: 60_000,
    args: ['--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox'],
  })

  const context = await browser.newContext()
  context.setDefaultTimeout(PAGE_TIMEOUT_MS)
  await context.addInitScript(PRERENDER_INIT_SCRIPT)

  for (const route of INDEXABLE_PATHS) {
    const page = await context.newPage()
    await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT_MS })
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

  await context.close()
  await browser.close()
  browser = null
}
catch (err) {
  console.error('prerender failed:', err instanceof Error ? err.message : err)
  process.exitCode = 1
}
finally {
  if (browser)
    await browser.close().catch(() => {})
  stopPreview(preview)
}

if (process.exitCode === 1)
  process.exit(1)

console.log(`Prerender complete (${INDEXABLE_PATHS.length} routes)`)
