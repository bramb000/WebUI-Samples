<script setup lang="ts">
import { ref, computed } from 'vue'
import { captureEvent } from '../analytics'
import PrimaryButton from '../components/PrimaryButton.vue'
import { rosterCardImage } from '../assets/images/roster-cards/rosterCardImages'

const featuredCaseStudies = [
  {
    id: 'guild',
    title: 'Guild of Guardians — Retention & revenue',
    description: 'Data-driven UX on a live mobile RPG: +25% D7 retention, +12% D7 LTV.',
    route: '/work/guild-of-guardians',
    image: rosterCardImage('guild'),
  },
  {
    id: 'rocksmith',
    title: 'Rocksmith+ — Multi-platform UX',
    description: 'One scalable UI system across five platforms for a music learning game.',
    route: '/work/rocksmith',
    image: rosterCardImage('rocksmith'),
  },
] as const

const activeFilter = ref('All')
const filters = ['All', 'Web Design', 'Game Design']

const HIDDEN_PROJECT_IDS = new Set(['sales-modal', 'node-graph'])

const projects = [
  {
    id: 'login',
    title: 'Login Micro-Interaction',
    description: 'A playful login screen featuring a Lottie animated avatar that tracks your input.',
    route: '/login-interaction-1',
    category: 'Web Design'
  },
  {
    id: 'helldivers',
    title: 'Making the UI come to life - Inspired by Helldivers 2',
    description: 'Bringing UI to life with responsive 2D component built with 3D assets. Inspired by Helldivers 2.',
    route: '/experiment/helldivers',
    category: 'Game Design'
  },
  {
    id: 'account-tray',
    title: 'Analogue UI Inspired Usage Dashboard',
    description: 'A brutalist usage dashboard inspired by analogue UIs. Features a serialised X-axis chip cascade, CSS digit-rolling odometers, and a snap-shut mechanical close.',
    route: '/work/account-tray',
    category: 'Web Design'
  },
  {
    id: 'sales-modal',
    title: 'Component-Driven Sales Modal',
    description: 'A beautifully responsive, isolated pricing modal highlighting dynamic, contextual data-driven banners.',
    route: '/work/sales-modal',
    category: 'Web Design'
  },
  {
    id: 'voice-chat',
    title: 'AI Voice Chat Simulation',
    description: 'Bringing your personal assistant to life in a concept that explores visual communication alongside conversations.',
    route: '/work/voice-chat',
    category: 'Web Design'
  },
  {
    id: 'cozy-corner',
    title: 'Cozy Corner, A Warm Third Space',
    description: 'Real-time chat, voice rooms, shared world, and layered sprite avatars in a tactile pixel UI.',
    route: '/work/cozy-corner',
    category: 'Web Design'
  },
  {
    id: 'node-graph',
    title: 'Node Graph Visual Scripting',
    description: 'Visual Scripting UI with Excel inspired help section.',
    route: '/node-graph',
    category: 'Web Design'
  },
  {
    id: 'project-select',
    title: 'Project Select Screen',
    description: 'A master-detail roster UI: dense thumbnail grid, neon active state, and angular wipe transitions.',
    route: '/work',
    category: 'Game Design'
  },
  {
    id: 'patapon',
    title: 'Designing rhythm-combat to feel fun',
    description: 'Breakdown of interaction and combat design of Patapon to recreate the entire core gameplay interaction system in Unity.',
    route: '/experiment/patapon',
    category: 'Game Design'
  },
  {
    id: 'jedi',
    title: 'Feel like a Jedi - combat design and interaction',
    description: 'Deconstruct interactions, analyse game feel and game juice to make my own interpretation on how it would feel to be a jedi in Unity.',
    route: '/experiment/jedi',
    category: 'Game Design'
  }
]

const filteredProjects = computed(() => {
  const visible = projects.filter((p) => !HIDDEN_PROJECT_IDS.has(p.id))
  if (activeFilter.value === 'All') return visible
  return visible.filter((p) => p.category === activeFilter.value)
})

const trackMicroProjectClick = (project: { id: string, category: string }) => {
  captureEvent('micro_project_clicked', { project_id: project.id, category: project.category })
}

const trackFeaturedCaseStudyClick = (id: string) => {
  captureEvent('case_study_clicked', { project_id: id, source: 'work_list_featured' })
}

</script>

<template>
  <div class="page-projects pt-12 pb-24 text-[var(--color-text)]">

    <!-- Page Header -->
    <div class="page-header mb-7">
      <h1 class="type-page-title text-sweep-reveal">Work</h1>
    </div>

    <section class="featured-case-studies mb-12" aria-labelledby="featured-case-studies-heading">
      <h2 id="featured-case-studies-heading" class="type-meta-label uppercase tracking-wider mb-5 text-muted">
        Featured case studies
      </h2>
      <div class="featured-case-studies__grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <router-link
          v-for="study in featuredCaseStudies"
          :key="study.id"
          :to="study.route"
          class="featured-case-study"
          @click="trackFeaturedCaseStudyClick(study.id)"
        >
          <img
            v-if="study.image"
            :src="study.image"
            :alt="`${study.title} thumbnail`"
            class="featured-case-study__thumb"
            loading="lazy"
            decoding="async"
          />
          <div class="featured-case-study__body">
            <h3 class="featured-case-study__title">{{ study.title }}</h3>
            <p class="featured-case-study__desc">{{ study.description }}</p>
            <span class="featured-case-study__cta">View case study →</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- Filter Strip -->
    <div class="filter-row mb-12">
      <div class="ui-filter-strip">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="['ui-filter-tab', activeFilter === filter ? 'active' : '']"
          :aria-pressed="activeFilter === filter"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Layered Sprite Architecture Project Tiles -->
    <div class="tile-grid grid grid-cols-1 md:grid-cols-2 gap-8">
      <router-link
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        :to="project.route"
        @click="trackMicroProjectClick(project)"
        class="roster-card"
        :style="{ 'animation-delay': `${index * 0.05}s` }"
      >
        <!-- Layer 1: The Void Background -->
        <div class="card-layer void-background"></div>

        <!-- Layer 2: The Jagged Frame -->
        <div class="card-layer roster-frame">
          <div class="roster-noise"></div>
        </div>

        <!-- Layer 3: The Hero Art (Frame Breaker) -->
        <div class="card-layer hero-art-layer">
          <!-- Stand-in for future transparent PNG characters -->
          <div class="roster-hero-art-placeholder"></div>
        </div>

        <!-- Layer 4: The Foreground UI -->
        <div class="card-layer foreground-ui">
          <div class="tile-category">
            <span class="tile-cat-label">{{ project.category }}</span>
          </div>

          <div class="tile-body">
            <h2 class="tile-title">{{ project.title }}</h2>
            <p class="tile-desc">{{ project.description }}</p>
          </div>

          <!-- CTA -->
          <div class="tile-cta">
            <PrimaryButton aria-hidden="true" tabindex="-1">View &rarr;</PrimaryButton>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.featured-case-study {
  display: flex;
  gap: 1rem;
  align-items: stretch;
  text-decoration: none;
  color: inherit;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.featured-case-study:hover {
  border-color: var(--color-accent);
  box-shadow: 0 0 20px color-mix(in srgb, var(--color-accent) 25%, transparent);
}

.featured-case-study__thumb {
  width: 7rem;
  height: 7rem;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.featured-case-study__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.featured-case-study__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-body);
  font-weight: 700;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
}

.featured-case-study__desc {
  margin: 0;
  font-size: var(--text-body-sm);
  color: var(--color-text-muted);
  line-height: var(--leading-snug);
}

.featured-case-study__cta {
  margin-top: auto;
  font-size: var(--text-body-sm);
  color: var(--color-accent);
}

.type-page-title {
  margin: 0;
  border-left: 8px solid var(--color-accent);
  padding-left: 14px;
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 30%, transparent);
  clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
}

/* ==========================================================================
   LAYERED SPRITE CARD ARCHITECTURE
   ========================================================================== */

.roster-card {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  position: relative;
  text-decoration: none;
  cursor: pointer;
  min-height: 280px;
  animation: dealCard 0.6s var(--ease-te-slide) both;
  transform-style: preserve-3d;
  transition: transform 150ms var(--ease-mechanical-spring);
}

.roster-card:hover {
  transform: translateY(-6px) scale(1.02);
}

.roster-card:active {
  transform: translateY(2px) scale(0.98) !important;
  transition: transform 50ms !important;
}

.card-layer {
  grid-area: 1 / 1;
  position: relative;
  width: 100%;
  height: 100%;
}

/* ── LAYER 1: Z-0 Void ── */
.void-background {
  z-index: 0;
  background: transparent;
  pointer-events: none;
}

/* ── LAYER 2: Z-10 Jagged Frame ── */
.roster-frame {
  z-index: 10;
  background: linear-gradient(135deg, var(--paper-surface-fill-deep) 0%, var(--paper-surface-fill) 100%);
  clip-path: polygon(
    4% 0%, 100% 0%, 
    100% 88%, 94% 100%, 
    0% 100%, 0% 12%
  );
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 2px var(--color-accent);
  transition: box-shadow 200ms ease;
  pointer-events: none;
}

.roster-card:hover .roster-frame {
  box-shadow: inset 0 0 0 4px var(--color-accent);
  filter: drop-shadow(0 0 15px color-mix(in srgb, var(--color-accent) 40%, transparent));
}

.roster-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.15;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* ── LAYER 3: Z-20 Hero Art (Frame Breaker) ── */
.hero-art-layer {
  z-index: 20;
  pointer-events: none; /* let clicks pass */
}

.roster-hero-art-placeholder {
  position: absolute;
  bottom: 0;
  right: -5%;
  width: 40%;
  height: 115%;
  background: linear-gradient(to top, var(--color-accent) 0%, transparent 80%);
  opacity: 0.1;
  transform-origin: bottom center;
  transition: opacity 300ms ease, transform 300ms ease;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
}

.roster-card:hover .roster-hero-art-placeholder {
  opacity: 0.3;
  transform: translateY(-10px) scale(1.05);
}

/* ── LAYER 4: Z-30 Foreground UI ── */
.foreground-ui {
  z-index: 30;
  display: flex;
  flex-direction: column;
  padding: 24px;
  pointer-events: none; /* let clicks pass to the card */
}

/* Aggressive, Chaotic Typography */
.tile-category {
  margin-bottom: 12px;
}

.tile-cat-label {
  font-family: var(--font-sans);
  font-size: var(--text-filter-tab);
  font-weight: 900;
  background: var(--color-accent);
  color: var(--color-bg);
  padding: 4px 10px;
  clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
  transform: rotate(-3deg);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: var(--tracking-button);
  box-shadow: 0 4px 10px color-mix(in srgb, var(--color-accent) 50%, transparent);
}

.tile-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tile-title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: var(--text-heading-accent);
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--color-text);
  margin: 0;
  text-shadow: 0 0 15px color-mix(in srgb, var(--color-accent) 40%, transparent);
  transition: color 200ms ease, text-shadow 200ms ease;
}

.roster-card:hover .tile-title {
  color: var(--color-text);
  text-shadow: 0 0 25px var(--color-accent);
}

.tile-desc {
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: 1.5;
  color: var(--color-text-muted);
  margin: 0;
  max-width: 85%;
}

.tile-cta {
  margin-top: 24px;
}

.roster-btn {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: var(--text-filter-tab);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: var(--tracking-label-md);
  background: color-mix(in srgb, var(--color-text) 8%, var(--color-surface));
  color: var(--color-accent);
  padding: 10px 20px;
  clip-path: polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%);
  border-left: 4px solid var(--color-accent);
  transition: all 200ms ease;
}

.roster-card:hover .roster-btn {
  background: color-mix(in srgb, var(--color-accent) 20%, transparent);
  color: var(--color-text);
}
</style>
