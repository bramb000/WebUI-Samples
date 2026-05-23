/**
 * Resolves `var(--token)`, `color-mix(...)`, etc. to `#rrggbb` for WebGL bakes (`THREE.Color`).
 */
function parseRgbTriplet(
  rRaw: string,
  gRaw: string,
  bRaw: string,
): [number, number, number] | null {
  const r = Number(rRaw)
  const g = Number(gRaw)
  const b = Number(bRaw)
  if (![r, g, b].every((c) => Number.isFinite(c)))
    return null
  const scale = Math.max(r, g, b) <= 1 ? 255 : 1
  return [r * scale, g * scale, b * scale]
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((c) => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0'))
    .join('')}`
}

export function resolveCssColorToHex(
  el: HTMLElement,
  cssColor: string,
  fallback = '#45f0d1',
): string {
  const t = cssColor.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(t) || /^#[0-9a-fA-F]{3}$/.test(t))
    return t

  const probe = document.createElement('span')
  probe.style.cssText = `position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;color:${cssColor}`
  el.appendChild(probe)
  const computed = getComputedStyle(probe).color
  el.removeChild(probe)

  const rgbMatch = computed.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/,
  )
  if (rgbMatch) {
    const triplet = parseRgbTriplet(rgbMatch[1], rgbMatch[2], rgbMatch[3])
    if (triplet)
      return toHex(...triplet)
  }

  const srgbMatch = computed.match(
    /color\(\s*srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/,
  )
  if (srgbMatch) {
    const triplet = parseRgbTriplet(srgbMatch[1], srgbMatch[2], srgbMatch[3])
    if (triplet)
      return toHex(...triplet)
  }

  return fallback
}
