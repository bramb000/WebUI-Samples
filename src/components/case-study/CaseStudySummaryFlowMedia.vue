<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import VideoEmbed from '../VideoEmbed.vue'
import CaseLoopVideo from '../CaseLoopVideo.vue'
import CaseImage from '../CaseImage.vue'
import type { CaseStudySummaryFlowMedia } from '../../types/caseStudySummary'

const props = defineProps<{
  media: CaseStudySummaryFlowMedia
  priority?: boolean
}>()

const lazySrc = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadLazy() {
  if (props.media.kind !== 'lazy-video' || lazySrc.value)
    return
  const mod = await props.media.loader()
  lazySrc.value = mod.default
}

onMounted(() => {
  if (props.media.kind !== 'lazy-video' || props.priority) {
    void loadLazy()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(e => e.isIntersecting)) {
        void loadLazy()
        observer?.disconnect()
      }
    },
    { rootMargin: '240px' },
  )
  if (root.value)
    observer.observe(root.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div ref="root" class="summary-flow-media">
    <VideoEmbed
      v-if="media.kind === 'youtube'"
      :src="media.embedUrl"
      :title="media.title"
    />
    <CaseImage
      v-else-if="media.kind === 'image'"
      :src="media.src"
      :alt="media.title"
      img-class="summary-flow-media__clip summary-flow-media__still"
      :priority="priority"
    />
    <CaseLoopVideo
      v-else-if="media.kind === 'video'"
      :src="media.src"
      :poster="media.poster"
      :alt="media.title"
      :priority="priority"
      img-class="summary-flow-media__clip"
    />
    <CaseLoopVideo
      v-else-if="lazySrc"
      :src="lazySrc"
      :poster="media.poster"
      :alt="media.title"
      :priority="priority"
      img-class="summary-flow-media__clip"
    />
    <div
      v-else
      class="summary-flow-media__placeholder"
      :aria-label="`Loading ${media.title}`"
      role="img"
    />
  </div>
</template>

<style scoped>
.summary-flow-media {
  width: 100%;
}

.summary-flow-media :deep(.summary-flow-media__clip) {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: var(--dl-border-width) solid var(--color-border);
  border-radius: var(--dl-border-radius);
  display: block;
}

.summary-flow-media :deep(.case-loop__trigger),
.summary-flow-media :deep(.case-image__trigger) {
  display: block;
  width: 100%;
}

.summary-flow-media__placeholder {
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: var(--dl-border-radius);
  background: var(--color-elevated);
  border: 1px dashed color-mix(in srgb, var(--color-border) 70%, transparent);
}
</style>
