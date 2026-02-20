<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  role: string;
  timeline: string;
  tags: string[];
}

defineProps<Props>();
</script>

<template>
  <header class="py-12 md:py-24 space-y-8 md:space-y-12 border-b border-[var(--color-text-charcoal)]/10 mb-12">
    <!-- Meta Info -->
    <div class="flex flex-wrap gap-4 text-sm font-sans uppercase tracking-widest opacity-60">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>

    <!-- Title & Intro -->
    <div class="space-y-6 max-w-4xl">
      <h1 class="text-4xl md:text-6xl font-serif font-bold leading-tight">
        {{ title }}
      </h1>
      <p class="text-xl md:text-2xl font-sans leading-relaxed opacity-80">
        {{ description }}
      </p>
    </div>

    <!-- Role & Context Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[var(--color-text-charcoal)]/10">
      <div class="space-y-2">
        <h3 class="text-sm font-sans uppercase tracking-widest opacity-50">Role</h3>
        <p class="font-serif text-lg">{{ role }}</p>
      </div>
      <div class="space-y-2">
        <h3 class="text-sm font-sans uppercase tracking-widest opacity-50">Timeline</h3>
        <p class="font-serif text-lg">{{ timeline }}</p>
      </div>
      <div class="space-y-2 col-span-2">
         <h3 class="text-sm font-sans uppercase tracking-widest opacity-50">Team</h3>
         <slot name="team"></slot>
      </div>
    </div>
  </header>
</template>
