<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import IntroHero from '../components/IntroHero.vue'
import TestimonialsLettersStage from '../components/testimonials/TestimonialsLettersStage.vue'
import HeroBackgroundTexture from '../components/HeroBackgroundTexture.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import HomeWorkCard from '../components/HomeWorkCard.vue'
import { homeWorkCards } from '../constants/homeWorkCards'
// Achievements — restore when needed
// import RosterCard from '../components/RosterCard.vue'
// import { homeAchievementCardArt } from '../assets/images/home-achievement-cards/homeAchievementCardImages'
// import { useRosterCardPaint } from '../composables/useRosterCardPaint'
// import { rosterCardPaletteFromTokens } from '../constants/rosterCardPalette'
// import type { RosterDiscipline } from '../constants/rosterDiscipline'
// import type { RosterCardRoster } from '../components/RosterCard.vue'

/** Matches NavBar fixed height in App layout */
const NAV_OFFSET_PX = 72

const workCardsEntered = ref(false)

// ── Achievements (commented out for later) ──────────────────────────────────
// type AchievementCard = {
//   id: string
//   title: string
//   thumb: string
//   thumbPoster?: string
//   roster: RosterCardRoster
// }
//
// function achievementRoster(label: string): RosterCardRoster {
//   const { color1, color2 } = rosterCardPaletteFromTokens()
//   return {
//     points: '2,4 98,2 100,96 96,100 4,98 0,12',
//     color1,
//     color2,
//     label,
//   }
// }
//
// /** Must match `--home-achievement-float-duration` in scoped CSS */
// const ACHIEVEMENT_FLOAT_DURATION_S = 5.2
// const ACHIEVEMENT_JUMP_STAGGER_MS = 90
// const ACHIEVEMENT_FLOAT_PHASE_STEP = 0.2
//
// function achievementCardMotionStyle(index: number) {
//   const jumpStaggerMs = index * ACHIEVEMENT_JUMP_STAGGER_MS
//   const floatPhaseS = -(index * ACHIEVEMENT_FLOAT_DURATION_S * ACHIEVEMENT_FLOAT_PHASE_STEP)
//   return {
//     '--home-card-stagger': `${jumpStaggerMs}ms`,
//     '--home-card-float-phase': `${floatPhaseS}s`,
//   }
// }
//
// const ACHIEVEMENT_DISCIPLINE: RosterDiscipline = 'product-design'
//
// const achievementCards: AchievementCard[] = [
//   {
//     id: 'home-achievement-guild',
//     title: 'Executed roadmaps to increase revenue by 20%+ for product with $5M+ annual revenue',
//     ...homeAchievementCardArt('guild'),
//     roster: achievementRoster('Guild'),
//   },
//   {
//     id: 'home-achievement-ai',
//     title: 'Using agentic AI and mix medium research methods to drive decision worth millions of dollars',
//     ...homeAchievementCardArt('ai'),
//     roster: achievementRoster('AI'),
//   },
//   {
//     id: 'home-achievement-global',
//     title: 'Managed teams in 5+ countries, timezone, and languages to ship globally successful products',
//     ...homeAchievementCardArt('global'),
//     roster: achievementRoster('Global'),
//   },
// ]
// const gridRef = ref<HTMLElement | null>(null)
// const achievementsEntered = ref(false)
// const achievementsAnimate = ref(true)
// let rafId = 0
//
// function updateAchievementsMotion() {
//   achievementsAnimate.value = (window.scrollY || 0) <= 1
// }
//
// function onScroll() {
//   if (rafId)
//     return
//   rafId = requestAnimationFrame(() => {
//     rafId = 0
//     updateAchievementsMotion()
//   })
// }
//
// const {
//   plateGrainBakes,
//   rosterPaintMaskUrl,
//   setThumbRef,
//   observeGrid,
//   scheduleRebake,
// } = useRosterCardPaint()

onMounted(async () => {
  // observeGrid(gridRef.value)
  // scheduleRebake()
  await nextTick()
  requestAnimationFrame(() => {
    workCardsEntered.value = true
    // achievementsEntered.value = true
  })

  // updateAchievementsMotion()
  // window.addEventListener('scroll', onScroll, { passive: true })
  // window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  // window.removeEventListener('scroll', onScroll)
  // window.removeEventListener('resize', onScroll)
  // if (rafId)
  //   cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="home-page">
    <section
      class="home-hero-stage"
      :style="{ '--home-nav-offset': `${NAV_OFFSET_PX}px` }"
      aria-label="Introduction"
    >
      <HeroBackgroundTexture class="home-hero-stage__texture" />
      <div class="home-page__container home-hero-stage__content">
        <IntroHero />
      </div>
    </section>

    <section
      class="home-work"
      aria-label="Featured work"
      :class="{ 'home-work--entered': workCardsEntered }"
    >
      <div class="home-page__container home-work__inner">
        <HomeWorkCard
          v-for="(card, index) in homeWorkCards"
          :key="card.id"
          class="home-work__card"
          :class="{ 'home-work__card--entered': workCardsEntered }"
          :style="{ '--home-work-card-stagger': `${index * 120}ms` }"
          :year="card.year"
          :company="card.company"
          :title="card.title"
          :description="card.description"
          :to="card.to"
          :poster="card.poster"
          :video="card.video"
          :visual-placeholder="card.visualPlaceholder"
          :transparent-visual="card.transparentVisual"
        />
      </div>
    </section>

    <!-- Achievements — restore when needed
    <section
      class="home-achievements"
      aria-label="Achievements"
      :class="{
        'home-achievements--entered': achievementsEntered,
        'home-achievements--animate': achievementsAnimate,
      }"
    >
      <div
        ref="gridRef"
        class="home-achievements__grid roster-card-grid"
        :style="{ '--roster-paint-mask': `url(${rosterPaintMaskUrl})` }"
      >
        <div
          v-for="(card, index) in achievementCards"
          :key="card.id"
          class="home-achievement-card"
        >
          <div
            class="home-achievement-card__motion"
            :style="achievementCardMotionStyle(index)"
          >
            <RosterCard
              :ref="(el) => setThumbRef(card.id, el)"
              :id="card.id"
              :discipline="ACHIEVEMENT_DISCIPLINE"
              :title="card.title"
              :thumb="card.thumb"
              :thumb-poster="card.thumbPoster"
              :roster="card.roster"
              :plate-grain="plateGrainBakes[card.id]"
              variant="case-study"
              plate-typography="achievement"
              show-media
              :hover-motion="false"
            />
          </div>
        </div>
      </div>
    </section>
    -->

    <section class="home-cta" aria-label="View work">
      <div class="home-page__container home-cta__inner">
        <PrimaryButton to="/work" variant="outline">
          View Case Studies
        </PrimaryButton>
      </div>
    </section>

    <TestimonialsLettersStage />
  </div>
</template>

<style scoped>
.home-page {
  --home-hero-min-height: calc(100vh - var(--home-nav-offset, 72px));
  --home-work-overlap: clamp(72px, 12vh, 140px);
  --home-padding-inline: clamp(var(--grid-3), 4vw, 3rem);
  position: relative;
  width: 100%;
  overflow-x: clip;
}

.home-page__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: var(--home-padding-inline);
  box-sizing: border-box;
}

/* ── Hero ── */
.home-hero-stage {
  --hero-bg-grain-overlay-strength: 0.18;
  --hero-bg-grain-opacity: 0.16;
  --hero-bg-halftone-opacity: 0.02;
  position: relative;
  z-index: 0;
  width: 100%;
  min-height: var(--home-hero-min-height);
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.home-hero-stage__texture {
  position: absolute;
  inset: 0;
}

.home-hero-stage__content {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  display: flex;
  align-items: stretch;
  min-height: var(--home-hero-min-height);
  padding-block: 0;
  box-sizing: border-box;
}

.home-hero-stage__content > :deep(.intro-hero) {
  flex: 1 1 auto;
}

/* ── Work cards (overlap hero like achievements) ── */
.home-work {
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--home-work-overlap));
  padding-bottom: clamp(8px, 2vw, 24px);
}

.home-work__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(var(--grid-3), 3vw, var(--grid-4));
}

.home-work__card {
  opacity: 0;
  transform: translateY(28px);
  transition:
    opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1) var(--home-work-card-stagger, 0ms),
    transform 0.82s var(--ease-mechanical-spring) var(--home-work-card-stagger, 0ms);
}

.home-work--entered .home-work__card--entered {
  opacity: 1;
  transform: translateY(0);
}

/* >16:9 — keep hero + testimonials in a centered reading column (avoids empty ultrawide sweep) */
@media (min-aspect-ratio: 16/9) {
  .home-page__container {
    max-width: min(80rem, 72vw);
  }
}

/* ── Achievements (commented out for later) ────────────────────────────────
.home-achievements {
  --home-achievement-float-duration: 5.2s;
  --home-achievement-wave-phase-step: 0.2;
  --home-achievement-float-amp: 8px;
  --home-achievement-card-width: var(--home-achievement-card-width-mobile);
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--home-achievements-overlap));
  padding-bottom: clamp(8px, 2vw, 24px);
  pointer-events: none;
}

.home-achievements__grid {
  width: min(
    100%,
    calc(2 * var(--home-achievement-card-width) + var(--home-achievement-grid-gap))
  );
  margin-inline: auto;
  pointer-events: auto;
  grid-template-columns: repeat(2, var(--home-achievement-card-width));
  justify-content: center;
  gap: var(--home-achievement-grid-gap);
  padding-bottom: clamp(8px, 1.5vw, 16px);
}

.home-achievement-card :deep(.thumbnail) {
  width: var(--home-achievement-card-width);
  max-width: 100%;
  margin-inline: auto;
}

@media (min-width: 1025px) {
  .home-achievements {
    --home-achievement-card-width: 232px;
  }

  .home-achievements__grid {
    grid-template-columns: repeat(3, var(--home-achievement-card-width));
    width: min(
      100%,
      calc(
        3 * var(--home-achievement-card-width)
        + 2 * var(--home-achievement-grid-gap)
        + var(--grid-4)
      )
    );
    max-width: 100%;
    padding: clamp(8px, 1.5vw, 16px);
  }
}

.home-achievement-card {
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
  padding-block: var(--home-achievement-float-amp, 8px);
  margin-block: calc(-1 * var(--home-achievement-float-amp, 8px));
  box-sizing: content-box;
  pointer-events: none;
}

.home-achievement-card :deep(.thumbnail),
.home-achievement-card :deep(.thumbnail .inner-card) {
  animation: none !important;
  transform: none !important;
  transition: none;
  filter: none;
  cursor: default;
}

.home-achievement-card :deep(.thumbnail .inner-card) {
  box-shadow: none;
}

.home-achievement-card :deep(.thumbnail .inner-card::before),
.home-achievement-card :deep(.thumbnail .inner-card::after) {
  display: none;
  transition: none;
}

.home-achievement-card :deep(.thumbnail-content) {
  justify-content: center;
}

.home-achievement-card :deep(.thumbnail-label) {
  margin-block: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
}

.home-achievement-card__motion {
  opacity: 0;
  transform: translateY(36px) scale(0.98);
  transform-origin: center bottom;
  will-change: transform, opacity;
}

.home-achievements--entered.home-achievements--animate .home-achievement-card__motion {
  transition: none;
  animation:
    home-achievement-jump 0.82s var(--ease-mechanical-spring) var(--home-card-stagger, 0ms) forwards,
    home-achievement-float var(--home-achievement-float-duration) linear
      calc(0.82s + var(--home-card-float-phase, 0s)) infinite;
}

.home-achievements--entered:not(.home-achievements--animate) .home-achievement-card__motion {
  opacity: 1;
  transform: translateY(0) scale(1);
  animation: none !important;
  transition:
    transform 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.48s ease-out;
}

@keyframes home-achievement-jump {
  0% {
    opacity: 0;
    transform: translateY(36px) scale(0.98);
  }
  70% {
    opacity: 1;
    transform: translateY(-10px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes home-achievement-float {
  0% {
    transform: translateY(0) scale(1);
  }
  12.5% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.383)) scale(1);
  }
  25% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.707)) scale(1);
  }
  37.5% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.924)) scale(1);
  }
  50% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px))) scale(1);
  }
  62.5% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.924)) scale(1);
  }
  75% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.707)) scale(1);
  }
  87.5% {
    transform: translateY(calc(-1 * var(--home-achievement-float-amp, 8px) * 0.383)) scale(1);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-achievement-card__motion {
    opacity: 1;
    transform: none;
    animation: none !important;
    transition: none !important;
  }
}
──────────────────────────────────────────────────────────────────────────── */

/* ── CTA ── */
.home-cta {
  position: relative;
  z-index: 1;
  padding-block: clamp(28px, 5vw, 48px);
}

.home-cta__inner {
  display: flex;
  justify-content: center;
}

@media (prefers-reduced-motion: reduce) {
  .home-work__card {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

@media (max-width: 767px) {
  .home-page {
    --home-padding-inline: var(--grid-3);
    --home-work-overlap: 0;
  }

  .home-hero-stage {
    min-height: auto;
  }

  .home-hero-stage__content {
    min-height: auto;
    align-items: stretch;
    padding-block: var(--grid-4) var(--grid-6);
  }

  .home-work {
    margin-top: 0;
    padding-top: var(--grid-5);
    padding-bottom: var(--grid-3);
  }

  .home-cta {
    padding-block: var(--grid-4) var(--grid-3);
  }

  .home-cta__inner {
    padding-inline: var(--home-padding-inline);
  }

  /* Achievements mobile — restore with achievements section
  .home-achievements {
    margin-top: 0;
    padding-top: var(--grid-5);
    padding-inline: 0;
    padding-bottom: var(--grid-3);
  }

  .home-achievements__grid {
    gap: var(--home-achievement-grid-gap);
    padding-inline: var(--home-padding-inline);
    padding-bottom: var(--grid-3);
  }

  .home-achievement-card {
    padding-block: 0;
    margin-block: 0;
  }

  .home-achievements--entered.home-achievements--animate .home-achievement-card__motion {
    animation: home-achievement-jump 0.82s var(--ease-mechanical-spring) var(--home-card-stagger, 0ms) forwards;
  }
  */
}
</style>
