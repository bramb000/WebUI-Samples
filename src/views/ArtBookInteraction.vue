<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  ALL_TALES_BOOK_IMAGE_KEYS,
  TALES_BOOK_BACK,
  TALES_BOOK_COVER,
  TALES_BOOK_LEAVES,
  TALES_BOOK_PRELOAD_PRIORITY,
} from '../constants/talesBookData'
import DetectiveBookStage from '../components/detective/DetectiveBookStage.vue'
import ExperimentWrapper from '../components/ExperimentWrapper.vue'

const route = useRoute()
const isFullScreen = computed(() => route.query.fullscreen === 'true')

const stageHeight = computed(() =>
  isFullScreen.value ? '100vh' : 'min(75vh, 720px)',
)
</script>

<template>
  <ExperimentWrapper
    title="Bringing art and stories to life"
    description="A Three.js hardcover storybook with pages extracted from Tales of Hedgehog and Fox. Canvas-composited spreads, custom curl shaders, and click-to-turn navigation — illustrations stay full-bleed on every leaf."
    :tags="['Three.js', 'WebGL', 'Vue 3', 'Storybook']"
    container-class="relative w-full bg-[var(--color-bg)] overflow-hidden"
    full-screen-class="min-h-screen w-full bg-[var(--color-bg)] overflow-hidden"
    :supported-devices="[]"
    footer-note="Click the right page to turn forward · left to go back. Arrow keys work too."
  >
    <DetectiveBookStage
      navigation-mode="click"
      :pin-top="0"
      :stage-height="stageHeight"
      :cover="TALES_BOOK_COVER"
      :back-cover="TALES_BOOK_BACK"
      :leaves="TALES_BOOK_LEAVES"
      :preload-priority="TALES_BOOK_PRELOAD_PRIORITY"
      :all-image-keys="ALL_TALES_BOOK_IMAGE_KEYS"
      aria-label="Tales of Hedgehog and Fox storybook"
    />
  </ExperimentWrapper>
</template>
