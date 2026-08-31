/**
 * Capture high-resolution Planoverse case study screenshots from the live demo.
 * Run: node scripts/capture-planoverse-screenshots.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../src/assets/images/planoverse')
const BASE = 'https://bramb000.github.io/retail-competitive-intelligence/#'

const VIEWPORT = { width: 1600, height: 1200 }
const SCALE = 2

async function waitForApp(page) {
  await page.waitForFunction(
    () => !document.body.innerText.includes('Loading Retail CI'),
    { timeout: 60000 },
  )
  await page.waitForTimeout(1200)
}

async function goto(page, hash) {
  await page.goto(`${BASE}${hash}`, { waitUntil: 'networkidle', timeout: 90000 })
  await waitForApp(page)
}

async function dismissPanel(page) {
  await page.keyboard.press('Escape')
  await page.waitForTimeout(150)
}

async function clickCategoryChip(page, label) {
  const chip = page.getByRole('button', { name: new RegExp(label, 'i') }).first()
  if (await chip.count()) {
    await chip.click()
    await page.waitForTimeout(700)
    return true
  }
  return false
}

async function panelPrimaryTitle(panel) {
  return panel.evaluate((el) => {
    const lines = el.innerText.split('\n').map(l => l.trim()).filter(Boolean)
    const idx = lines.findIndex(l => l.includes('BAY COMPARISON'))
    if (idx >= 0 && lines[idx + 1]) return lines[idx + 1]
    for (const line of lines) {
      if (line.length > 3 && line.length < 80 && !/^(Close|Overview|Insights|C|W|Coles|Woolworths)$/i.test(line)) {
        return line
      }
    }
    return lines[0] ?? ''
  })
}

async function openBayPanel(page, canvasIndex, expectLabel) {
  const pattern = new RegExp(`^${expectLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i')

  for (const idx of [canvasIndex, canvasIndex === 1 ? 0 : 1]) {
    const canvas = page.locator('canvas').nth(idx)
    if (await canvas.count() === 0) continue
    const box = await canvas.boundingBox()
    if (!box) continue

    for (let gy = 0.2; gy <= 0.9; gy += 0.04) {
      for (let gx = 0.15; gx <= 0.85; gx += 0.04) {
        await dismissPanel(page)
        await page.mouse.click(box.x + box.width * gx, box.y + box.height * gy)
        await page.waitForTimeout(220)
        const panel = page.locator('.macrospace-bay-comparison').first()
        if (await panel.count() === 0) continue
        const primary = await panelPrimaryTitle(panel)
        if (pattern.test(primary)) return true
      }
    }
  }
  return false
}

async function screenshotButterfly(page, outFile, withTooltip = false) {
  const butterfly = page.locator('.panel.bay-butterfly-panel').first()
  await butterfly.waitFor({ state: 'visible', timeout: 30000 })
  await butterfly.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  if (withTooltip) await openShareTooltip(page)
  const box = await butterfly.boundingBox()
  if (!box) throw new Error('Share of store chart not found')
  await page.screenshot({
    path: outFile,
    clip: {
      x: box.x,
      y: box.y,
      width: box.width,
      height: Math.min(box.height, 560),
    },
  })
}

async function screenshotMethodSection(page, headingText, outFile) {
  const clip = await page.evaluate((text) => {
    const wiki = document.querySelector('.methods-wiki')
    if (!wiki) return null
    const heads = Array.from(wiki.querySelectorAll('h2, h3'))
    const idx = heads.findIndex(h => h.textContent?.includes(text))
    if (idx < 0) return null
    const start = heads[idx]
    const end = heads[idx + 1]
    const nodes = [start]
    let el = start.nextElementSibling
    while (el && el !== end) {
      nodes.push(el)
      el = el.nextElementSibling
    }
    const pad = 12
    const rects = nodes.map(n => n.getBoundingClientRect())
    const x = Math.min(...rects.map(r => r.left)) - pad
    const y = Math.min(...rects.map(r => r.top)) - pad
    const x2 = Math.max(...rects.map(r => r.right)) + pad
    const y2 = Math.max(...rects.map(r => r.bottom)) + pad
    return {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: x2 - x,
      height: y2 - y,
    }
  }, headingText)

  if (!clip) throw new Error(`Method section not found: ${headingText}`)
  await page.screenshot({ path: outFile, clip })
}

async function screenshotMain(page, file) {
  const main = page.locator('main').first()
  const box = await main.boundingBox()
  if (box) {
    await page.screenshot({ path: file, clip: box })
    return
  }
  await page.screenshot({ path: file })
}

async function openShareTooltip(page) {
  const panel = page.locator('.panel.bay-butterfly-panel').first()
  await panel.waitFor({ state: 'visible' })
  const btn = panel.locator('button').filter({ hasText: '?' }).first()
  if (await btn.count()) {
    await btn.click()
    await page.waitForTimeout(500)
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: SCALE,
  })
  const page = await context.newPage()

  console.log('Capturing macro store map…')
  await goto(page, '/macrospace')
  await screenshotMain(page, path.join(OUT, 'macro-store-map.png'))

  console.log('Capturing macro map with bay selected…')
  await goto(page, '/macrospace')
  await clickCategoryChip(page, 'Pasta, Rice')
  if (!await openBayPanel(page, 1, 'Pasta, Rice')) {
    throw new Error('Could not select pasta bay on macro map')
  }
  await dismissPanel(page)
  await page.waitForTimeout(400)
  await screenshotMain(page, path.join(OUT, 'macro-store-map-bay-select.png'))

  console.log('Capturing share of store chart…')
  await goto(page, '/overview')
  await screenshotButterfly(page, path.join(OUT, 'share-of-store-chart.png'))

  console.log('Capturing share tooltip…')
  await goto(page, '/overview')
  await screenshotButterfly(page, path.join(OUT, 'share-of-store-tooltip.png'), true)

  console.log('Capturing subcategories table…')
  await goto(page, '/overview')
  const table = page.locator('table').first()
  await table.waitFor({ state: 'visible' })
  const tableTitle = page.locator('text=Subcategories at Ashfield').first()
  await tableTitle.scrollIntoViewIfNeeded()
  const tableBox = await table.boundingBox()
  const titleBox = await tableTitle.boundingBox()
  if (tableBox && titleBox) {
    await page.screenshot({
      path: path.join(OUT, 'subcategories-table.png'),
      clip: {
        x: Math.max(0, tableBox.x - 8),
        y: Math.max(0, titleBox.y - 12),
        width: tableBox.width + 16,
        height: Math.min(900, tableBox.y + tableBox.height - titleBox.y + 20),
      },
    })
  }

  console.log('Capturing bay comparison — canned food…')
  await goto(page, '/macrospace')
  await clickCategoryChip(page, 'Canned Food')
  if (!await openBayPanel(page, 1, 'Canned Food')) {
    throw new Error('Could not open canned food bay comparison')
  }
  await page.locator('.macrospace-bay-comparison').first()
    .screenshot({ path: path.join(OUT, 'bay-comparison-canned-overview.png') })

  console.log('Capturing bay comparison — products…')
  const panel = page.locator('.macrospace-bay-comparison').first()
  const productsHeading = panel.locator('text=Products').first()
  if (await productsHeading.count()) {
    await productsHeading.scrollIntoViewIfNeeded()
  } else {
    await panel.evaluate(el => { el.scrollTop = el.scrollHeight * 0.5 })
  }
  await page.waitForTimeout(400)
  await panel.screenshot({ path: path.join(OUT, 'bay-comparison-products.png') })

  console.log('Capturing bay comparison — pasta…')
  await goto(page, '/macrospace')
  await clickCategoryChip(page, 'Pasta, Rice')
  if (!await openBayPanel(page, 1, 'Pasta, Rice')) {
    throw new Error('Could not open pasta bay comparison')
  }
  await panel.screenshot({ path: path.join(OUT, 'bay-comparison-pasta.png') })

  console.log('Capturing category naming…')
  await goto(page, '/methods/subcategory-mapping')
  await screenshotMethodSection(
    page,
    'Why names differ between Coles and Woolworths',
    path.join(OUT, 'category-naming-tooltip.png'),
  )

  console.log('Capturing bay share methodology…')
  await goto(page, '/methods/bay-share')
  await screenshotMethodSection(
    page,
    'How much of the store',
    path.join(OUT, 'bay-share-methodology.png'),
  )

  console.log('Capturing category subcategory split…')
  await goto(page, '/overview/dept/Pantry%3A%3APasta%2C%20Rice%20%26%20Grains')
  await page.waitForTimeout(1200)
  const headToHead = page.locator('text=Head-to-head').first()
  await headToHead.scrollIntoViewIfNeeded()
  const splitClip = await page.evaluate(() => {
    const h = Array.from(document.querySelectorAll('h2,h3')).find(el => el.textContent?.includes('Head-to-head'))
    if (!h) return null
    const main = document.querySelector('main')
    const mainRect = main?.getBoundingClientRect()
    const startY = h.getBoundingClientRect().top - 8
    return {
      x: mainRect?.x ?? 248,
      y: startY,
      width: mainRect?.width ?? 1192,
      height: Math.min(720, (mainRect?.bottom ?? 1100) - startY),
    }
  })
  if (splitClip) {
    await page.screenshot({ path: path.join(OUT, 'category-subcategory-split.png'), clip: splitClip })
  }

  await browser.close()

  for (const f of fs.readdirSync(OUT).filter(n => n.endsWith('.png')).sort()) {
    const kb = Math.round(fs.statSync(path.join(OUT, f)).size / 1024)
    console.log(`  ${f} (${kb} KB)`)
  }
  console.log('Done.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
