/**
 * Resolves `var(--token)`, `color-mix(...)`, etc. to `#rrggbb` for WebGL bakes (`THREE.Color`).
 */
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
  const rgb = getComputedStyle(probe).color
  el.removeChild(probe)
  const m = rgb.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/)
  if (!m)
    return fallback
  const r = Math.round(Number(m[1]))
  const g = Math.round(Number(m[2]))
  const b = Math.round(Number(m[3]))
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}
