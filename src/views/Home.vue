<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import DetectiveHeroIntro from '../components/detective/DetectiveHeroIntro.vue'
import DetectiveBookStage from '../components/detective/DetectiveBookStage.vue'
import HeroBackgroundTexture from '../components/HeroBackgroundTexture.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import RosterCard from '../components/RosterCard.vue'
import { homeAchievementCardArt } from '../assets/images/home-achievement-cards/homeAchievementCardImages'
import { useRosterCardPaint } from '../composables/useRosterCardPaint'
import {
  ROSTER_DISCIPLINE_ACCENT,
  type RosterDiscipline,
} from '../constants/rosterDiscipline'
import type { RosterCardRoster } from '../components/RosterCard.vue'

/** Matches NavBar fixed height in App layout */
const NAV_OFFSET_PX = 72

type AchievementCard = {
  id: string
  title: string
  thumb: string
  thumbPoster?: string
  roster: RosterCardRoster
}

function achievementRoster(label: string, hue = 42): RosterCardRoster {
  return {
    points: '2,4 98,2 100,96 96,100 4,98 0,12',
    color1: `hsl(${hue}, 38%, 28%)`,
    color2: `hsl(${(hue + 24) % 360}, 36%, 14%)`,
    label,
  }
}

/** Must match `--home-achievement-float-duration` in scoped CSS */
const ACHIEVEMENT_FLOAT_DURATION_S = 5.2
const ACHIEVEMENT_JUMP_STAGGER_MS = 90
/**
 * Phase offset per card as a fraction of one float period (sine cycle).
 * 0.25 ≈ 90° between neighbors — one full ripple across four cards.
 * Lower = subtler, more in-sync; higher = wider spatial wave.
 */
const ACHIEVEMENT_FLOAT_PHASE_STEP = 0.2

function achievementCardMotionStyle(index: number) {
  const jumpStaggerMs = index * ACHIEVEMENT_JUMP_STAGGER_MS
  // Negative delay = start mid-cycle so cards sit at different points on the same sine path
  const floatPhaseS = -(index * ACHIEVEMENT_FLOAT_DURATION_S * ACHIEVEMENT_FLOAT_PHASE_STEP)
  return {
    '--home-card-stagger': `${jumpStaggerMs}ms`,
    '--home-card-float-phase': `${floatPhaseS}s`,
  }
}

const ACHIEVEMENT_DISCIPLINE: RosterDiscipline = 'product-design'

const achievementCards: AchievementCard[] = [
  {
    id: 'home-achievement-guild',
    title: 'Executed roadmaps to increase revenue by 20%+ for product with $5M+ annual revenue',
    ...homeAchievementCardArt('guild'),
    roster: achievementRoster('Guild'),
  },
  {
    id: 'home-achievement-ai',
    title: 'Using agentic AI and mix medium research methods to drive decision worth millions of dollars',
    ...homeAchievementCardArt('ai'),
    roster: achievementRoster('AI'),
  },
  {
    id: 'home-achievement-edtech',
    title: 'Shipped award-winning edtech products to millions of learners',
    ...homeAchievementCardArt('edtech'),
    roster: achievementRoster('EdTech'),
  },
  {
    id: 'home-achievement-global',
    title: 'Multicultural leader having managed teams in 5+ countries, timezones, and languages',
    ...homeAchievementCardArt('global'),
    roster: achievementRoster('Global'),
  },
]
const gridRef = ref<HTMLElement | null>(null)
const achievementsEntered = ref(false)

const {
  plateGrainBakes,
  rosterPaintMaskUrl,
  setThumbRef,
  observeGrid,
  scheduleRebake,
} = useRosterCardPaint()

onMounted(async () => {
  observeGrid(gridRef.value)
  scheduleRebake()
  await nextTick()
  requestAnimationFrame(() => {
    achievementsEntered.value = true
  })
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
        <DetectiveHeroIntro />
      </div>
    </section>

    <section
      class="home-achievements"
      aria-label="Achievements"
      :class="{ 'home-achievements--entered': achievementsEntered }"
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
              :hover-motion="false"
              :style="{
                '--roster-discipline-accent': ROSTER_DISCIPLINE_ACCENT[ACHIEVEMENT_DISCIPLINE],
              }"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="home-cta" aria-label="View work">
      <div class="home-page__container home-cta__inner">
        <PrimaryButton to="/work" variant="outline">
          View Case Studies
        </PrimaryButton>
      </div>
    </section>

    <DetectiveBookStage />
  </div>
</template>

<style scoped>
.home-page {
  --home-hero-min-height: calc(100vh - var(--home-nav-offset, 72px));
  --home-achievements-overlap: clamp(72px, 12vh, 140px);
  position: relative;
  width: 100%;
  overflow-x: clip;
}

.home-page__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
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

.home-hero-stage__content > :deep(.detective-hero-intro) {
  flex: 1 1 auto;
}

/* ── Achievements (overlap + motion) ── */
.home-achievements {
  --home-achievement-float-duration: 5.2s;
  /* Fraction of one float period between each card’s phase (0.25 = 90° / full ripple for 4 cards) */
  --home-achievement-wave-phase-step: 0.2;
  --home-achievement-float-amp: 8px;
  position: relative;
  z-index: 2;
  margin-top: calc(-1 * var(--home-achievements-overlap));
  padding-bottom: clamp(8px, 2vw, 24px);
  pointer-events: none;
}

/* Same shell inset as ProjectSelect .dl-shell + #roster-pane on mobile */

.home-achievements__grid {
  width: 100%;
  margin-inline: auto;
  pointer-events: auto;
  /* Work grid reserves scroll room; home strip does not */
  padding-bottom: clamp(8px, 1.5vw, 16px);
}

@media (min-width: 1025px) {
  .home-achievements__grid {
    /* 4-up strip — width of two roster panes so each cell ≈ one work-grid 1fr column */
    grid-template-columns: repeat(4, minmax(0, 1fr));
    width: min(
      100%,
      calc(
        2 * (var(--roster-work-grid-pane-width) - var(--roster-work-grid-pane-padding-inline))
        + var(--roster-work-grid-gap)
        + var(--roster-work-grid-container-padding-inline)
      )
    );
    max-width: 100%;
    padding: clamp(8px, 1.5vw, 16px);
  }
}

/* Stable grid cell hit target; enter + float run on __motion so bob doesn’t steal hover */
.home-achievement-card {
  position: relative;
  z-index: 1;
  min-width: 0;
  width: 100%;
  padding-block: var(--home-achievement-float-amp, 8px);
  margin-block: calc(-1 * var(--home-achievement-float-amp, 8px));
  box-sizing: content-box;
}

.home-achievement-card:hover {
  z-index: 80;
}

.home-achievement-card__motion {
  opacity: 0;
  transform: translateY(36px) scale(0.98);
  transform-origin: center bottom;
  will-change: transform, opacity;
}

.home-achievements--entered .home-achievement-card__motion {
  animation:
    home-achievement-jump 0.82s var(--ease-mechanical-spring) var(--home-card-stagger, 0ms) forwards,
    home-achievement-float var(--home-achievement-float-duration) linear
      calc(0.82s + var(--home-card-float-phase, 0s)) infinite;
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

/* Sine-like bob — phase offsets on each card turn this into a traveling wave */
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
  }
}

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

@media (max-width: 767px) {
  .home-hero-stage {
    min-height: auto;
  }

  .home-hero-stage__content {
    min-height: auto;
    align-items: stretch;
  }

  .home-achievements {
    margin-top: calc(-1 * clamp(32px, 8vw, 64px));
    padding-bottom: clamp(16px, 4vw, 28px);
    /* dl-shell 12px + roster-pane 8px — grid adds another 8px via .roster-card-grid */
    padding-inline: 20px;
  }

  .home-achievement-card {
    padding-block: 0;
    margin-block: 0;
  }

  /* Keep the entrance stagger on mobile; skip the infinite float loop (battery + small viewports). */
  .home-achievements--entered .home-achievement-card__motion {
    animation: home-achievement-jump 0.82s var(--ease-mechanical-spring) var(--home-card-stagger, 0ms) forwards;
  }
}
</style>
