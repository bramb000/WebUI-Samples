<script setup lang="ts">
defineProps<{
  src: string;
  title?: string;
}>();
</script>

<template>
  <div class="case-video-embed">
    <div class="case-video-embed__frame">
      <iframe
        :src="src"
        :title="title || 'Video content'"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>
