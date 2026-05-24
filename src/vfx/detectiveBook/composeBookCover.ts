import type { BookPageLeft } from '../../constants/alchemistBookData'
import { drawBookImageFullBleed } from '../../assets/images/book/bookPageImages'
import {
  bookSafeMargin,
  drawCenteredMutedText,
  drawEmbossedHeaderBlock,
} from './bookTypography'

const COVER_TEX_W = 512
const COVER_TEX_H = 768
const SPINE_TEX_W = 128
const SPINE_TEX_H = 768
const EDGE_TEX_W = 64
const EDGE_TEX_H = 64

function bookVarPx(name: string, fallback: number): number {
  if (typeof document === 'undefined')
    return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return Number.parseFloat(raw) || fallback
}

function bookVarColor(name: string, fallback: string): string {
  if (typeof document === 'undefined')
    return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

/** Procedural leather grain + edge vignette for baked cover faces. */
function drawLeatherBase(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  variant: 'exterior' | 'interior' | 'spine' | 'edge',
) {
  const base = bookVarColor('--book-cover-leather', '#2a1f18')
  const dark = bookVarColor('--book-cover-leather-dark', '#140e0a')
  const light = bookVarColor('--book-cover-leather-light', '#3d2e24')
  const interior = bookVarColor('--book-cover-interior', '#241a14')
  const edge = bookVarColor('--book-cover-edge', '#1a1410')

  const fill = variant === 'interior'
    ? interior
    : variant === 'edge'
      ? edge
      : base

  const grad = ctx.createLinearGradient(0, 0, w, h)
  if (variant === 'spine') {
    grad.addColorStop(0, dark)
    grad.addColorStop(0.45, fill)
    grad.addColorStop(1, light)
  }
  else if (variant === 'edge') {
    grad.addColorStop(0, dark)
    grad.addColorStop(0.5, fill)
    grad.addColorStop(1, dark)
  }
  else {
    grad.addColorStop(0, light)
    grad.addColorStop(0.55, fill)
    grad.addColorStop(1, dark)
  }
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  const rand = mulberry32(variant.length * 991 + w * 17 + h)
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  for (let i = 0; i < d.length; i += 4) {
    const n = (rand() - 0.5) * (variant === 'edge' ? 18 : 28)
    d[i] = Math.max(0, Math.min(255, d[i]! + n))
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1]! + n * 0.9))
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2]! + n * 0.75))
  }
  ctx.putImageData(imageData, 0, 0)

  if (variant !== 'edge') {
    const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.2, w * 0.5, h * 0.5, Math.max(w, h) * 0.72)
    vignette.addColorStop(0, 'rgba(0,0,0,0)')
    vignette.addColorStop(1, variant === 'interior' ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.22)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, w, h)
  }
}

function drawBeveledFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  inset: number,
) {
  const light = bookVarColor('--book-cover-leather-light', '#3d2e24')
  const dark = bookVarColor('--book-cover-leather-dark', '#140e0a')
  ctx.strokeStyle = light
  ctx.lineWidth = Math.max(2, inset * 0.08)
  ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2)
  ctx.strokeStyle = dark
  ctx.lineWidth = Math.max(1, inset * 0.05)
  ctx.strokeRect(inset + 3, inset + 3, w - inset * 2 - 6, h - inset * 2 - 6)
}

function createCanvas(w: number, h: number): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx)
    throw new Error('Could not create cover canvas')
  return { canvas, ctx }
}

/** Front board exterior — art panel + embossed title on leather. */
export function composeFrontCoverExteriorCanvas(page: BookPageLeft): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(COVER_TEX_W, COVER_TEX_H)
  drawLeatherBase(ctx, COVER_TEX_W, COVER_TEX_H, 'exterior')

  const inset = bookVarPx('--book-cover-panel-inset', 36)
  const panelW = COVER_TEX_W - inset * 2
  const panelH = COVER_TEX_H - inset * 2

  ctx.save()
  ctx.beginPath()
  ctx.rect(inset, inset, panelW, panelH)
  ctx.clip()
  drawBookImageFullBleed(ctx, page.imageKey, COVER_TEX_W, COVER_TEX_H)

  const scrim = bookVarColor('--book-cover-scrim', 'rgba(10, 8, 6, 0.42)')
  ctx.fillStyle = scrim
  ctx.fillRect(inset, inset, panelW, panelH)
  ctx.restore()

  drawBeveledFrame(ctx, COVER_TEX_W, COVER_TEX_H, inset * 0.55)

  const headerSize = bookVarPx('--book-header-size-cover', 52)
  const maxTextW = panelW - bookSafeMargin()
  const centerY = COVER_TEX_H / 2
  drawEmbossedHeaderBlock(
    ctx,
    page.header ?? '',
    COVER_TEX_W / 2,
    centerY,
    headerSize,
    maxTextW,
  )

  return canvas
}

export function composeCoverInteriorCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(COVER_TEX_W, COVER_TEX_H)
  drawLeatherBase(ctx, COVER_TEX_W, COVER_TEX_H, 'interior')
  drawBeveledFrame(ctx, COVER_TEX_W, COVER_TEX_H, 28)
  return canvas
}

export function composeBackCoverExteriorCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(COVER_TEX_W, COVER_TEX_H)
  drawLeatherBase(ctx, COVER_TEX_W, COVER_TEX_H, 'exterior')
  drawBeveledFrame(ctx, COVER_TEX_W, COVER_TEX_H, 40)

  const headerSize = bookVarPx('--book-header-size-end', 28)
  const maxTextW = COVER_TEX_W - bookSafeMargin() * 2
  drawEmbossedHeaderBlock(
    ctx,
    'Product Alchemist',
    COVER_TEX_W / 2,
    COVER_TEX_H * 0.62,
    headerSize,
    maxTextW,
  )

  return canvas
}

export function composeSpineCanvas(title: string, subtitle?: string): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(SPINE_TEX_W, SPINE_TEX_H)
  drawLeatherBase(ctx, SPINE_TEX_W, SPINE_TEX_H, 'spine')

  const headerSize = 22
  const maxAlongSpine = SPINE_TEX_H - bookSafeMargin() * 2
  ctx.save()
  ctx.translate(SPINE_TEX_W / 2, SPINE_TEX_H * 0.38)
  ctx.rotate(-Math.PI / 2)
  const headerBlockH = drawEmbossedHeaderBlock(ctx, title, 0, 0, headerSize, maxAlongSpine)
  if (subtitle) {
    const subSize = 14
    const inkMuted = bookVarColor('--book-body-muted', '#5c564c')
    const subY = headerBlockH / 2 + headerSize * 0.5
    drawCenteredMutedText(ctx, subtitle, 0, subY, subSize, maxAlongSpine, inkMuted)
  }
  ctx.restore()

  return canvas
}

export function composePageEdgeCanvas(): HTMLCanvasElement {
  const { canvas, ctx } = createCanvas(EDGE_TEX_W, EDGE_TEX_H)
  drawLeatherBase(ctx, EDGE_TEX_W, EDGE_TEX_H, 'edge')
  return canvas
}
