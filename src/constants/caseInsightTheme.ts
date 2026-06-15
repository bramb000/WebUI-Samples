/** Insight / metric card themes — hex values used for CSS tokens and WebGL rim bakes. */
export const CASE_INSIGHT_THEME = {
  before: {
    accent: '#ffc9c9',
    surface: '#c4565e',
  },
  after: {
    accent: '#b8ffd0',
    surface: '#3dba6a',
  },
  /** Parchment cream — matches `--paper-surface-fill` / hero video backgrounds */
  cream: {
    accent: '#d8cfbe',
    surface: '#ebe4d6',
  },
} as const

export type CaseInsightThemeKey = keyof typeof CASE_INSIGHT_THEME
