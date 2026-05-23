/** Scene units — shared by pages, covers, and spine. */
export const PAGE_WIDTH = 320
export const PAGE_HEIGHT = 480
export const LEAF_Z_STEP = 2
export const COVER_THICKNESS = 14
export const COVER_FORE_EDGE_OVERHANG = 18
export const COVER_VERTICAL_OVERHANG = 14
export const SPINE_WIDTH = COVER_THICKNESS

export const COVER_WIDTH = PAGE_WIDTH + COVER_FORE_EDGE_OVERHANG
export const COVER_HEIGHT = PAGE_HEIGHT + COVER_VERTICAL_OVERHANG

/** Leaf stack sits behind the front board while the cover is closed. */
export const LEAF_BEHIND_COVER_Z = -COVER_THICKNESS * 2.5

/** Fully turned pages tuck behind the back board to avoid clipping the front cover. */
export const LEFT_STACK_Z_BEHIND_BACK = COVER_THICKNESS * 2

export function bookStackDepth(leafCount: number): number {
  return Math.max(0, leafCount - 1) * LEAF_Z_STEP
}

/** Draw order tiers — pages must stay above BACK_COVER. */
export const BOOK_RENDER_ORDER = {
  SPINE: 0,
  BACK_COVER: 10,
  PAGE_BLOCK: 40,
  /** Minimum for any leaf (right stack, left stack, turning). */
  PAGE_MIN: 50,
  PAGE_TURNING: 200,
  /** Fully open front board (left) — below PAGE_MIN so pages paint on top. */
  FRONT_COVER_OPEN: 30,
  FRONT_COVER_CLOSED: 380,
} as const

export const COVER_FULLY_OPEN_THRESHOLD = 0.96
