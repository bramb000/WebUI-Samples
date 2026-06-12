/** One scroll segment for the hardcover before leaf turns begin. */
export function bookCoverScrollFraction(leafCount: number): number {
  return 1 / (leafCount + 1)
}

export function bookCoverScrollProgress(globalProgress: number, leafCount: number): number {
  const coverFraction = bookCoverScrollFraction(leafCount)
  if (globalProgress <= 0)
    return 0
  if (globalProgress >= coverFraction)
    return 1
  return globalProgress / coverFraction
}

/** 0–1 through leaf turns only (after cover segment). */
export function bookPageScrollProgress(globalProgress: number, leafCount: number): number {
  const coverFraction = bookCoverScrollFraction(leafCount)
  if (globalProgress <= coverFraction)
    return 0
  return (globalProgress - coverFraction) / (1 - coverFraction)
}

/** Highest discrete step index (cover closed = 0, fully read = max). */
export function bookMaxStep(leafCount: number): number {
  return leafCount + 1
}

/** Map a discrete step (0…max) to the global 0–1 progress used by the scene. */
export function bookStepToProgress(step: number, leafCount: number): number {
  const max = bookMaxStep(leafCount)
  const clamped = Math.max(0, Math.min(max, step))
  return clamped / max
}
