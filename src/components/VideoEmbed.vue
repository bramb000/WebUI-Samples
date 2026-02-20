<script setup lang="ts">
defineProps<{
  src: string;
  title?: string;
}>();
</script>

<template>
  <div class="w-full rounded-2xl overflow-hidden shadow-lg border border-[var(--color-text-charcoal)]/10 bg-black">
    <div class="relative w-full aspect-video">
      <iframe
        class="absolute top-0 left-0 w-full h-full"
        :src="src"
        :title="title || 'Video content'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
