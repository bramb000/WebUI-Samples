<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import rocksmithOutdoors from '../assets/images/rocksmith/research/007_rocksmith-outdoors.png'
import guildHero from '../assets/images/guild/guild-hero.jpg'

const activeFilter = ref('All')
const filters = ['All', 'Mobile Game', 'PC Game', 'Console Game']

const caseStudies = [
  {
    id: 'guild',
    title: 'Guild of Guardians',
    description: 'Increasing D7 retention by 25% and Revenue by 12% through data driven product design',
    tags: ['Mobile Game', 'UX Research', 'Data Analysis'],
    image: guildHero,
    link: '/work/guild-of-guardians'
  },
  {
    id: 'rocksmith',
    title: 'Rocksmith+',
    description: 'Releasing to 1 million new users on 5 Platforms with 1 UI system',
    tags: ['PC Game', 'Console Game', 'Accessibility'],
    image: rocksmithOutdoors,
    link: '/work/rocksmith'
  }
]

import posthog from 'posthog-js';

const router = useRouter()

const navigateTo = (path: string, projectId: string) => {
  posthog.capture('project_clicked', { project_id: projectId, source: 'work_page' });
  router.push(path)
}

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return caseStudies
  return caseStudies.filter(p => p.tags.includes(activeFilter.value))
})
</script>

<template>
  <div class="page-work pt-12 pb-24 text-[var(--color-text)]">

    <!-- Page Header -->
    <div class="page-header flex justify-between items-baseline border-b border-[var(--color-border)] pb-3.5 mb-7">
      <h1 class="page-title text-sweep-reveal">Work</h1>
      <span class="label-segment">Case Studies</span>
    </div>

    <!-- Filter Strip -->
    <div class="filter-row mb-10">
      <div class="deadlock-filter-strip">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="['deadlock-filter-tab', activeFilter === filter ? 'active' : '']"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <!-- Project Grid -->
    <div class="project-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <article
        v-for="project in filteredProjects"
        :key="project.id"
        @click="navigateTo(project.link, project.id)"
        class="project-card deadlock-card-container"
      >
        <!-- Thumbnail -->
        <div class="project-thumb">
          <img v-if="project.image" :src="project.image" :alt="project.title" class="project-img deadlock-hero-art" />
          <div class="project-overlay">
            <span class="deadlock-action-btn px-6 py-2.5"><span>View Case Study</span></span>
          </div>
        </div>

        <!-- Content -->
        <div class="project-content p-5 flex flex-col gap-2.5">
          <div class="project-tags flex flex-wrap gap-1.5">
            <span v-for="tag in project.tags" :key="tag" class="label-segment">{{ tag }}</span>
          </div>
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-desc">{{ project.description }}</p>
        </div>
      </article>
    </div>

    <!-- More Link -->
    <div class="more-row flex justify-center pt-10">
      <router-link to="/micro-projects" class="deadlock-action-btn more-btn">
        <span>View micro-projects &rarr;</span>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
/* H1 — Cinzel display */
.page-title {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(48px, 10vw, 84px);
  letter-spacing: -0.02em;
  color: var(--color-text);
  margin: 0;
  border-left: 8px solid var(--color-accent);
  padding-left: 16px;
  text-shadow: 0 0 40px rgba(197, 168, 114, 0.3);
  line-height: 0.9;
}

.project-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  animation: dealCard 0.6s var(--ease-te-slide) both;
  transition:
    box-shadow 220ms var(--ease-mechanical-spring),
    transform  220ms var(--ease-mechanical-spring),
    border-color 220ms ease;
}
.project-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-border-hi) !important;
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.6),
    0 16px 40px rgba(0, 0, 0, 0.7),
    var(--dl-glow-global);
}

/* Staggered deal animation */
.project-card:nth-child(1) { animation-delay: 0.05s; }
.project-card:nth-child(2) { animation-delay: 0.10s; }
.project-card:nth-child(3) { animation-delay: 0.15s; }
.project-card:nth-child(4) { animation-delay: 0.20s; }
.project-card:nth-child(5) { animation-delay: 0.25s; }
.project-card:nth-child(6) { animation-delay: 0.30s; }
.project-card:nth-child(7) { animation-delay: 0.35s; }
.project-card:nth-child(8) { animation-delay: 0.40s; }
.project-card:nth-child(9) { animation-delay: 0.45s; }
.project-card:nth-child(10) { animation-delay: 0.50s; }
.project-card:nth-child(11) { animation-delay: 0.55s; }
.project-card:nth-child(12) { animation-delay: 0.60s; }

.project-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  border-radius: 2px 2px 0 0;
  background: var(--color-elevated);
}
.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 400ms ease, filter 400ms ease;
}
.project-card:hover .project-img {
  transform: scale(1.04);
  filter: brightness(0.55) saturate(0.8);
}
.project-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(17,17,19,0.92) 0%, rgba(17,17,19,0.4) 60%, transparent 100%);
  opacity: 0;
  transition: opacity 200ms var(--ease-te-slide);
}
.project-card:hover .project-overlay { opacity: 1; }

.project-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 17px;
  letter-spacing: 0.06em;
  color: var(--color-text);
  margin: 0;
  line-height: 1.3;
  transition: color 150ms ease;
}
.project-card:hover .project-title {
  color: var(--color-border-hi);
  text-shadow: 0 0 12px rgba(197, 168, 114, 0.3);
}
.project-desc {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.6;
  color: var(--color-text-muted);
  margin: 0;
  opacity: 0.85;
}

.more-btn { padding: 11px 28px; font-size: 11px; }
</style>
