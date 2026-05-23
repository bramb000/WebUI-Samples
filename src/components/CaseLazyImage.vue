<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CaseImage from './CaseImage.vue'
import CaseLoopVideo from './CaseLoopVideo.vue'

const props = defineProps<{
  loader: () => Promise<{ default: string }>
  alt: string
  caption?: string
  imgClass?: string
  priority?: boolean
  /** Set when loader resolves to .webm */
  video?: boolean
}>()

const src = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null
let loading = false

async function load() {
  if (loading || src.value)
    return
  loading = true
  try {
    const mod = await props.loader()
    src.value = mod.default
  }
  catch (err) {
    console.warn('[CaseLazyImage] load failed:', err)
  }
}

onMounted(() => {
  if (props.priority) {
    void load()
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some(e => e.isIntersecting)) {
        void load()
        observer?.disconnect()
      }
    },
    { rootMargin: '280px' },
  )
  if (root.value)
    observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="case-lazy-image">
    <CaseLoopVideo
      v-if="src && (video || /\.webm($|\?)/i.test(src))"
      :src="src"
      :alt="alt"
      :caption="caption"
      :img-class="imgClass"
      :priority="priority"
    />
    <CaseImage
      v-else-if="src"
      :src="src"
      :alt="alt"
      :caption="caption"
      :img-class="imgClass"
      :priority="priority"
    />
    <div
      v-else
      class="case-lazy-image__placeholder w-full min-h-[12rem] rounded-xl bg-[var(--color-elevated)] animate-pulse"
      :aria-label="`Loading: ${alt}`"
      role="img"
    />
  </div>
</template>
