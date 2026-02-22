<script setup lang="ts">
import CaseImage from './CaseImage.vue';

defineProps<{
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  caption?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Before Image -->
      <div class="flex flex-col gap-2">
        <div class="text-xs font-bold uppercase tracking-wider text-gray-500 text-center md:text-left">
          Before
        </div>
        <CaseImage 
          :src="beforeImage" 
          :alt="beforeAlt || 'Before Image'" 
          img-class="w-full h-auto rounded-lg border border-gray-200 shadow-sm object-cover"
        />
      </div>

      <!-- After Image -->
      <div class="flex flex-col gap-2">
        <div class="text-xs font-bold uppercase tracking-wider text-[var(--color-accent-soft)] text-center md:text-left">
          After
        </div>
        <CaseImage 
          :src="afterImage" 
          :alt="afterAlt || 'After Image'" 
          img-class="w-full h-auto rounded-lg border-2 border-[var(--color-accent-soft)]/50 shadow-md object-cover"
        />
      </div>
    </div>
    
    <p v-if="caption" class="text-sm font-serif italic text-center opacity-70 px-4 mt-2">
      {{ caption }}
    </p>
  </div>
</template>
