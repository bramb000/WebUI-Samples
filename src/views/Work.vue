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
    description: 'Increasing D7 Retention by 25% through Data-Driven UX',
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

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return caseStudies
  return caseStudies.filter(p => p.tags.includes(activeFilter.value))
})
</script>

<template>
  <div class="max-w-7xl mx-auto pt-12 mb-24 px-6 md:px-12 text-[var(--color-text-charcoal)]">
    <div class="flex justify-between items-baseline border-b border-[var(--color-text-charcoal)] pb-4 mb-8">
      <h1 class="text-4xl md:text-5xl font-serif font-bold">Work</h1>
      <span class="font-sans text-sm tracking-widest uppercase opacity-60">Case Studies</span>
    </div>
    
    <div class="flex flex-wrap gap-4 mb-16">
      <button 
        v-for="filter in filters" 
        :key="filter"
        @click="activeFilter = filter"
        class="px-5 py-2 rounded-full border border-[var(--color-text-charcoal)] transition-all text-sm font-bold tracking-wider uppercase"
        :class="activeFilter === filter ? 'bg-[var(--color-text-charcoal)] text-[var(--color-cream-bg)]' : 'hover:bg-[var(--color-text-charcoal)]/5 text-[var(--color-text-charcoal)]/70 hover:text-[var(--color-text-charcoal)]'"
      >
        {{ filter }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
      <article 
        v-for="project in filteredProjects" 
        :key="project.id" 
        @click="navigateTo(project.link)"
        class="group cursor-pointer space-y-4"
      >
        <!-- Thumbnail Placeholder -->
        <div class="w-full aspect-[4/3] bg-[#E5E5E5] rounded-2xl overflow-hidden relative border border-[var(--color-accent-soft)]">
          <img v-if="project.image" :src="project.image" :alt="project.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-text-charcoal)]/30 backdrop-blur-sm">
            <span class="bg-[var(--color-cream-bg)] text-[var(--color-text-charcoal)] px-6 py-2 rounded-full font-sans font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              View Case Study
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in project.tags" :key="tag" class="text-xs font-sans uppercase tracking-wider opacity-60 border border-[var(--color-text-charcoal)]/30 px-2 py-1 rounded-md">
              {{ tag }}
            </span>
          </div>
          <h3 class="text-2xl font-serif font-bold group-hover:text-[var(--color-text-charcoal)]/70 transition-colors">
            {{ project.title }}
          </h3>
          <p class="font-sans text-lg opacity-80 line-clamp-2">
            {{ project.description }}
          </p>
        </div>
      </article>
    </div>

    <!-- More Projects Link -->
    <div class="flex justify-center pt-12">
      <router-link to="/micro-projects" class="text-lg font-serif italic border-b border-[var(--color-text-charcoal)] hover:opacity-70 transition-opacity">
        View more micro-projects &rarr;
      </router-link>
    </div>
  </div>
</template>
