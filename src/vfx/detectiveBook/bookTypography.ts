function bookVar(name: string, fallback: string): string {
  if (typeof document === 'undefined')
    return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export function bookHeaderFont(sizePx: number): string {
  const family = bookVar('--book-font-header', 'Cinzel, serif')
  return `700 ${sizePx}px ${family}`
}

export function bookBodyFont(sizePx: number): string {
  const family = bookVar('--book-font-body', 'Caudex, Georgia, serif')
  return `400 ${sizePx}px ${family}`
}

export function bookNumberSize(): number {
  const raw = bookVar('--book-number-size', '56px')
  return Number.parseFloat(raw) || 56
}

export function bookBodySize(): number {
  const raw = bookVar('--book-body-size', '24px')
  return Number.parseFloat(raw) || 24
}

export function bookSafeMargin(): number {
  const raw = bookVar('--book-safe-margin', '48px')
  return Number.parseFloat(raw) || 48
}

/**
 * Manuscript header — ink fill on parchment (stroke-scale 0) or legacy gilt rim.
 */
export function drawEmbossedHeader(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
  fillVar = '--book-header-fill',
  shadowVar = '--book-header-shadow-ink',
) {
  const strokeScale = Number.parseFloat(bookVar('--book-header-stroke-scale', '0')) || 0

  ctx.font = bookHeaderFont(fontSizePx)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'

  if (strokeScale <= 0) {
    const fill = bookVar(fillVar, bookVar('--book-header-fill', '#1a1410'))
    const shadow = bookVar(shadowVar, bookVar('--book-header-shadow-ink', 'rgba(26, 20, 16, 0.28)'))
    const shadowOffset = Math.max(1, fontSizePx * 0.022)

    ctx.fillStyle = shadow
    ctx.fillText(text, centerX + shadowOffset, centerY + shadowOffset)

    ctx.fillStyle = fill
    ctx.fillText(text, centerX, centerY)
    return
  }

  const goldShadow = bookVar('--book-gold-shadow', '#8B7347')
  const goldFill = bookVar('--book-gold-fill', '#C5A872')
  const goldHi = bookVar('--book-gold-highlight', '#D4BE94')
  const recess = bookVar('--book-header-recess-fill', '#1a1814')

  const depth = Math.max(2, fontSizePx * 0.045) * strokeScale
  const strokeMain = Math.max(2, fontSizePx * 0.07) * strokeScale
  const strokeHi = Math.max(1, fontSizePx * 0.035) * strokeScale

  ctx.strokeStyle = goldShadow
  ctx.lineWidth = strokeMain + 1
  ctx.strokeText(text, centerX + depth, centerY + depth)

  ctx.strokeStyle = goldFill
  ctx.lineWidth = strokeMain
  ctx.strokeText(text, centerX, centerY)

  ctx.strokeStyle = goldHi
  ctx.lineWidth = strokeHi
  ctx.strokeText(text, centerX - depth * 0.5, centerY - depth * 0.5)

  ctx.fillStyle = recess
  ctx.fillText(text, centerX, centerY + 1)
}

/** Light lettering on dark leather — halo + drop shadow for grainy boards. */
export function drawCoverEmbossedHeader(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
) {
  const fill = bookVar('--book-cover-header-fill', '#ede4d4')
  const shadow = bookVar('--book-cover-header-shadow-ink', 'rgba(6, 4, 2, 0.72)')
  const halo = bookVar('--book-cover-header-halo', 'rgba(6, 4, 2, 0.55)')
  const shadowOffset = Math.max(1.5, fontSizePx * 0.028)
  const haloWidth = Math.max(1.5, fontSizePx * 0.05)

  ctx.font = bookHeaderFont(fontSizePx)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'

  ctx.strokeStyle = halo
  ctx.lineWidth = haloWidth
  ctx.strokeText(text, centerX, centerY)

  ctx.fillStyle = shadow
  ctx.fillText(text, centerX + shadowOffset, centerY + shadowOffset)

  ctx.fillStyle = fill
  ctx.fillText(text, centerX, centerY)
}

export function measureEmbossedHeader(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSizePx: number,
): TextMetrics {
  ctx.font = bookHeaderFont(fontSizePx)
  return ctx.measureText(text)
}

/** Word-wrap for embossed headers (cover, spine, phase titles). */
export function breakHeaderLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSizePx: number,
): string[] {
  ctx.font = bookHeaderFont(fontSizePx)
  const paragraphs = text.split('\n').map(p => p.trim()).filter(Boolean)
  if (paragraphs.length === 0)
    return []

  const lines: string[] = []
  for (const paragraph of paragraphs) {
    lines.push(...breakBodyLines(ctx, paragraph, maxWidth))
  }
  return lines
}

export function embossedHeaderBlockHeight(
  lineCount: number,
  fontSizePx: number,
  lineGapRatio = 1.35,
): number {
  if (lineCount <= 1)
    return 0
  return (lineCount - 1) * fontSizePx * lineGapRatio
}

/** Centred cover title block on leather boards. */
export function drawCoverEmbossedHeaderBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
  maxWidth: number,
  lineGapRatio = 1.35,
): number {
  const lines = breakHeaderLines(ctx, text, maxWidth, fontSizePx)
  if (lines.length === 0)
    return 0

  const lineGap = fontSizePx * lineGapRatio
  const blockH = embossedHeaderBlockHeight(lines.length, fontSizePx, lineGapRatio)
  let y = centerY - blockH / 2
  for (const line of lines) {
    drawCoverEmbossedHeader(ctx, line, centerX, y, fontSizePx)
    y += lineGap
  }
  return blockH
}

/** Centred embossed title block; returns vertical span of the block in px. */
export function drawEmbossedHeaderBlock(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
  maxWidth: number,
  lineGapRatio = 1.35,
): number {
  const lines = breakHeaderLines(ctx, text, maxWidth, fontSizePx)
  if (lines.length === 0)
    return 0

  const lineGap = fontSizePx * lineGapRatio
  const blockH = embossedHeaderBlockHeight(lines.length, fontSizePx, lineGapRatio)
  let y = centerY - blockH / 2
  for (const line of lines) {
    drawEmbossedHeader(ctx, line, centerX, y, fontSizePx)
    y += lineGap
  }
  return blockH
}

export function drawCenteredMutedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
  maxWidth: number,
  fill: string,
  lineGapRatio = 1.4,
) {
  const font = bookHeaderFont(fontSizePx).replace('700', '600')
  ctx.font = font
  ctx.fillStyle = fill
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = breakHeaderLines(ctx, text, maxWidth, fontSizePx)
  const lineGap = fontSizePx * lineGapRatio
  const blockH = embossedHeaderBlockHeight(lines.length, fontSizePx, lineGapRatio)
  let y = centerY - blockH / 2
  for (const line of lines) {
    ctx.fillText(line, centerX, y)
    y += lineGap
  }
}

export function breakBodyLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (let n = 0; n < words.length; n++) {
    const test = `${line}${words[n]} `
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      lines.push(line.trimEnd())
      line = `${words[n]} `
    }
    else {
      line = test
    }
  }
  if (line.trim().length > 0)
    lines.push(line.trimEnd())
  return lines
}

export function measureBodyBlockHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeightPx: number,
  fontSizePx = bookBodySize(),
): number {
  ctx.font = bookBodyFont(fontSizePx)
  const lineCount = breakBodyLines(ctx, text, maxWidth).length
  return lineCount * lineHeightPx
}

export function drawBodyLeft(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightPx: number,
  fontSizePx = bookBodySize(),
) {
  const ink = bookVar('--book-body-ink', '#1a1814')
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = bookBodyFont(fontSizePx)

  for (const row of breakBodyLines(ctx, text, maxWidth)) {
    ctx.fillText(row, x, y)
    y += lineHeightPx
  }
}

/** Testimonial attribution — name then role below the quote body */
export function drawAttributionLeft(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  const ink = bookVar('--book-body-ink', '#1a1814')
  const muted = bookVar('--book-body-muted', '#5c564c')
  const size = Number.parseFloat(bookVar('--book-attribution-size', '20px')) || 20
  const leading = Number.parseFloat(bookVar('--book-attribution-leading', '1.45')) || 1.45
  const lineHeight = size * leading
  const lines = text.split('\n').map(part => part.trim()).filter(Boolean)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!
    ctx.font = i === 0 ? bookHeaderFont(size * 0.95) : bookBodyFont(size)
    ctx.fillStyle = i === 0 ? ink : muted
    for (const row of breakBodyLines(ctx, line, maxWidth)) {
      ctx.fillText(row, x, y)
      y += lineHeight
    }
  }
}
