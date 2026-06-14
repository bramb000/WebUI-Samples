<script setup lang="ts">
import { useId } from 'vue'
import CaseLightboxOverlay from './CaseLightboxOverlay.vue'
import { useCaseLightbox } from '../composables/useCaseLightbox'

const captionId = useId()

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
  <figure class="case-image case-study-figure">
    <button
      type="button"
      class="case-image__trigger"
      :aria-label="`View enlarged: ${props.alt}`"
      @click="open"
    >
      <img
        :src="props.src"
        :alt="props.alt"
        :title="props.caption"
        :aria-describedby="props.caption ? captionId : undefined"
        :loading="props.priority ? 'eager' : 'lazy'"
        :fetchpriority="props.priority ? 'high' : 'auto'"
        decoding="async"
        :class="['case-media-interactive', props.imgClass ?? 'case-media-frame']"
      />
    </button>
    <figcaption
      v-if="props.caption"
      :id="captionId"
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
        :title="props.caption"
        class="lightbox-image case-lightbox-media"
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
</style>
