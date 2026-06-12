import type { BookCoverPage, BookLeaf, BookPageLeft, TalesBookImageKey } from './alchemistBookData'

/** PDF page numbers used as story spreads (inclusive). */
export const TALES_STORY_PDF_PAGES = [7, 8, 9, 10, 11, 12, 13] as const

function taleImageKey(pdfPage: number): TalesBookImageKey {
  return `tale-${String(pdfPage).padStart(2, '0')}` as TalesBookImageKey
}

function talePage(pdfPage: number): BookPageLeft {
  return { layout: 'left', imageKey: taleImageKey(pdfPage) }
}

export const TALES_BOOK_COVER: BookCoverPage = {
  imageKey: 'tale-cover',
  fullBleed: true,
  header: 'Tales of Hedgehog and Fox',
}

export const TALES_BOOK_BACK: BookCoverPage = {
  imageKey: 'tale-back',
  fullBleed: true,
}

/**
 * Physical sheets: front + back of each leaf hold consecutive PDF pages.
 * Pages 7–13 → four leaves (7|8, 9|10, 11|12, 13|endpaper).
 */
export const TALES_BOOK_LEAVES: BookLeaf[] = [
  {
    front: talePage(7),
    back: talePage(8),
  },
  {
    front: talePage(9),
    back: talePage(10),
  },
  {
    front: talePage(11),
    back: talePage(12),
  },
  {
    front: talePage(13),
    back: { layout: 'empty' },
  },
]

export const TALES_BOOK_PRELOAD_PRIORITY: TalesBookImageKey[] = [
  'tale-cover',
  'tale-07',
  'tale-08',
]

export const ALL_TALES_BOOK_IMAGE_KEYS: TalesBookImageKey[] = [
  'tale-cover',
  'tale-back',
  ...TALES_STORY_PDF_PAGES.map((page) => taleImageKey(page)),
]
