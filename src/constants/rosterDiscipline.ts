/** Roster card discipline — drives name-plate colour coding. */
export type RosterDiscipline = 'product-design' | 'ui-design'

/** Product Design (case studies) */
export const ROSTER_DISCIPLINE_PRODUCT_DESIGN = '#524f81'

/**
 * UI Design — emerald green.
 * Source spec used `#0067F`; normalized to 6-digit hex for CSS/Three.js.
 */
export const ROSTER_DISCIPLINE_UI_DESIGN = '#00674f'

export const ROSTER_DISCIPLINE_ACCENT: Record<RosterDiscipline, string> = {
  'product-design': ROSTER_DISCIPLINE_PRODUCT_DESIGN,
  'ui-design': ROSTER_DISCIPLINE_UI_DESIGN,
}
