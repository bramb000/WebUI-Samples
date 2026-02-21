<script setup lang="ts">
withDefaults(defineProps<{
  value: string | number;
  label: string;
  theme?: 'neutral' | 'success' | 'danger';
}>(), {
  theme: 'neutral'
});
</script>

<template>
  <div class="relative group h-full">
    <div 
      class="border rounded-xl p-6 text-center h-full flex flex-col justify-center transition-transform hover:-translate-y-1 hover:shadow-md"
      :class="{
        'bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800': theme === 'neutral',
        'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50': theme === 'success',
        'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50': theme === 'danger'
      }"
    >
      <div 
        class="text-4xl font-extrabold mb-2"
        :class="{
          'text-gray-900 dark:text-white': theme === 'neutral',
          'text-emerald-900 dark:text-emerald-300': theme === 'success',
          'text-red-900 dark:text-red-400': theme === 'danger'
        }"
      >
        {{ value }}
      </div>
      <div 
        class="text-sm font-bold uppercase tracking-wider"
        :class="{
          'text-gray-700 dark:text-zinc-400': theme === 'neutral',
          'text-emerald-700 dark:text-emerald-400/80': theme === 'success',
          'text-red-700 dark:text-red-400/80': theme === 'danger'
        }"
      >
        {{ label }}
      </div>
    </div>
  </div>
</template>
