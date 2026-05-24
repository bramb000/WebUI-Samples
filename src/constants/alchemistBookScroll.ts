import { ALCHEMIST_BOOK_LEAVES } from './alchemistBookData'

/** One scroll segment for the hardcover before leaf turns begin. */
export const BOOK_COVER_SCROLL_FRACTION = 1 / (ALCHEMIST_BOOK_LEAVES.length + 1)

export function bookCoverScrollProgress(globalProgress: number): number {
  if (globalProgress <= 0)
    return 0
  if (globalProgress >= BOOK_COVER_SCROLL_FRACTION)
    return 1
  return globalProgress / BOOK_COVER_SCROLL_FRACTION
}

/** 0–1 through leaf turns only (after cover segment). */
export function bookPageScrollProgress(globalProgress: number): number {
  if (globalProgress <= BOOK_COVER_SCROLL_FRACTION)
    return 0
  return (globalProgress - BOOK_COVER_SCROLL_FRACTION) / (1 - BOOK_COVER_SCROLL_FRACTION)
}
