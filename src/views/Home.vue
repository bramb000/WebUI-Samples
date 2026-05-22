<script setup lang="ts">
import { useRouter } from 'vue-router';

import rocksmithOutdoors from '../assets/images/rocksmith/research/007_rocksmith-outdoors.png';
import guildHero from '../assets/images/guild/guild-hero.jpg';
import PrimaryButton from '../components/PrimaryButton.vue';

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

import { captureEvent } from '../analytics';

const router = useRouter();

const navigateTo = (path: string, projectId: string) => {
  captureEvent('project_clicked', { project_id: projectId, source: 'home_page' });
  router.push(path);
};
</script>

<template>
  <div class="space-y-24">
    <!-- ── Hero ── -->
    <section class="hero-section pt-12 md:pt-20 max-w-4xl">
      <h1 class="type-display-hero mb-6">Hi, I'm<br>Bramha.</h1>
      <p class="type-body-lg">
        I sit at the intersection of
        <span class="hero-keyword">user experience</span>,
        <span class="hero-keyword">game design</span>, and
        <span class="hero-keyword">tech</span>
        to create fulfilling and delightful experiences that increase retention and revenue.
      </p>
      <!-- Hard rule below hero -->
      <div class="hero-rule mt-12"></div>
    </section>

    <!-- ── Selected Work ── -->
    <section id="selected-work" class="mb-24">
      <div class="section-header flex justify-between items-baseline border-b border-[var(--color-border)] pb-3.5 mb-10">
        <h2 class="type-section-title">Selected Work</h2>
        <span class="label-segment">Featured</span>
      </div>

      <div class="project-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="(project, index) in caseStudies.slice(0, 3)"
          :key="project.id"
          @click="navigateTo(project.link, project.id)"
          class="project-card panel-recessed"
        >
          <!-- Thumbnail -->
          <div class="project-thumb">
            <img
              v-if="project.image"
              :src="project.image"
              :alt="project.title"
              class="project-img"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : 'auto'"
              decoding="async"
            />
            <!-- Hover overlay -->
            <div class="project-overlay">
              <PrimaryButton class="px-6 py-2.5 text-[11px]" aria-hidden="true" tabindex="-1">View Case Study</PrimaryButton>
            </div>
          </div>

          <!-- Content -->
          <div class="project-content p-5 flex flex-col gap-2.5 flex-1">
            <div class="project-tags flex flex-wrap gap-1.5">
              <span v-for="tag in project.tags" :key="tag" class="label-segment">{{ tag }}</span>
            </div>
            <h3 class="type-card-title">{{ project.title }}</h3>
            <p class="type-body">{{ project.description }}</p>
          </div>
        </article>
      </div>

      <!-- More Work Link -->
      <div class="more-work-row flex justify-center pt-10">
        <PrimaryButton to="/work" class="more-work-btn">View more work &rarr;</PrimaryButton>
      </div>
    </section>

  </div>
</template>

<style scoped>
.type-display-hero {
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 10%, transparent);
}
.hero-section .type-body-lg {
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
  border-top: 1px solid var(--color-border);
  opacity: 0.35;
  box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.type-section-title {
  margin: 0;
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

.type-card-title {
  margin: 0;
  transition: color 150ms ease, text-shadow 150ms ease;
}
.project-card:hover .type-card-title {
  color: var(--color-border-hi);
  text-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 30%, transparent);
}
.type-body {
  margin: 0;
}

/* ── More Work ── */
.more-work-btn {
  padding: 11px 28px;
  font-size: var(--text-filter-tab);
}
</style>
