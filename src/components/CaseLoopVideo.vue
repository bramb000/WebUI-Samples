<script setup lang="ts">
/**
 * Looping case-study clip — prefer WebM over GIF. Defers decode until near viewport unless priority.
 */
import { onMounted, onUnmounted, ref } from 'vue'
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
const root = ref<HTMLElement | null>(null)
const shouldPlay = ref(!!props.priority)
let observer: IntersectionObserver | null = null

const mediaClass = [
  'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
  props.imgClass,
]

onMounted(() => {
  if (props.priority) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        shouldPlay.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '320px' },
  )
  if (root.value) observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <figure ref="root" class="case-loop space-y-2">
    <video
      v-if="shouldPlay"
      :src="props.src"
      :poster="props.poster"
      :class="mediaClass"
      autoplay
      loop
      muted
      playsinline
      disablepictureinpicture
      :preload="props.priority ? 'auto' : 'none'"
      :aria-label="props.alt"
      @click="open"
    />
    <div
      v-else
      class="case-loop__placeholder w-full min-h-[12rem] rounded-xl bg-[var(--color-elevated)]"
      :style="props.poster ? { backgroundImage: `url(${props.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined"
      :aria-label="`Loading video: ${props.alt}`"
      role="img"
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
        v-if="shouldPlay"
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
