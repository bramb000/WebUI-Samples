import { watch } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Maps route names to their Deadlock Hero theme token.
 * Add new case studies here as the portfolio grows.
 */
const ROUTE_THEME_MAP: Record<string, string> = {
  ProjectGuild:     'tinkerer',   // Furnace Amber  — Live-ops, data-driven systems
  ProjectRocksmith: 'alchemist',  // Spectral Teal  — Multi-platform engineering
  // ProjectPaperRPG: 'illusionist', // Arcane Purple — Creative / narrative work
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
    () => route.name,
    (routeName) => {
      const theme = ROUTE_THEME_MAP[routeName as string] ?? null;
      if (theme) {
        document.documentElement.setAttribute('data-theme', theme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    },
    { immediate: true }
  );
}
