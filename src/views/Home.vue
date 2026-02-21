<script setup lang="ts">
import { useRouter } from 'vue-router';

// Placeholder project data - to be replaced with real data later
const caseStudies = [
  {
    id: 'guild',
    title: 'Guild of Guardians',
    description: 'Increasing D7 Retention by 25% through Data-Driven UX',
    tags: ['Mobile Game', 'UX Research', 'Data Analysis'],
    image: '', // To be filled in Phase 2
    link: '/work/guild-of-guardians'
  },
  {
    id: 'rocksmith',
    title: 'Rocksmith+',
    description: 'Releasing to 1 million new users on 5 Platforms with 1 UI system',
    tags: ['PC Game', 'Console Game', 'Accessibility'],
    image: '', // To be filled in Phase 2
    link: '/work/rocksmith'
  }
];

const router = useRouter();

const navigateTo = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="space-y-32">
    <!-- Hero Section -->
    <section class="max-w-4xl pt-12 md:pt-24 space-y-8">
      <h1 class="text-5xl md:text-7xl font-serif font-bold text-[var(--color-text-charcoal)] leading-[1.1]">
        Hi, I'm Bramha.
      </h1>
      <p class="text-xl md:text-2xl font-sans leading-relaxed opacity-80 max-w-2xl">
        I sit at the intersection of <span class="font-serif italic text-[var(--color-text-charcoal)]">user experience</span>, <span class="font-serif italic text-[var(--color-text-charcoal)]">game design</span>, and <span class="font-serif italic text-[var(--color-text-charcoal)]">tech</span> to create fulfilling and delightful experiences that increase retention and revenue.
      </p>
      <div class="flex gap-4 pt-4">
         <a href="#work" class="px-8 py-3 bg-[var(--color-text-charcoal)] text-[var(--color-cream-bg)] rounded-full text-lg font-sans font-medium hover:bg-opacity-90 transition-all">
          View Work
        </a>
         <router-link to="/about" class="px-8 py-3 border border-[var(--color-text-charcoal)] text-[var(--color-text-charcoal)] rounded-full text-lg font-sans font-medium hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-all">
          About Me
        </router-link>
      </div>
    </section>

    <!-- Selected Work Grid -->
    <section id="selected-work" class="space-y-16 mb-24">
      <div class="flex justify-between items-baseline border-b border-[var(--color-text-charcoal)] pb-4 mb-12">
        <h2 class="text-3xl md:text-4xl font-serif">Selected Work</h2>
        <span class="font-sans text-sm tracking-widest uppercase opacity-60">Featured</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
        <article 
          v-for="project in caseStudies.slice(0, 3)" 
          :key="project.id" 
          @click="navigateTo(project.link)"
          class="group cursor-pointer space-y-4"
        >
          <!-- Thumbnail Placeholder -->
          <div class="w-full aspect-[4/3] bg-[#E5E5E5] rounded-2xl overflow-hidden relative border border-[var(--color-accent-soft)]">
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--color-text-charcoal)]/10 backdrop-blur-sm">
              <span class="bg-[var(--color-cream-bg)] text-[var(--color-text-charcoal)] px-6 py-2 rounded-full font-sans font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                View Case Study
              </span>
            </div>
            <!-- Image will go here -->
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
    </section>

  </div>
</template>
