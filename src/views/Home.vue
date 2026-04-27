<script setup lang="ts">
import { useRouter } from 'vue-router';

import rocksmithOutdoors from '../assets/images/rocksmith/research/007_rocksmith-outdoors.png';
import guildHero from '../assets/images/guild/guild-hero.jpg';

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
];

import posthog from 'posthog-js';

const router = useRouter();

const navigateTo = (path: string, projectId: string) => {
  posthog.capture('project_clicked', { project_id: projectId, source: 'home_page' });
  router.push(path);
};
</script>

<template>
  <div class="space-y-24">

    <!-- ── Hero ── -->
    <section class="hero-section pt-12 md:pt-20">
      <div class="hero-eyebrow">
        <span class="indicator-dot"></span>
        <span class="hero-eyebrow-text">Available for work</span>
      </div>
      <h1 class="hero-title">Hi, I'm<br>Bramha.</h1>
      <p class="hero-body">
        I sit at the intersection of
        <span class="hero-keyword">user experience</span>,
        <span class="hero-keyword">game design</span>, and
        <span class="hero-keyword">tech</span>
        to create fulfilling and delightful experiences that increase retention and revenue.
      </p>
      <!-- Hard rule below hero -->
      <div class="hero-rule"></div>
    </section>

    <!-- ── Selected Work ── -->
    <section id="selected-work" class="mb-24">
      <div class="section-header">
        <h2 class="section-title">Selected Work</h2>
        <span class="label-segment">Featured</span>
      </div>

      <div class="project-grid">
        <article
          v-for="project in caseStudies.slice(0, 3)"
          :key="project.id"
          @click="navigateTo(project.link, project.id)"
          class="project-card panel-recessed"
        >
          <!-- Thumbnail -->
          <div class="project-thumb">
            <img v-if="project.image" :src="project.image" :alt="project.title" class="project-img" />
            <!-- Hover overlay -->
            <div class="project-overlay">
              <span class="btn-extruded px-6 py-2.5 text-[11px]">View Case Study</span>
            </div>
          </div>

          <!-- Content -->
          <div class="project-content">
            <div class="project-tags">
              <span v-for="tag in project.tags" :key="tag" class="label-segment">{{ tag }}</span>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
          </div>
        </article>
      </div>

      <!-- More Work Link -->
      <div class="more-work-row">
        <router-link to="/work" class="btn-extruded more-work-btn">
          View more work &rarr;
        </router-link>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── Hero ── */
.hero-section {
  max-width: 900px;
}
.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.hero-eyebrow-text {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--color-text-muted);
}

/* H1 — Cinzel occult display heading */
.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(52px, 10vw, 96px);
  letter-spacing: 0.04em;
  line-height: 1.0;
  color: var(--color-text);
  margin: 0 0 24px 0;
  text-shadow: 0 0 40px rgba(197, 168, 114, 0.1);
}
.hero-body {
  font-family: var(--font-sans);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.8;
  max-width: 600px;
  margin: 0;
}
.hero-keyword {
  font-family: var(--font-sans);
  font-weight: 700;
  color: var(--color-accent);
  text-shadow: 0 0 10px var(--color-accent);
  font-style: normal;
}
.hero-rule {
  margin-top: 48px;
  border-top: 1px solid var(--color-border);
  opacity: 0.35;
  box-shadow: 0 0 8px rgba(197, 168, 114, 0.1);
}

/* ── Section Header ── */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 14px;
  margin-bottom: 40px;
}
.section-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(20px, 3.5vw, 28px);
  letter-spacing: 0.1em;
  color: var(--color-text);
  margin: 0;
}

/* ── Project Grid ── */
.project-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 768px) {
  .project-grid { grid-template-columns: 1fr 1fr; }
}

/* ── Project Card ── */
.project-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
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
  filter: brightness(0.6) saturate(0.8);
}
.project-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to top, rgba(17,17,19,0.9) 0%, rgba(17,17,19,0.4) 60%, transparent 100%);
  opacity: 0;
  transition: opacity 200ms var(--ease-te-slide);
}
.project-card:hover .project-overlay { opacity: 1; }

.project-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
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

/* ── More Work ── */
.more-work-row {
  display: flex;
  justify-content: center;
  padding-top: 40px;
}
.more-work-btn {
  padding: 11px 28px;
  font-size: 11px;
}
</style>
