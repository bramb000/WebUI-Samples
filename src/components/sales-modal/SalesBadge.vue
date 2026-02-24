<script setup lang="ts">
import { computed } from 'vue';
import { Lightbulb, Info } from 'lucide-vue-next';

// Define the variant types for standardizing background and text colors
const props = withDefaults(defineProps<{
  variant?: 'success' | 'warning' | 'info';
  icon?: 'lightbulb' | 'info' | 'none';
}>(), {
  variant: 'info',
  icon: 'none'
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_4px_24px_-8px_rgba(16,185,129,0.3)]';
    case 'warning':
      return 'bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_4px_24px_-8px_rgba(245,158,11,0.3)]';
    case 'info':
    default:
      return 'bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-[0_4px_24px_-8px_rgba(168,85,247,0.3)]';
  }
});
</script>

<template>
  <div :class="['group flex items-start p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]', variantClasses]">
    <!-- Inner lighting effect -->
    <div class="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none mix-blend-overlay"></div>
    
    <!-- Sweeping light flare animation on hover -->
    <div class="absolute inset-0 -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:transition-all group-hover:duration-1000 group-hover:translate-x-[150%] pointer-events-none"></div>

    <div v-if="icon !== 'none'" class="flex-shrink-0 mr-3 mt-0.5 relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
      <Lightbulb v-if="icon === 'lightbulb'" class="w-5 h-5 opacity-90 drop-shadow-md" />
      <Info v-if="icon === 'info'" class="w-5 h-5 opacity-90 drop-shadow-md" />
    </div>
    <div class="flex-1 font-medium font-['Inter'] relative z-10">
      <slot />
    </div>
  </div>
</template>
