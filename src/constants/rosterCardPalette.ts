/** SVG gradient stops for roster cards — reads parchment tokens from :root. */
export function rosterCardPaletteFromTokens(): { color1: string; color2: string } {
  const fallback = { color1: '#ebe4d6', color2: '#e0d8c8' }
  if (typeof document === 'undefined')
    return fallback

  const style = getComputedStyle(document.documentElement)
  const color1 = style.getPropertyValue('--paper-surface-fill').trim()
  const color2 = style.getPropertyValue('--paper-surface-fill-deep').trim()
  return {
    color1: color1 || fallback.color1,
    color2: color2 || fallback.color2,
  }
}
