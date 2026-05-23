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
 * Metallic gold stroke + recessed ink fill (embossed into parchment).
 */
export function drawEmbossedHeader(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  fontSizePx: number,
) {
  const goldShadow = bookVar('--book-gold-shadow', '#8B7347')
  const goldFill = bookVar('--book-gold-fill', '#C5A872')
  const goldHi = bookVar('--book-gold-highlight', '#D4BE94')
  const recess = bookVar('--book-header-recess-fill', '#1a1814')

  ctx.font = bookHeaderFont(fontSizePx)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.lineJoin = 'round'

  const depth = Math.max(2, fontSizePx * 0.045)
  const strokeMain = Math.max(2, fontSizePx * 0.07)
  const strokeHi = Math.max(1, fontSizePx * 0.035)

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

export function measureEmbossedHeader(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSizePx: number,
): TextMetrics {
  ctx.font = bookHeaderFont(fontSizePx)
  return ctx.measureText(text)
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

export function drawBodyLeft(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeightPx: number,
) {
  const ink = bookVar('--book-body-ink', '#1a1814')
  ctx.fillStyle = ink
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = bookBodyFont(bookBodySize())

  for (const row of breakBodyLines(ctx, text, maxWidth)) {
    ctx.fillText(row, x, y)
    y += lineHeightPx
  }
}
