<script setup lang="ts">
/**
 * Looping case-study clip — prefer WebM/MP4 over GIF after `npm run assets:optimize`.
 * Poster WebP optional for LCP before video decodes.
 */
const props = defineProps<{
  src: string
  poster?: string
  alt: string
  caption?: string
  imgClass?: string
  priority?: boolean
}>()
</script>

<template>
  <figure class="case-loop space-y-2">
    <video
      :src="props.src"
      :poster="props.poster"
      class="w-full h-auto rounded-xl"
      :class="props.imgClass"
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      :preload="props.priority ? 'auto' : 'metadata'"
      :aria-label="props.alt"
    />
    <figcaption
      v-if="props.caption"
      class="type-case-caption text-center"
    >
      {{ props.caption }}
    </figcaption>
  </figure>
</template>
