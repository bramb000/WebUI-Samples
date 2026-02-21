<script setup lang="ts">
withDefaults(defineProps<{
  stat?: string | number;
  statLabel?: string;
  theme?: 'neutral' | 'success' | 'danger';
}>(), {
  theme: 'neutral'
});
</script>

<template>
  <div 
    class="border rounded-xl p-6 transition-all duration-300 hover:shadow-md w-full"
    :class="{
      'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100': theme === 'neutral',
      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100': theme === 'success',
      'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100': theme === 'danger'
    }"
  >
    <div v-if="stat || statLabel" class="text-center mb-4 space-y-1">
      <div 
        v-if="stat"
        class="text-2xl font-extrabold"
        :class="{
          'text-gray-900 dark:text-white': theme === 'neutral',
          'text-emerald-900 dark:text-emerald-300': theme === 'success',
          'text-red-900 dark:text-red-400': theme === 'danger'
        }"
      >
        {{ stat }}
      </div>
      <div 
        v-if="statLabel"
        class="text-xs font-bold uppercase tracking-wider"
        :class="{
          'text-gray-700 dark:text-zinc-400': theme === 'neutral',
          'text-emerald-700 dark:text-emerald-400/80': theme === 'success',
          'text-red-700 dark:text-red-400/80': theme === 'danger'
        }"
      >
        {{ statLabel }}
      </div>
    </div>
    
    <!-- Content Slot -->
    <div class="text-base font-sans leading-relaxed" :class="{'text-center': !statLabel && stat}">
      <slot></slot>
    </div>
  </div>
</template>
