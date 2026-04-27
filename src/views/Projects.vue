<script setup lang="ts">
import { ref, computed } from 'vue'
import posthog from 'posthog-js'

const activeFilter = ref('All')
const filters = ['All', 'Web Design', 'Game Design']

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
    route: '/micro-projects/account-tray',
    category: 'Web Design'
  },
  {
    id: 'sales-modal',
    title: 'Component-Driven Sales Modal',
    description: 'A beautifully responsive, isolated pricing modal highlighting dynamic, contextual data-driven banners.',
    route: '/micro-projects/sales-modal',
    category: 'Web Design'
  },
  {
    id: 'voice-chat',
    title: 'AI Voice Chat Simulation',
    description: 'Bringing your personal assistant to life in a concept that explores visual communication alongside conversations.',
    route: '/micro-projects/voice-chat',
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
  if (activeFilter.value === 'All') return projects
  return projects.filter(p => p.category === activeFilter.value)
})

const trackMicroProjectClick = (project: any) => {
  posthog.capture('micro_project_clicked', { project_id: project.id, category: project.category })
}

const getThemeColor = (category: string) => {
  if (category === 'Game Design') return '#B873D3'; // Arcane Purple
  if (category === 'Web Design') return '#45F0D1'; // Spectral Green
  return '#8B7347'; // Default Occult Gold
}
</script>

<template>
  <div class="page-projects">

    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title text-sweep-reveal">Micro-projects</h1>
    </div>

    <!-- Filter Strip -->
    <div class="filter-row">
      <div class="deadlock-filter-strip">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="['deadlock-filter-tab', activeFilter === filter ? 'active' : '']"
        >
          <span>{{ filter }}</span>
        </button>
      </div>
    </div>

    <!-- Layered Sprite Architecture Project Tiles -->
    <div class="tile-grid">
      <router-link
        v-for="(project, index) in filteredProjects"
        :key="project.id"
        :to="project.route"
        @click="trackMicroProjectClick(project)"
        class="deadlock-roster-card"
        :style="{ '--theme-color': getThemeColor(project.category), 'animation-delay': `${index * 0.05}s` }"
      >
        <!-- Layer 1: The Void Background -->
        <div class="card-layer void-background"></div>

        <!-- Layer 2: The Jagged Frame -->
        <div class="card-layer deadlock-frame">
          <div class="deadlock-noise"></div>
        </div>

        <!-- Layer 3: The Hero Art (Frame Breaker) -->
        <div class="card-layer hero-art-layer">
          <!-- Stand-in for future transparent PNG characters -->
          <div class="deadlock-hero-art-placeholder"></div>
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
            <span class="deadlock-action-btn"><span>Initiate &rarr;</span></span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page-projects {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 48px;
  padding-bottom: 96px;
  color: var(--color-text);
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(48px, 10vw, 84px);
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 0;
  border-left: 8px solid var(--color-accent);
  padding-left: 14px;
  text-shadow: 0 0 40px rgba(197, 168, 114, 0.3);
  clip-path: polygon(0 0, 100% 0, 95% 100%, 0 100%);
  line-height: 0.9;
}

.filter-row { margin-bottom: 48px; }

/* ── Tile Grid ── */
.tile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 768px) {
  .tile-grid { grid-template-columns: 1fr 1fr; }
}

/* ==========================================================================
   LAYERED SPRITE CARD ARCHITECTURE
   ========================================================================== */

.deadlock-roster-card {
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

.deadlock-roster-card:hover {
  transform: translateY(-6px) scale(1.02);
}

.deadlock-roster-card:active {
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
.deadlock-frame {
  z-index: 10;
  background: linear-gradient(135deg, #1A1A1D 0%, #0D0D0F 100%);
  clip-path: polygon(
    4% 0%, 100% 0%, 
    100% 88%, 94% 100%, 
    0% 100%, 0% 12%
  );
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 0 2px var(--theme-color);
  transition: box-shadow 200ms ease;
  pointer-events: none;
}

.deadlock-roster-card:hover .deadlock-frame {
  box-shadow: inset 0 0 0 4px var(--theme-color);
  filter: drop-shadow(0 0 15px color-mix(in srgb, var(--theme-color) 40%, transparent));
}

.deadlock-noise {
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

.deadlock-hero-art-placeholder {
  position: absolute;
  bottom: 0;
  right: -5%;
  width: 40%;
  height: 115%;
  background: linear-gradient(to top, var(--theme-color) 0%, transparent 80%);
  opacity: 0.1;
  transform-origin: bottom center;
  transition: opacity 300ms ease, transform 300ms ease;
  mask-image: linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
  -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%);
}

.deadlock-roster-card:hover .deadlock-hero-art-placeholder {
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
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 900;
  background: var(--theme-color);
  color: #000;
  padding: 4px 10px;
  clip-path: polygon(8% 0, 100% 0, 92% 100%, 0 100%);
  transform: rotate(-3deg);
  display: inline-block;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 10px color-mix(in srgb, var(--theme-color) 50%, transparent);
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
  font-size: 28px;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--color-text);
  margin: 0;
  text-shadow: 0 0 15px color-mix(in srgb, var(--theme-color) 40%, transparent);
  transition: color 200ms ease, text-shadow 200ms ease;
}

.deadlock-roster-card:hover .tile-title {
  color: #FFF;
  text-shadow: 0 0 25px var(--theme-color);
}

.tile-desc {
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  max-width: 85%;
}

.tile-cta {
  margin-top: 24px;
}

.deadlock-btn {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: rgba(0, 0, 0, 0.5);
  color: var(--theme-color);
  padding: 10px 20px;
  clip-path: polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%);
  border-left: 4px solid var(--theme-color);
  transition: all 200ms ease;
}

.deadlock-roster-card:hover .deadlock-btn {
  background: color-mix(in srgb, var(--theme-color) 20%, transparent);
  color: #FFF;
}
</style>
