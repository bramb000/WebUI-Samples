<template>
  <div class="space-y-8">
    <router-link to="/micro-projects" class="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity mb-4">
      &larr; Back to Micro-projects
    </router-link>
    <!-- Header -->
    <header class="space-y-4 max-w-2xl">
      <h1 class="text-4xl font-serif font-bold">{{ title }}</h1>
      <p class="text-lg opacity-80 leading-relaxed">
        <slot name="description">{{ description }}</slot>
      </p>
      
      <div class="flex flex-wrap items-center gap-6">
        <!-- Tags -->
        <div class="flex items-center gap-4 text-sm font-sans uppercase tracking-wider opacity-60">
          <template v-for="(tag, index) in tags" :key="tag">
            <span>{{ tag }}</span>
            <span v-if="index < tags.length - 1" class="select-none">•</span>
          </template>
        </div>

        <!-- Storybook Button -->
        <a 
          v-if="storybookId"
          :href="`/WebUI-Samples/storybook/?path=/story/${storybookId}`"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[var(--color-text-charcoal)]/30 rounded-full hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors"
          title="Open isolated component in Storybook"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          View Storybook
        </a>
      </div>
    </header>

    <!-- Canvas Window -->
    <div 
      class="w-full border border-[var(--color-text-charcoal)]/10 rounded-xl overflow-hidden shadow-2xl bg-[var(--color-cream-bg)] relative"
      :class="containerClass"
    >
      <slot></slot>
    </div>

    <!-- Footer note -->
    <p v-if="footerNote" class="text-sm opacity-60 text-center italic">
      {{ footerNote }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  tags: string[]
  storybookId?: string
  footerNote?: string
  containerClass?: string
}>()
</script>
