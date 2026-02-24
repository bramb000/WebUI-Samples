<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'selected';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
}>(), {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  disabled: false
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>();

const baseClasses = 'inline-flex items-center justify-center rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b0b12] disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'group relative bg-gradient-to-b from-purple-500/80 to-indigo-600/80 hover:from-purple-400/90 hover:to-indigo-500/90 text-white shadow-[0_4px_20px_rgba(147,51,234,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] border border-white/10 backdrop-blur-xl focus:ring-purple-500 transition-all overflow-hidden';
    case 'secondary':
      return 'group relative bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md focus:ring-indigo-500 transition-all overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]';
    case 'outline':
      return 'group relative bg-transparent border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white backdrop-blur-sm focus:ring-indigo-500 transition-all overflow-hidden';
    case 'ghost':
      return 'bg-transparent hover:bg-white/5 text-slate-300 focus:ring-indigo-500 transition-all';
    case 'selected':
      return 'bg-white/[0.02] text-slate-500 cursor-default border border-white/5 shadow-inner backdrop-blur-sm';
    default:
      return 'bg-purple-600 text-white';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2';
  }
});

const widthClass = computed(() => props.fullWidth ? 'w-full' : '');

const onClick = (event: MouseEvent) => {
  if (!props.disabled && props.variant !== 'selected') {
    emit('click', event);
  }
}
</script>

<template>
  <button
    :class="[
      baseClasses, 
      variantClasses, 
      sizeClasses, 
      widthClass,
      variant !== 'selected' && !disabled ? 'transform hover:scale-[1.02] active:scale-[0.97] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]' : ''
    ]"
    :disabled="disabled || variant === 'selected'"
    :aria-disabled="disabled || variant === 'selected'"
    @click="onClick"
  >
    <!-- Glossy top reflection highlight specifically for primary -->
    <div v-if="variant === 'primary'" class="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-xl mix-blend-overlay"></div>
    
    <!-- Sweeping light flare animation on hover -->
    <div v-if="variant !== 'selected' && variant !== 'ghost'" class="absolute inset-0 -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:transition-all group-hover:duration-1000 group-hover:translate-x-[150%] pointer-events-none"></div>

    <span class="relative z-10 flex items-center justify-center gap-2 w-full"><slot /></span>
  </button>
</template>
