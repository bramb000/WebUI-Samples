/** Insight / metric card themes — hex values used for CSS tokens and WebGL rim bakes. */
export const CASE_INSIGHT_THEME = {
  before: {
    accent: '#ffc9c9',
    surface: '#b84e55',
  },
  after: {
    accent: '#b8ffd0',
    surface: '#3dba6a',
  },
} as const

export type CaseInsightThemeKey = keyof typeof CASE_INSIGHT_THEME
