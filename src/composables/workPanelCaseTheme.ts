import { ref } from 'vue'

/**
 * When `/work` embeds a full case study in the roster detail pane, the route name
 * stays `Work`, so `useCaseTheme` reads this ref to apply the same tokens as the
 * dedicated `/work/guild-of-guardians` and `/work/rocksmith` pages.
 */
export const workPanelEmbeddedCaseStudyId = ref<'guild' | 'rocksmith' | 'cozy-corner' | null>(null)
