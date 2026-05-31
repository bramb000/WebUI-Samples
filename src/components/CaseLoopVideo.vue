<script setup lang="ts">
/**
 * Looping case-study clip — prefer WebM over GIF. Defers decode until near viewport unless priority.
 * Holds the last frame for 5s before restarting (no native loop attribute).
 */
import { onMounted, onUnmounted, ref, useId } from 'vue'
import CaseLightboxOverlay from './CaseLightboxOverlay.vue'
import { useCaseLightbox } from '../composables/useCaseLightbox'

const END_HOLD_MS = 5000

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
const captionId = useId()
let observer: IntersectionObserver | null = null
const holdTimeouts = new Map<HTMLVideoElement, ReturnType<typeof setTimeout>>()

const mediaClass = [
  'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
  props.imgClass,
]

function clearHoldFor(video: HTMLVideoElement) {
  const timeout = holdTimeouts.get(video)
  if (timeout) {
    clearTimeout(timeout)
    holdTimeouts.delete(video)
  }
}

function onVideoEnded(event: Event) {
  const video = event.target as HTMLVideoElement
  clearHoldFor(video)
  holdTimeouts.set(
    video,
    setTimeout(() => {
      video.currentTime = 0
      void video.play()
      holdTimeouts.delete(video)
    }, END_HOLD_MS),
  )
}

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
  for (const timeout of holdTimeouts.values()) clearTimeout(timeout)
  holdTimeouts.clear()
})
</script>

<template>
  <figure ref="root" class="case-loop space-y-2">
    <button
      v-if="shouldPlay"
      type="button"
      class="case-loop__trigger"
      :aria-label="`View enlarged: ${props.alt}`"
      @click="open"
    >
      <video
        :src="props.src"
        :poster="props.poster"
        :class="mediaClass"
        autoplay
        muted
        playsinline
        disablepictureinpicture
        :preload="props.priority ? 'auto' : 'none'"
        :aria-label="props.alt"
        :title="props.caption"
        :aria-describedby="props.caption ? captionId : undefined"
        @ended="onVideoEnded"
      />
    </button>
    <div
      v-else
      class="case-loop__placeholder w-full min-h-[12rem] rounded-xl bg-[var(--color-elevated)]"
      :style="props.poster ? { backgroundImage: `url(${props.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined"
      :aria-label="`Loading video: ${props.alt}`"
      role="img"
    />
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
      :image-label="props.alt"
      @close="close"
    >
      <video
        v-if="shouldPlay"
        :src="props.src"
        :poster="props.poster"
        class="lightbox-video"
        autoplay
        muted
        playsinline
        disablepictureinpicture
        :aria-label="props.alt"
        :title="props.caption"
        :aria-describedby="props.caption ? captionId : undefined"
        @ended="onVideoEnded"
      />
    </CaseLightboxOverlay>
  </figure>
</template>

<style scoped>
.case-loop__trigger {
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: zoom-in;
  text-align: inherit;
}

.lightbox-video {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
