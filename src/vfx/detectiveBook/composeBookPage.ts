import type { BookPageFace, BookPageLeft } from '../../constants/alchemistBookData'
import { drawMaskedFullBleedImage } from '../../assets/images/book/bookPageImages'
import {
  bookBodySize,
  bookSafeMargin,
  drawAttributionLeft,
  drawBodyLeft,
  drawEmbossedHeader,
  measureBodyBlockHeight,
} from './bookTypography'

const CANVAS_W = 512
const CANVAS_H = 768

function bookVarPx(name: string, fallback: number): number {
  if (typeof document === 'undefined')
    return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return Number.parseFloat(raw) || fallback
}

function drawEmptyPage(
  ctx: CanvasRenderingContext2D,
  parchment: HTMLCanvasElement,
) {
  ctx.drawImage(parchment, 0, 0, CANVAS_W, CANVAS_H)
}

function drawLeftPage(
  ctx: CanvasRenderingContext2D,
  page: BookPageLeft,
  parchment: HTMLCanvasElement,
) {
  ctx.drawImage(parchment, 0, 0, CANVAS_W, CANVAS_H)
  drawMaskedFullBleedImage(ctx, parchment, page.imageKey, CANVAS_W, CANVAS_H)
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
  const leading = bookVarPx('--book-body-leading', 1.55)
  const lineHeight = bodySize * leading

  const cx = CANVAS_W / 2
  const phaseNumber = page.number?.trim() ?? ''

  let bodyY: number
  if (phaseNumber) {
    const headerY = margin + numberSize * 0.55
    drawEmbossedHeader(ctx, phaseNumber, cx, headerY, numberSize, '--book-number-ink', '--book-number-ink-shadow')
    bodyY = headerY + numberSize * 0.45 + gap
  }
  else {
    bodyY = margin
  }

  drawBodyLeft(ctx, page.body, margin, bodyY, contentW, lineHeight)
  const bodyHeight = measureBodyBlockHeight(ctx, page.body, contentW, lineHeight)

  if (page.attribution?.trim()) {
    const attrGap = bookVarPx('--book-attribution-gap', 36)
    drawAttributionLeft(ctx, page.attribution.trim(), margin, bodyY + bodyHeight + attrGap, contentW)
  }
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

  if (page.layout === 'empty')
    drawEmptyPage(ctx, parchment)
  else if (page.layout === 'left')
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
