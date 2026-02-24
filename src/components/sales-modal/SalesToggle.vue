<script setup lang="ts">
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue?: 'monthly' | 'annual';
  monthlyLabel?: string;
  annualLabel?: string;
}>(), {
  modelValue: 'annual',
  monthlyLabel: 'Monthly',
  annualLabel: 'Annual'
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'monthly' | 'annual'): void
}>();

const selected = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  selected.value = newVal;
});

const toggleSelect = (value: 'monthly' | 'annual') => {
  if (selected.value !== value) {
    selected.value = value;
    emit('update:modelValue', value);
  }
};
</script>

<template>
  <div 
    class="relative inline-flex flex-row items-center p-1 rounded-full bg-white/5 border border-white/10 transition-colors shadow-inner"
    role="radiogroup"
    aria-label="Billing cycle toggle"
  >
    <!-- Sliding thumb background -->
    <div 
      class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-full border border-white/10 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
      :class="selected === 'annual' ? 'translate-x-0' : 'translate-x-full'"
    ></div>

    <button
      type="button"
      @click="toggleSelect('annual')"
      class="relative z-10 flex-1 px-5 py-2 text-sm sm:text-base font-medium font-['Inter'] rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 tracking-wide flex items-center justify-center gap-2"
      :class="selected === 'annual' ? 'text-white' : 'text-slate-400 hover:text-white'"
      :aria-checked="selected === 'annual'"
      role="radio"
    >
      {{ annualLabel }}
      <span class="text-[10px] font-bold uppercase tracking-wider bg-purple-600/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.5 rounded-md leading-none">15% OFF</span>
    </button>
    <button
      type="button"
      @click="toggleSelect('monthly')"
      class="relative z-10 flex-1 px-5 py-2 text-sm sm:text-base font-medium font-['Inter'] rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 tracking-wide flex items-center justify-center gap-2"
      :class="selected === 'monthly' ? 'text-white' : 'text-slate-400 hover:text-white'"
      :aria-checked="selected === 'monthly'"
      role="radio"
    >
      {{ monthlyLabel }}
    </button>
  </div>
</template>
