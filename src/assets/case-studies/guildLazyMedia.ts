/** Below-fold / heavy Guild assets — loaded when scrolled near. */
export const guildLazyMedia = {
  chestLoop: () => import('../images/guild/tldr/021_fullchestloop-ezgif-com-video-to-gif-converter.webm'),
  chestFill: () => import('../images/guild/tldr/022_0112-ezgif-com-optimize.webm'),
  floatingBadge: () => import('../images/guild/tldr/024_floatingactionbutton-ezgif-com-optimize-2.webm'),
  exitScreenAnim: () => import('../images/guild/tldr/029_figma-e1njfafc8a.webm'),
  afkMockupFinal: () => import('../images/guild/tldr/019_afk-mockup-final.webp'),
  afkTutorial: () => import('../images/guild/tldr/023_afk-tutorial.webp'),
} as const
