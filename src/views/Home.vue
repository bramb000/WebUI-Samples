<script setup lang="ts">
import { useRouter } from 'vue-router'

import rocksmithOutdoors from '../assets/images/rocksmith/research/007_rocksmith-outdoors.png'
import guildHero from '../assets/images/guild/guild-hero.jpg'
import PrimaryButton from '../components/PrimaryButton.vue'
import DetectiveBookStage from '../components/detective/DetectiveBookStage.vue'
import DetectiveHeroIntro from '../components/detective/DetectiveHeroIntro.vue'
import { captureEvent } from '../analytics'

const caseStudies = [
  {
    id: 'guild',
    title: 'Guild of Guardians',
    description: 'Increasing D7 retention by 25% and Revenue by 12% through data driven product design',
    tags: ['Mobile Game', 'UX Research', 'Data Analysis'],
    image: guildHero,
    link: '/work/guild-of-guardians',
  },
  {
    id: 'rocksmith',
    title: 'Rocksmith+',
    description: 'Releasing to 1 million new users on 5 Platforms with 1 UI system',
    tags: ['PC Game', 'Console Game', 'Accessibility'],
    image: rocksmithOutdoors,
    link: '/work/rocksmith',
  },
]

const router = useRouter()

function navigateTo(path: string, projectId: string) {
  captureEvent('project_clicked', { project_id: projectId, source: 'home_page' })
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <div class="home-page__container">
      <DetectiveHeroIntro />
    </div>

    <DetectiveBookStage />

    <div class="home-page__container home-page__work space-y-24 pb-24">
      <section id="selected-work" class="mb-24">
        <div class="section-header flex justify-between items-baseline border-b border-[var(--color-border)] pb-3.5 mb-10">
          <h2 class="type-section-title">Selected Work</h2>
          <span class="label-segment">Featured</span>
        </div>

        <div class="project-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="(project, index) in caseStudies.slice(0, 3)"
            :key="project.id"
            class="project-card panel-recessed"
            @click="navigateTo(project.link, project.id)"
          >
            <div class="project-thumb">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="project-img"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
                decoding="async"
              >
              <div class="project-overlay">
                <PrimaryButton class="px-6 py-2.5 text-[11px]" aria-hidden="true" tabindex="-1">
                  View Case Study
                </PrimaryButton>
              </div>
            </div>

            <div class="project-content p-5 flex flex-col gap-2.5 flex-1">
              <div class="project-tags flex flex-wrap gap-1.5">
                <span v-for="tag in project.tags" :key="tag" class="label-segment">{{ tag }}</span>
              </div>
              <h3 class="type-card-title">{{ project.title }}</h3>
              <p class="type-body">{{ project.description }}</p>
            </div>
          </article>
        </div>

        <div class="more-work-row flex justify-center pt-10">
          <PrimaryButton to="/work" class="more-work-btn">View more work &rarr;</PrimaryButton>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
}

.home-page__work {
  padding-top: 0;
}

.type-section-title {
  margin: 0;
}

.project-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition:
    box-shadow 220ms var(--ease-mechanical-spring),
    transform 220ms var(--ease-mechanical-spring),
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
  background: linear-gradient(to top, rgba(17, 17, 19, 0.9) 0%, rgba(17, 17, 19, 0.4) 60%, transparent 100%);
  opacity: 0;
  transition: opacity 200ms var(--ease-te-slide);
}
.project-card:hover .project-overlay {
  opacity: 1;
}

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

.more-work-btn {
  padding: 11px 28px;
  font-size: var(--text-filter-tab);
}
</style>
