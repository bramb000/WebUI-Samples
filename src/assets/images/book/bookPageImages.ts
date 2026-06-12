import type { BookImageKey } from '../../../constants/alchemistBookData'
import {
  ALL_TALES_IMAGE_SRC_ENTRIES,
} from './talesBookPageImages'

export type { BookImageKey }

/** Basename (no extension) → book image key */
const BASENAME_TO_KEY: Record<string, BookImageKey> = {
  cover: 'cover',
  understand: 'understand',
  analyze: 'analyze',
  analyse: 'analyze',
  brew: 'brew',
  deliver: 'deliver',
  end: 'end',
}

const imageModules = import.meta.glob<{ default: string }>(
  ['./**/*.{png,jpg,jpeg,webp}', './*.{png,jpg,jpeg,webp}'],
  { eager: false },
)

const ALL_BOOK_IMAGE_KEYS: BookImageKey[] = [
  'cover',
  'understand',
  'analyze',
  'brew',
  'deliver',
  'end',
]

/** First spread — load before WebGL init; rest deferred via schedulePreloadRemainingBookPageImages */
export const BOOK_PRELOAD_PRIORITY: BookImageKey[] = ['cover', 'understand']

const cache = new Map<BookImageKey, HTMLImageElement>()
let remainingIdleScheduled = false

const PLACEHOLDER: Partial<Record<BookImageKey, { a: string, b: string }>> = {
  cover: { a: '#2a2838', b: '#4a3f5c' },
  understand: { a: '#1e3a4a', b: '#3d6b7a' },
  analyze: { a: '#2e2a1a', b: '#5c4f2e' },
  brew: { a: '#3a2218', b: '#6b4028' },
  deliver: { a: '#1a2e22', b: '#3d5c48' },
  end: { a: '#1c1c21', b: '#3a3a44' },
}

function basenameFromGlobPath(path: string): string {
  const file = path.replace(/^\.\//, '')
  const name = file.split('/').pop() ?? file
  return name.replace(/\.[^.]+$/, '')
}

function resolveBookImageKey(base: string): BookImageKey | undefined {
  const mapped = BASENAME_TO_KEY[base]
  if (mapped)
    return mapped
  if (base.startsWith('tale-'))
    return base as BookImageKey
  return undefined
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

const EXT_PRIORITY: Record<string, number> = {
  '.webp': 0,
  '.jpg': 1,
  '.jpeg': 1,
  '.png': 2,
}

/** Prefer WebP when both PNG and WebP exist after optimization. */
function pickBestLoaderPerKey(
  entries: [string, () => Promise<{ default: string }>][],
): Map<BookImageKey, () => Promise<{ default: string }>> {
  const byKey = new Map<BookImageKey, { path: string, loader: () => Promise<{ default: string }> }>()

  for (const [path, loader] of entries) {
    const base = basenameFromGlobPath(path)
    const key = resolveBookImageKey(base)
    if (!key)
      continue
    const ext = path.slice(path.lastIndexOf('.')).toLowerCase()
    const rank = EXT_PRIORITY[ext] ?? 9
    const prev = byKey.get(key)
    if (!prev || rank < (EXT_PRIORITY[prev.path.slice(prev.path.lastIndexOf('.')).toLowerCase()] ?? 9))
      byKey.set(key, { path, loader })
  }

  return new Map([...byKey.entries()].map(([k, v]) => [k, v.loader]))
}

async function loadKeys(keys: BookImageKey[]): Promise<void> {
  const want = new Set(keys)
  const entries = Object.entries(imageModules) as [string, () => Promise<{ default: string }>][]
  const loaders = pickBestLoaderPerKey(entries)

  await Promise.all(
    [...loaders.entries()].map(async ([key, loader]) => {
      if (!want.has(key) || cache.has(key))
        return

      try {
        const mod = await loader()
        const img = await loadImage(mod.default)
        cache.set(key, img)
      }
      catch (err) {
        console.warn(`[book] Failed to load image for "${key}":`, err)
      }
    }),
  )

  await Promise.all(
    ALL_TALES_IMAGE_SRC_ENTRIES.map(async ([key, src]) => {
      if (!want.has(key) || cache.has(key))
        return
      try {
        const img = await loadImage(src)
        cache.set(key, img)
      }
      catch (err) {
        console.warn(`[book] Failed to load tale image for "${key}":`, err)
      }
    }),
  )
}

/** Preload book images (+ fonts). Defaults to priority keys only when `keys` omitted. */
export function preloadBookPageImages(options?: { keys?: BookImageKey[] }): Promise<void> {
  const keys = options?.keys ?? BOOK_PRELOAD_PRIORITY
  const missing = keys.filter(k => !cache.has(k))
  if (missing.length === 0)
    return Promise.resolve()

  return (async () => {
    await document.fonts.ready
    await document.fonts.load('400 24px Caudex')
    await loadKeys(missing)
  })()
}

export function isBookImageCached(key: BookImageKey): boolean {
  const img = cache.get(key)
  return Boolean(img?.complete && img.naturalWidth > 0)
}

/** Idle-load remaining spreads after first paint. */
export function schedulePreloadRemainingBookPageImages(
  priority: BookImageKey[] = BOOK_PRELOAD_PRIORITY,
  allKeys?: BookImageKey[],
): void {
  if (remainingIdleScheduled)
    return
  remainingIdleScheduled = true

  const pool = allKeys ?? ALL_BOOK_IMAGE_KEYS
  const rest = pool.filter(k => !priority.includes(k))
  const run = () => {
    void preloadBookPageImages({ keys: rest })
  }

  if (typeof requestIdleCallback === 'function')
    requestIdleCallback(run, { timeout: 4000 })
  else
    setTimeout(run, 1500)
}

/** Clear cache so remount picks up new files (e.g. after hot reload). */
export function clearBookPageImageCache() {
  cache.clear()
  remainingIdleScheduled = false
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  key: BookImageKey,
  w: number,
  h: number,
) {
  const { a, b } = PLACEHOLDER[key] ?? { a: '#2a2838', b: '#4a3f5c' }
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, a)
  grad.addColorStop(1, b)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
}

/** object-fit: cover — full bleed before page mask */
function drawCoverFit(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  w: number,
  h: number,
) {
  const iw = 'width' in img ? img.width as number : w
  const ih = 'height' in img ? img.height as number : h
  const ir = iw / ih
  const cr = w / h
  let dw: number
  let dh: number
  let dx: number
  let dy: number
  if (ir > cr) {
    dh = h
    dw = h * ir
    dx = (w - dw) / 2
    dy = 0
  }
  else {
    dw = w
    dh = w / ir
    dx = 0
    dy = (h - dh) / 2
  }
  ctx.drawImage(img, dx, dy, dw, dh)
}

/** Full-bleed image for hardcover panels (no deckle mask). */
export function drawBookImageFullBleed(
  ctx: CanvasRenderingContext2D,
  key: BookImageKey,
  w: number,
  h: number,
) {
  const cached = cache.get(key)
  if (cached?.complete) {
    drawCoverFit(ctx, cached, w, h)
  }
  else {
    drawPlaceholder(ctx, key, w, h)
  }
}

/**
 * Full-bleed image clipped to deckled page shape (parchment alpha mask).
 */
export function drawMaskedFullBleedImage(
  ctx: CanvasRenderingContext2D,
  parchmentMask: HTMLCanvasElement,
  key: BookImageKey,
  w: number,
  h: number,
) {
  const cached = cache.get(key)
  if (cached?.complete) {
    drawCoverFit(ctx, cached, w, h)
  }
  else {
    drawPlaceholder(ctx, key, w, h)
  }

  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(parchmentMask, 0, 0, w, h)
  ctx.globalCompositeOperation = 'source-over'
}
