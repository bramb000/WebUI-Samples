<template>
  <template v-if="isFullScreen">
    <div :class="['@container', 'sleek-scrollbar', fullScreenClass || 'min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-white overflow-y-auto']">
      <slot></slot>
    </div>
  </template>
  <div v-else class="space-y-8">
    <!-- Header & Controls -->
    <header class="flex flex-col xl:flex-row xl:items-start justify-between gap-8">
      <div class="space-y-4 max-w-2xl">
        <h1 class="text-4xl font-bold font-[family-name:var(--font-display)]">{{ title }}</h1>
        <p class="text-lg opacity-80 leading-relaxed">
          <slot name="description">{{ description }}</slot>
        </p>
        
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-4 text-sm font-sans uppercase tracking-wider opacity-60">
            <template v-for="(tag, index) in tags" :key="tag">
              <span>{{ tag }}</span>
              <span v-if="index < tags.length - 1" class="select-none">•</span>
            </template>
          </div>

          <!-- Device Simulator Toggle / Badge -->
          <div v-if="!isFullScreen && supportedDevices.length > 0" class="flex items-center bg-[var(--color-text-charcoal)]/5 p-1 rounded-xl shrink-0 mt-2 sm:mt-0">
            
            <!-- Toggle (both supported) -->
            <template v-if="supportedDevices.includes('desktop') && supportedDevices.includes('mobile')">
              <button 
                @click="deviceMode = 'desktop'"
                :class="[
                  'px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2',
                  deviceMode === 'desktop' ? 'bg-white dark:bg-[var(--color-surface-dark)] shadow text-indigo-600 dark:text-indigo-400' : 'text-[var(--color-text-charcoal)]/60 hover:text-[var(--color-text-charcoal)] hover:bg-white/10'
                ]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                Desktop
              </button>
              <button 
                @click="deviceMode = 'mobile'"
                :class="[
                  'px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2',
                  deviceMode === 'mobile' ? 'bg-white dark:bg-[var(--color-surface-dark)] shadow text-indigo-600 dark:text-indigo-400' : 'text-[var(--color-text-charcoal)]/60 hover:text-[var(--color-text-charcoal)] hover:bg-white/10'
                ]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                Mobile
              </button>
            </template>

            <!-- Badge (only one supported) -->
            <template v-else>
              <div class="px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider bg-white dark:bg-[var(--color-surface-dark)] shadow text-[var(--color-text-charcoal)]/80 flex items-center gap-2 select-none">
                <template v-if="supportedDevices.includes('desktop')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  Desktop Only
                </template>
                <template v-else-if="supportedDevices.includes('mobile')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                  Mobile Only
                </template>
              </div>
            </template>

          </div>
        </div>
      </div>

      <!-- Links/Buttons -->
      <div class="flex flex-col sm:flex-row flex-wrap gap-2 self-start shrink-0 items-end sm:items-start pt-2 xl:pt-0">
        <a v-if="storybookId" :href="storybookUrl" target="_blank" class="inline-flex items-center justify-end sm:justify-start gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-[var(--color-text-charcoal)]/30 rounded-full hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors w-full sm:w-auto text-right sm:text-left" title="Open isolated component in Storybook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Storybook
        </a>
        
        <a :href="`${route.path}?fullscreen=true`" target="_blank" class="inline-flex items-center justify-end sm:justify-start gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-[var(--color-text-charcoal)]/30 rounded-full hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors w-full sm:w-auto text-right sm:text-left" title="Open isolated component in a new tab">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
          Full Screen
        </a>
      </div>
    </header>

    <!-- Simulator Viewport Environment -->
    <div class="w-full flex justify-center transition-all duration-500 mb-12">
      
      <!-- DEFAULT WRAPPER (No Simulators support specified) -->
      <template v-if="supportedDevices.length === 0">
        <div class="w-full h-full" :class="containerClass">
          <slot></slot>
        </div>
      </template>

      <!-- DESKTOP SIMULATOR (Resizable) -->
      <div 
        v-else-if="deviceMode === 'desktop'"
        class="relative border border-[var(--color-text-charcoal)]/10 rounded-xl shadow-2xl group flex flex-col bg-[var(--color-cream-bg)]"
        style="resize: horizontal; overflow: hidden; max-width: 100%; min-width: 320px; height: 75vh; width: calc(75vh * 16 / 9);"
      >
        <!-- The @container is crucial here. Overrides containerClass to ensure layout fills this space -->
        <div class="@container w-full h-full overflow-y-auto overflow-x-hidden sleek-scrollbar" :class="containerClass">
          <slot></slot>
        </div>
        
        <!-- Drag Handle Indicator -->
        <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-16 bg-gradient-to-l from-black/5 to-transparent rounded-l-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-0.5">
          <div class="flex gap-0.5 opacity-40 text-black dark:text-white">
            <div class="w-[2px] h-6 bg-current rounded-full"></div>
            <div class="w-[2px] h-6 bg-current rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- MOBILE SIMULATOR (iPhone 16 shape - 393x852 inner content) -->
      <div 
        v-else-if="deviceMode === 'mobile'"
        class="relative border-[14px] border-zinc-900 dark:border-zinc-950 rounded-[3rem] shadow-2xl w-[393px] h-[852px] shrink-0 overflow-hidden ring-1 ring-[var(--color-text-charcoal)]/10 bg-[var(--color-cream-bg)] flex flex-col box-content"
      >
        <!-- Dynamic Island / Notch Simulation -->
        <div class="absolute top-2 inset-x-0 h-8 z-50 flex justify-center pointer-events-none">
          <div class="w-[124px] h-8 bg-zinc-900 dark:bg-zinc-950 rounded-full"></div>
        </div>

        <!-- The @container is crucial here as well. -->
        <div class="@container w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar pt-[3.5rem] pb-8 px-2 flex flex-col">
          <div class="flex-1 w-full h-full relative" :class="containerClass">
            <slot></slot>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer note -->
    <p v-if="footerNote" class="text-sm opacity-60 text-center italic">
      {{ footerNote }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isFullScreen = computed(() => route.query.fullscreen === 'true')

const props = withDefaults(defineProps<{
  title: string
  description?: string
  tags: string[]
  storybookId?: string
  footerNote?: string
  containerClass?: string
  fullScreenClass?: string
  supportedDevices?: ('desktop' | 'mobile')[]
}>(), {
  supportedDevices: () => ['desktop', 'mobile']
})

// Initialize deviceMode with a valid supported device
const deviceMode = ref<'desktop' | 'mobile'>(
  props.supportedDevices.includes('desktop') ? 'desktop' : 'mobile'
)

// In case the prop changes dynamically, update deviceMode if current is unsupported
watch(() => props.supportedDevices, (newDevices) => {
  if (!newDevices.includes(deviceMode.value) && newDevices.length > 0) {
    deviceMode.value = newDevices[0]
  }
})

const storybookUrl = computed(() => {
  if (!props.storybookId) return ''
  const isDev = import.meta.env.DEV
  const baseUrl = isDev ? 'http://localhost:6006' : `${import.meta.env.BASE_URL}storybook`
  const baseComponentId = props.storybookId.split('--')[0]
  return `${baseUrl}/?path=/docs/${baseComponentId}--docs`
})
</script>

<style scoped>
/* Thin single-tone thumb; transparent track (WebKit + Firefox) */
.sleek-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgb(100 116 139 / 0.45) transparent;
}
.sleek-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.sleek-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.sleek-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(100 116 139 / 0.42);
  border-radius: 9999px;
}
.sleek-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgb(71 85 105 / 0.55);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
