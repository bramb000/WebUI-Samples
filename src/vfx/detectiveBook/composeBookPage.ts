import type { BookPageFace, BookPageLeft } from '../../constants/alchemistBookData'
import { drawMaskedFullBleedImage } from '../../assets/images/book/bookPageImages'
import {
  bookBodySize,
  bookHeaderFont,
  bookSafeMargin,
  drawBodyLeft,
  drawEmbossedHeader,
} from './bookTypography'

const CANVAS_W = 512
const CANVAS_H = 768

function bookVarPx(name: string, fallback: number): number {
  if (typeof document === 'undefined')
    return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return Number.parseFloat(raw) || fallback
}

function drawLeftPage(
  ctx: CanvasRenderingContext2D,
  page: BookPageLeft,
  parchment: HTMLCanvasElement,
) {
  drawMaskedFullBleedImage(ctx, parchment, page.imageKey, CANVAS_W, CANVAS_H)

  const cx = CANVAS_W / 2
  const cy = CANVAS_H / 2

  const headerSize = page.imageKey === 'cover'
    ? bookVarPx('--book-header-size-cover', 52)
    : page.imageKey === 'end'
      ? bookVarPx('--book-header-size-end', 28)
      : bookVarPx('--book-header-size-phase', 46)

  if (page.imageKey === 'end' && page.header.includes('\n')) {
    const lines = page.header.split('\n')
    const lineGap = headerSize * 1.35
    const blockH = (lines.length - 1) * lineGap
    let y = cy - blockH / 2
    for (const line of lines) {
      drawEmbossedHeader(ctx, line.trim(), cx, y, headerSize)
      y += lineGap
    }
  }
  else if (page.header.length > 28 && page.imageKey === 'end') {
    const words = page.header.split(' ')
    const mid = Math.ceil(words.length / 2)
    const l1 = words.slice(0, mid).join(' ')
    const l2 = words.slice(mid).join(' ')
    const gap = headerSize * 1.35
    drawEmbossedHeader(ctx, l1, cx, cy - gap / 2, headerSize)
    drawEmbossedHeader(ctx, l2, cx, cy + gap / 2, headerSize)
  }
  else {
    drawEmbossedHeader(ctx, page.header, cx, cy, headerSize)
  }

  if (page.subtitle) {
    const subSize = bookVarPx('--book-subtitle-size', 20)
    const inkMuted = getComputedStyle(document.documentElement)
      .getPropertyValue('--book-body-muted').trim() || '#5c564c'
    ctx.font = bookHeaderFont(subSize).replace('700', '600')
    ctx.fillStyle = inkMuted
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(page.subtitle, cx, cy + headerSize * 0.85)
  }
}

function drawRightPage(
  ctx: CanvasRenderingContext2D,
  page: Extract<BookPageFace, { layout: 'right' }>,
  parchment: HTMLCanvasElement,
) {
  ctx.drawImage(parchment, 0, 0, CANVAS_W, CANVAS_H)

  const margin = bookSafeMargin()
  const contentW = CANVAS_W - margin * 2
  const numberSize = bookVarPx('--book-number-size', 56)
  const bodySize = bookBodySize()
  const gap = bookVarPx('--book-header-body-gap', 48)
  const lineHeight = bodySize * bookVarPx('--book-body-leading', 1.55) / bookVarPx('--book-body-size', 24)

  const cx = CANVAS_W / 2
  const headerY = margin + numberSize * 0.55
  drawEmbossedHeader(ctx, page.number, cx, headerY, numberSize)

  const bodyY = headerY + numberSize * 0.45 + gap
  drawBodyLeft(ctx, page.body, margin, bodyY, contentW, lineHeight)
}

export function composeBookPageCanvas(
  page: BookPageFace,
  parchment: HTMLCanvasElement,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')
  if (!ctx)
    throw new Error('Could not compose book page')

  if (page.layout === 'left')
    drawLeftPage(ctx, page, parchment)
  else
    drawRightPage(ctx, page, parchment)

  return canvas
}

/** Mirror composed page for back faces (reference book binding). */
export function mirrorCanvasHorizontal(source: HTMLCanvasElement): HTMLCanvasElement {
  const out = document.createElement('canvas')
  out.width = source.width
  out.height = source.height
  const ctx = out.getContext('2d')!
  ctx.translate(out.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(source, 0, 0)
  return out
}
