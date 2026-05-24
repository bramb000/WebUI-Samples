/** Probe WebGL availability without creating a visible canvas. */
export function canUseWebGL(): boolean {
  if (typeof document === 'undefined')
    return false

  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false })
      ?? canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false })
      ?? canvas.getContext('experimental-webgl' as 'webgl', { failIfMajorPerformanceCaveat: false })
    return gl != null
  }
  catch {
    return false
  }
}
