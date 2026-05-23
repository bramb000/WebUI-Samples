import type { BookImageKey } from '../../../constants/alchemistBookData'

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
  './*.{png,jpg,jpeg,webp}',
  { eager: false },
)

const cache = new Map<BookImageKey, HTMLImageElement>()
let preloadPromise: Promise<void> | null = null

const PLACEHOLDER: Record<BookImageKey, { a: string, b: string, label: string }> = {
  cover: { a: '#2a2838', b: '#4a3f5c', label: 'Cover art' },
  understand: { a: '#1e3a4a', b: '#3d6b7a', label: 'Understand' },
  analyze: { a: '#2e2a1a', b: '#5c4f2e', label: 'Analyze' },
  brew: { a: '#3a2218', b: '#6b4028', label: 'Brew' },
  deliver: { a: '#1a2e22', b: '#3d5c48', label: 'Deliver' },
  end: { a: '#1c1c21', b: '#3a3a44', label: 'End' },
}

function basenameFromGlobPath(path: string): string {
  const file = path.replace(/^\.\//, '')
  return file.replace(/\.[^.]+$/, '')
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

/** Preload assets in this folder + wait for book fonts. */
export function preloadBookPageImages(): Promise<void> {
  if (preloadPromise)
    return preloadPromise

  preloadPromise = (async () => {
    await document.fonts.ready

    const entries = Object.entries(imageModules) as [string, () => Promise<{ default: string }>][]
    await Promise.all(
      entries.map(async ([path, loader]) => {
        const base = basenameFromGlobPath(path)
        const key = BASENAME_TO_KEY[base]
        if (!key)
          return

        try {
          const mod = await loader()
          const img = await loadImage(mod.default)
          cache.set(key, img)
        }
        catch (err) {
          console.warn(`[book] Failed to load image for "${base}":`, err)
        }
      }),
    )
  })()

  return preloadPromise
}

/** Clear cache so remount picks up new files (e.g. after hot reload). */
export function clearBookPageImageCache() {
  cache.clear()
  preloadPromise = null
}

function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  key: BookImageKey,
  w: number,
  h: number,
) {
  const { a, b, label } = PLACEHOLDER[key]
  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, a)
  grad.addColorStop(1, b)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(235, 228, 214, 0.35)'
  ctx.font = '600 22px Barlow, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, w / 2, h / 2)
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
