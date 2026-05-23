<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ALCHEMIST_PHASE_LABELS } from '../../constants/alchemistBookData'
import { bookPageScrollProgress } from '../../constants/alchemistBookScroll'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { useScrollProgress } from '../../composables/useScrollProgress'
import {
  BOOK_PRELOAD_PRIORITY,
  preloadBookPageImages,
  schedulePreloadRemainingBookPageImages,
} from '../../assets/images/book/bookPageImages'
import { createDetectiveBookScene, type DetectiveBookScene } from '../../vfx/detectiveBook/createDetectiveBookScene'

const SCROLL_TRACK_VH = 600
/** Matches NavBar fixed height in App layout */
const NAV_OFFSET_PX = 72

const trackRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reducedMotion = useReducedMotion()
const { progress } = useScrollProgress(trackRef, { pinTop: NAV_OFFSET_PX })

/** Only swap to static UI for accessibility — not low-power heuristics (too many laptops hit cores ≤ 4). */
const useStaticFallback = computed(() => reducedMotion.value)

const activePhaseIndex = computed(() => {
  const p = bookPageScrollProgress(progress.value)
  const i = Math.min(ALCHEMIST_PHASE_LABELS.length - 1, Math.floor(p * ALCHEMIST_PHASE_LABELS.length))
  return i
})

let bookScene: DetectiveBookScene | null = null

watch(progress, (p) => {
  if (!useStaticFallback.value && bookScene)
    bookScene.setProgress(p)
})

function disposeBook() {
  bookScene?.dispose()
  bookScene = null
}

async function mountBook() {
  if (useStaticFallback.value) {
    disposeBook()
    return
  }
  await nextTick()
  const canvas = canvasRef.value
  if (!canvas || useStaticFallback.value)
    return

  disposeBook()
  try {
    await preloadBookPageImages({ keys: [...BOOK_PRELOAD_PRIORITY] })
    bookScene = createDetectiveBookScene(canvas)
    bookScene.setProgress(progress.value)
    schedulePreloadRemainingBookPageImages()
  }
  catch (err) {
    console.error('[AlchemistBook] WebGL init failed:', err)
  }
}

function onResize() {
  bookScene?.resize()
}

watch(
  () => [useStaticFallback.value, canvasRef.value] as const,
  () => void mountBook(),
  { flush: 'post' },
)

onMounted(() => {
  void mountBook()
  window.addEventListener('resize', onResize, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  disposeBook()
})
</script>

<template>
  <section
    id="alchemist-book"
    ref="trackRef"
    class="detective-book-track"
    :style="{ '--detective-track-vh': String(SCROLL_TRACK_VH) }"
    aria-label="Product Alchemist process"
  >
    <div
      class="detective-book-stage sticky w-full overflow-hidden"
      :style="{ top: `${NAV_OFFSET_PX}px`, height: `calc(100vh - ${NAV_OFFSET_PX}px)` }"
    >
      <div class="detective-book-stage__bg" aria-hidden="true" />

      <template v-if="useStaticFallback">
        <div class="detective-book-fallback container mx-auto max-w-3xl px-6 py-16">
          <h2 class="type-section-title text-center mb-10">My Product Textbook</h2>
          <ol class="detective-book-fallback__list space-y-6">
            <li
              v-for="(label, i) in ALCHEMIST_PHASE_LABELS"
              :key="label"
              class="panel-recessed p-6"
            >
              <span class="label-segment">Phase {{ i + 1 }}</span>
              <h3 class="type-card-title mt-2">{{ label }}</h3>
            </li>
          </ol>
        </div>
      </template>

      <template v-else>
        <canvas
          ref="canvasRef"
          class="detective-book-canvas"
          aria-hidden="true"
        />

        <div class="detective-book-hud pointer-events-none">
          <p class="label-segment detective-book-hud__hint">Scroll to turn the pages</p>
          <div class="detective-book-hud__phases" role="tablist" aria-label="Process phases">
            <span
              v-for="(label, i) in ALCHEMIST_PHASE_LABELS"
              :key="label"
              class="detective-book-hud__phase"
              :class="{ 'detective-book-hud__phase--active': i === activePhaseIndex }"
            >
              {{ label }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.detective-book-track {
  position: relative;
  height: calc(var(--detective-track-vh, 600) * 1vh);
  background: var(--color-bg);
}

.detective-book-stage {
  z-index: 0;
}

.detective-book-stage__bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg);
  z-index: 0;
}

.detective-book-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: block;
}

.detective-book-hud {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(24px, 6vh, 56px);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-inline: 24px;
}

.detective-book-hud__hint {
  opacity: 0.65;
}

.detective-book-hud__phases {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px 16px;
}

.detective-book-hud__phase {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 6px 12px;
  border: 1px solid color-mix(in srgb, var(--color-border) 35%, transparent);
  border-radius: var(--dl-border-radius);
  transition:
    color 200ms ease,
    border-color 200ms ease,
    box-shadow 200ms ease;
}

.detective-book-hud__phase--active {
  color: var(--color-accent);
  border-color: var(--color-border-hi);
  box-shadow: var(--dl-glow-global);
}

.detective-book-fallback__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
