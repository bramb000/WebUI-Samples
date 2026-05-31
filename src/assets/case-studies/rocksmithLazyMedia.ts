/** Below-fold / heavy Rocksmith assets — loaded when scrolled near. */
export const rocksmithLazyMedia = {
  comparisonOther: () => import('../images/rocksmith/solution/019_other-games-ui-overlap.webp'),
  comparisonRocksmith: () => import('../images/rocksmith/solution/020_rocksmith-no-ui-overlap.webp'),
  responsiveUi: () => import('../images/rocksmith/solution/021_rocksmith-responsive-ui-gif.webm'),
  threeDto2dDiagram: () => import('../images/rocksmith/solution/018_3d-to-2d-diagram.webp'),
  pcInteractions: () => import('../images/rocksmith/solution/029_pc-carousel-interactions.webm'),
  mobileInteractions: () => import('../images/rocksmith/solution/030_r-mobile-interactions.webm'),
  skillsScroll: () => import('../images/rocksmith/solution/034_skills-horizontal-scroll.webm'),
  vertScroll: () => import('../images/rocksmith/solution/036_r-vertical-scroll.webm'),
  vertScrollNonUniform: () => import('../images/rocksmith/solution/037_r-vert-scroll-non-uniform.webm'),
  outdoorsContext: () => import('../images/rocksmith/research/007_rocksmith-outdoors.webp'),
  userContext: () => import('../images/rocksmith/research/006_rocksmith-user-context.webp'),
} as const
