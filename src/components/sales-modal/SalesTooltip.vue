<script setup lang="ts">
import { ref, computed } from 'vue';
import { Info } from 'lucide-vue-next';

withDefaults(defineProps<{
  text: string;
}>(), {});

const isVisible = ref(false);

const show = () => isVisible.value = true;
const hide = () => isVisible.value = false;

// Generate a unique ID for the tooltip to link aria-describedby
const tooltipId = computed(() => `tooltip-${Math.random().toString(36).substring(2, 9)}`);
</script>

<template>
  <div class="relative inline-flex items-center ml-1" @mouseenter="show" @mouseleave="hide" @focusin="show" @focusout="hide">
    <button
      type="button"
      class="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 focus:outline-none rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
      aria-label="More information"
      :aria-expanded="isVisible"
      :aria-describedby="isVisible ? tooltipId : undefined"
    >
      <Info class="w-4 h-4" />
    </button>
    
    <div
      v-show="isVisible"
      :id="tooltipId"
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 text-xs text-slate-300 bg-[#0a0a0f] border border-white/10 rounded-lg shadow-2xl z-[100] transition-opacity duration-200 pointer-events-none"
      role="tooltip"
    >
      {{ text }}
      <!-- Triangle pointer -->
      <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-800 dark:border-t-slate-700"></div>
    </div>
  </div>
</template>
