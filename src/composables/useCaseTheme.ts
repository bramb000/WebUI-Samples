import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { workPanelEmbeddedCaseStudyId } from './workPanelCaseTheme';

/**
 * Maps route names to their case-study theme token.
 * Add new case studies here as the portfolio grows.
 */
const ROUTE_THEME_MAP: Record<string, string> = {
  ProjectGuild:     'tinkerer',   // Furnace Amber  — Live-ops, data-driven systems
  ProjectRocksmith: 'alchemist',  // Spectral Teal  — Multi-platform engineering
  ProjectCozyCorner: 'illusionist', // Arcane Purple — Creative / pixel social app
  // ProjectPaperRPG: 'illusionist', // Arcane Purple — Creative / narrative work
};

/** Embedded roster pane on `/work` — same theme tokens as standalone case study routes. */
const EMBEDDED_CASE_STUDY_THEME_MAP: Record<string, string> = {
  guild: 'tinkerer',
  rocksmith: 'alchemist',
  'cozy-corner': 'illusionist',
};

/**
 * useCaseTheme
 * Sets data-theme on <html> when navigating into a case study,
 * removes it when returning to global pages.
 * Zero impact on routing logic, IDs, or event listeners.
 */
export function useCaseTheme() {
  const route = useRoute();

  watch(
    () => [route.name, workPanelEmbeddedCaseStudyId.value] as const,
    ([routeName, embedId]) => {
      const themeFromRoute = ROUTE_THEME_MAP[routeName as string] ?? null;
      const themeFromEmbed =
        embedId != null ? (EMBEDDED_CASE_STUDY_THEME_MAP[embedId] ?? null) : null;
      const theme = themeFromRoute ?? themeFromEmbed;
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    { immediate: true }
  );
}
