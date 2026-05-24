<script setup lang="ts">
/**
 * Looping case-study clip — prefer WebM/MP4 over GIF after `npm run assets:optimize`.
 * Poster WebP optional for LCP before video decodes.
 */
import CaseLightboxOverlay from './CaseLightboxOverlay.vue'
import { useCaseLightbox } from '../composables/useCaseLightbox'

const props = defineProps<{
  src: string
  poster?: string
  alt: string
  caption?: string
  imgClass?: string
  priority?: boolean
}>()

const { isOpen, open, close } = useCaseLightbox()

const mediaClass = [
  'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
  props.imgClass,
]
</script>

<template>
  <figure class="case-loop space-y-2">
    <video
      :src="props.src"
      :poster="props.poster"
      :class="mediaClass"
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      :preload="props.priority ? 'auto' : 'metadata'"
      :aria-label="props.alt"
      @click="open"
    />
    <figcaption
      v-if="props.caption"
      class="type-case-caption text-center"
    >
      {{ props.caption }}
    </figcaption>

    <CaseLightboxOverlay
      :open="isOpen"
      :caption="props.caption"
      @close="close"
    >
      <video
        :src="props.src"
        :poster="props.poster"
        class="lightbox-video"
        autoplay
        loop
        muted
        playsinline
        disablepictureinpicture
        :aria-label="props.alt"
      />
    </CaseLightboxOverlay>
  </figure>
</template>

<style scoped>
.lightbox-video {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
