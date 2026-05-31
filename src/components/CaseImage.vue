<script setup lang="ts">
import CaseLightboxOverlay from './CaseLightboxOverlay.vue'
import { useCaseLightbox } from '../composables/useCaseLightbox'

const props = defineProps<{
  src: string
  alt: string
  caption?: string
  /** Shown in the lightbox (e.g. Before / After on comparison images). */
  lightboxBadge?: string
  /** Additional classes on the <img> element */
  imgClass?: string
  /** First visible image on a route — prioritize LCP */
  priority?: boolean
}>()

const { isOpen, open, close } = useCaseLightbox()
</script>

<template>
  <figure class="case-image space-y-2">
    <button
      type="button"
      class="case-image__trigger"
      :aria-label="`View enlarged: ${props.alt}`"
      @click="open"
    >
      <img
        :src="props.src"
        :alt="props.alt"
        :loading="props.priority ? 'eager' : 'lazy'"
        :fetchpriority="props.priority ? 'high' : 'auto'"
        decoding="async"
        :class="[
          'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
          props.imgClass,
        ]"
      />
    </button>
    <figcaption
      v-if="props.caption"
      class="type-case-caption text-center"
    >
      {{ props.caption }}
    </figcaption>

    <CaseLightboxOverlay
      :open="isOpen"
      :caption="props.caption"
      :lightbox-badge="props.lightboxBadge"
      :image-label="props.alt"
      @close="close"
    >
      <img
        :src="props.src"
        :alt="props.alt"
        class="lightbox-image"
      />
    </CaseLightboxOverlay>
  </figure>
</template>

<style scoped>
.case-image__trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  text-align: inherit;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
