<template>
  <template v-if="isFullScreen">
    <div 
      class="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-white overflow-y-auto"
    >
      <slot></slot>
    </div>
  </template>
  <div v-else class="space-y-8">
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
          :href="storybookUrl"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[var(--color-text-charcoal)]/30 rounded-full hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors"
          title="Open isolated component in Storybook"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          View Storybook
        </a>
        
        <!-- Full Screen Button -->
        <a 
          :href="`${route.path}?fullscreen=true`"
          target="_blank"
          class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[var(--color-text-charcoal)]/30 rounded-full hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors"
          title="Open isolated component in a new tab"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          View Full Screen
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFullScreen = computed(() => route.query.fullscreen === 'true')

const props = defineProps<{
  title: string
  description?: string
  tags: string[]
  storybookId?: string
  footerNote?: string
  containerClass?: string
}>()

const storybookUrl = computed(() => {
  if (!props.storybookId) return ''
  const isDev = import.meta.env.DEV
  // In development, Storybook runs on port 6006. In production, it's built into the /storybook/ subfolder.
  const baseUrl = isDev ? 'http://localhost:6006' : `${import.meta.env.BASE_URL}storybook`
  return `${baseUrl}/?path=/story/${props.storybookId}`
})
</script>
