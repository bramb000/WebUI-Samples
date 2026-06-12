<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { BookCoverPage, BookImageKey, BookLeaf, BookPageLeft, BookPageRight } from '../../constants/alchemistBookData'
import {
  TESTIMONIAL_BOOK_COVER,
  TESTIMONIAL_BOOK_ENTRIES,
  TESTIMONIAL_BOOK_LEAVES,
} from '../../constants/testimonialBookData'
import { bookMaxStep, bookStepToProgress } from '../../constants/alchemistBookScroll'
import { captureVfxRenderStatus } from '../../analytics'
import { canUseWebGL } from '../../composables/canUseWebGL'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { useScrollProgress } from '../../composables/useScrollProgress'
import {
  BOOK_PRELOAD_PRIORITY,
  isBookImageCached,
  preloadBookPageImages,
  schedulePreloadRemainingBookPageImages,
} from '../../assets/images/book/bookPageImages'
import { createDetectiveBookScene, type DetectiveBookScene } from '../../vfx/detectiveBook/createDetectiveBookScene'

export type DetectiveBookNavigationMode = 'click' | 'scroll'

const props = withDefaults(defineProps<{
  /** Click left/right halves of the page to turn, or scroll through a tall track. */
  navigationMode?: DetectiveBookNavigationMode
  /** Sticky offset when using scroll navigation (nav height). */
  pinTop?: number
  /** Scroll track height in vh when using scroll navigation. */
  scrollTrackVh?: number
  /** Stage height in click mode (e.g. `min(75vh, 720px)` or `100vh`). */
  stageHeight?: string
  cover?: BookCoverPage
  backCover?: BookCoverPage
  leaves?: BookLeaf[]
  ariaLabel?: string
  preloadPriority?: BookImageKey[]
  allImageKeys?: BookImageKey[]
}>(), {
  navigationMode: 'click',
  pinTop: 72,
  scrollTrackVh: 480,
  stageHeight: '',
  cover: () => TESTIMONIAL_BOOK_COVER,
  backCover: undefined,
  leaves: () => TESTIMONIAL_BOOK_LEAVES,
  ariaLabel: 'Interactive book',
  preloadPriority: undefined,
  allImageKeys: undefined,
})

const SCROLL_TRACK_VH = computed(() => props.scrollTrackVh)
const NAV_OFFSET_PX = computed(() => props.pinTop)
const clickStageHeight = computed(() =>
  props.stageHeight || `calc(100vh - ${NAV_OFFSET_PX.value}px)`,
)
const resolvedPreloadPriority = computed(
  () => props.preloadPriority ?? [...BOOK_PRELOAD_PRIORITY],
)
const leafCount = computed(() => props.leaves.length)
const maxStep = computed(() => bookMaxStep(leafCount.value))

const trackRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reducedMotion = useReducedMotion()
const webglSupported = ref(true)
const webglInitFailed = ref(false)
const currentStep = ref(0)

const { progress } = useScrollProgress(trackRef, { pinTop: props.pinTop })

/** Static list only when WebGL is unavailable — not for reduced-motion or low-power heuristics. */
const useStaticFallback = computed(() => !webglSupported.value || webglInitFailed.value)

const isClickNavigation = computed(() => props.navigationMode === 'click')
const canGoPrev = computed(() => currentStep.value > 0)
const canGoNext = computed(() => currentStep.value < maxStep.value)

const readablePages = computed(() =>
  props.leaves
    .map((leaf) => leaf.front)
    .filter((face): face is BookPageRight => face.layout === 'right'),
)

const illustrationPages = computed(() =>
  props.leaves
    .map((leaf) => leaf.front)
    .filter((face): face is BookPageLeft => face.layout === 'left'),
)

const staticFallbackPage = computed(() => {
  if (currentStep.value <= 0)
    return null
  const textPage = readablePages.value[Math.min(currentStep.value - 1, readablePages.value.length - 1)]
  if (textPage)
    return textPage
  const illustration = illustrationPages.value[Math.min(currentStep.value - 1, illustrationPages.value.length - 1)]
  return illustration ?? null
})

const canvasAriaLabel = computed(() =>
  isClickNavigation.value
    ? `${props.ariaLabel}. Click the right page to turn forward and the left page to go back.`
    : `${props.ariaLabel}. Scroll to turn pages.`,
)

const hudHint = computed(() =>
  isClickNavigation.value
    ? 'Click the right page to turn forward · left to go back'
    : 'Scroll to turn the pages',
)

let bookScene: DetectiveBookScene | null = null

function bookProgress(): number {
  if (isClickNavigation.value)
    return bookStepToProgress(currentStep.value, leafCount.value)
  return progress.value
}

function syncBookProgress() {
  if (!useStaticFallback.value && bookScene)
    bookScene.setProgress(bookProgress())
}

function setStep(step: number) {
  currentStep.value = Math.max(0, Math.min(maxStep.value, step))
  syncBookProgress()
}

function goNext() {
  if (canGoNext.value)
    setStep(currentStep.value + 1)
}

function goPrev() {
  if (canGoPrev.value)
    setStep(currentStep.value - 1)
}

function onKeydown(event: KeyboardEvent) {
  if (!isClickNavigation.value || useStaticFallback.value)
    return
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    event.preventDefault()
    goNext()
  }
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    event.preventDefault()
    goPrev()
  }
}

watch(progress, () => {
  if (!isClickNavigation.value)
    syncBookProgress()
})

watch(maxStep, (nextMax) => {
  if (currentStep.value > nextMax)
    setStep(nextMax)
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
  if (!canvas)
    return

  disposeBook()
  webglInitFailed.value = false

  try {
    const keysToPreload = props.allImageKeys?.length
      ? [...props.allImageKeys]
      : [...resolvedPreloadPriority.value]

    await preloadBookPageImages({ keys: keysToPreload })

    const missingImages = keysToPreload.filter(k => !isBookImageCached(k))
    if (missingImages.length > 0) {
      console.warn('[AlchemistBook] Missing page images:', missingImages)
    }

    bookScene = createDetectiveBookScene(canvas, {
      reducedMotion: reducedMotion.value,
      book: {
        cover: props.cover,
        backCover: props.backCover,
        leaves: props.leaves,
      },
    })
    syncBookProgress()
    if (!props.allImageKeys?.length) {
      schedulePreloadRemainingBookPageImages(
        resolvedPreloadPriority.value,
        props.allImageKeys,
      )
    }
  }
  catch (err) {
    console.error('[AlchemistBook] WebGL init failed:', err)
    webglInitFailed.value = true
    disposeBook()
  }
}

function reportBookRenderStatus() {
  if (webglInitFailed.value) {
    captureVfxRenderStatus('detective_book', { mode: 'init_failed' })
    return
  }
  if (useStaticFallback.value) {
    captureVfxRenderStatus('detective_book', {
      mode: 'static_fallback',
      reason: 'webgl_unavailable',
    })
    return
  }
  captureVfxRenderStatus('detective_book', { mode: 'webgl' })
}

function onResize() {
  bookScene?.resize()
}

watch(
  () => [useStaticFallback.value, canvasRef.value, reducedMotion.value] as const,
  () => {
    void mountBook().then(() => reportBookRenderStatus())
  },
  { flush: 'post' },
)

onMounted(() => {
  webglSupported.value = canUseWebGL()
  void mountBook().then(() => reportBookRenderStatus())
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKeydown)
  disposeBook()
})
</script>

<template>
  <section
    id="alchemist-book"
    ref="trackRef"
    class="detective-book-track"
    :class="{ 'detective-book-track--click': isClickNavigation }"
    :style="isClickNavigation
      ? { '--detective-stage-height': clickStageHeight }
      : { '--detective-track-vh': String(SCROLL_TRACK_VH) }"
    :aria-label="ariaLabel"
  >
    <div
      class="detective-book-stage w-full overflow-hidden"
      :class="{ sticky: !isClickNavigation }"
      :style="{
        top: isClickNavigation ? undefined : `${NAV_OFFSET_PX}px`,
        height: isClickNavigation
          ? 'var(--detective-stage-height)'
          : `calc(100vh - ${NAV_OFFSET_PX}px)`,
      }"
    >
      <div class="detective-book-stage__bg" aria-hidden="true" />

      <template v-if="useStaticFallback">
        <div class="detective-book-fallback container mx-auto max-w-3xl px-6 py-16">
          <p class="type-body text-center text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
            Interactive 3D book is unavailable in this browser.
            <template v-if="isClickNavigation">
              Use the page controls below to read the book.
            </template>
            <template v-else>
              Quotes are listed below.
            </template>
          </p>

          <template v-if="isClickNavigation">
            <div
              v-if="currentStep <= 0"
              class="panel-recessed p-8 text-center"
            >
              <p class="type-body-lg m-0">{{ cover.header }}</p>
              <p class="type-body text-[var(--color-text-muted)] mt-4 mb-0">
                Open the book to begin.
              </p>
            </div>
            <article
              v-else-if="staticFallbackPage"
              class="panel-recessed p-6"
            >
              <template v-if="staticFallbackPage.layout === 'right'">
                <p
                  v-if="staticFallbackPage.number"
                  class="type-body-sm uppercase tracking-wider text-[var(--color-text-muted)] mb-3"
                >
                  {{ staticFallbackPage.number }}
                </p>
                <blockquote class="type-body-lg italic m-0">
                  {{ staticFallbackPage.body }}
                </blockquote>
                <p
                  v-if="staticFallbackPage.attribution"
                  class="type-case-testimonial-name mt-4 mb-0 whitespace-pre-line"
                >
                  {{ staticFallbackPage.attribution }}
                </p>
              </template>
              <p
                v-else
                class="type-body-lg m-0 text-center text-[var(--color-text-muted)]"
              >
                Story illustration — open in a WebGL-capable browser to view the full spread.
              </p>
            </article>

            <div class="detective-book-fallback__controls">
              <button
                type="button"
                class="detective-book-fallback__btn"
                :disabled="!canGoPrev"
                @click="goPrev"
              >
                Previous page
              </button>
              <span class="type-body-sm text-[var(--color-text-muted)] tabular-nums">
                {{ currentStep }} / {{ maxStep }}
              </span>
              <button
                type="button"
                class="detective-book-fallback__btn"
                :disabled="!canGoNext"
                @click="goNext"
              >
                Next page
              </button>
            </div>
          </template>

          <ol v-else class="detective-book-fallback__list space-y-6">
            <li
              v-for="entry in TESTIMONIAL_BOOK_ENTRIES"
              :key="entry.name"
              class="panel-recessed p-6"
            >
              <blockquote class="type-body-lg italic m-0">
                {{ entry.quote }}
              </blockquote>
              <p class="type-case-testimonial-name mt-4 mb-1">{{ entry.name }}</p>
              <p class="type-case-testimonial-role m-0">{{ entry.role }}</p>
            </li>
          </ol>
        </div>
      </template>

      <template v-else>
        <canvas
          ref="canvasRef"
          class="detective-book-canvas"
          role="img"
          :aria-label="canvasAriaLabel"
        />

        <div
          v-if="isClickNavigation"
          class="detective-book-click-zones"
        >
          <button
            type="button"
            class="detective-book-click-zone detective-book-click-zone--prev"
            :disabled="!canGoPrev"
            aria-label="Previous page"
            @click="goPrev"
          />
          <button
            type="button"
            class="detective-book-click-zone detective-book-click-zone--next"
            :disabled="!canGoNext"
            aria-label="Next page"
            @click="goNext"
          />
        </div>

        <div class="detective-book-hud pointer-events-none">
          <p class="type-body text-[var(--color-text-muted)] detective-book-hud__hint">
            {{ hudHint }}
          </p>
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

.detective-book-track--click {
  height: var(--detective-stage-height, 100vh);
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

.detective-book-click-zones {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
}

.detective-book-click-zone {
  flex: 1;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.detective-book-click-zone--prev:not(:disabled):hover {
  background: linear-gradient(to left, transparent, rgb(0 0 0 / 0.04));
}

.detective-book-click-zone--next:not(:disabled):hover {
  background: linear-gradient(to right, transparent, rgb(0 0 0 / 0.04));
}

.detective-book-click-zone:disabled {
  cursor: default;
}

.detective-book-click-zone:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: -4px;
}

.detective-book-hud {
  position: absolute;
  left: 0;
  right: 0;
  bottom: clamp(24px, 6vh, 56px);
  z-index: 3;
  display: flex;
  justify-content: center;
  padding-inline: 24px;
}

.detective-book-hud__hint {
  opacity: 0.65;
}

.detective-book-fallback__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detective-book-fallback__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.detective-book-fallback__btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgb(0 0 0 / 0.15);
  border-radius: 9999px;
  background: var(--color-surface, #fff);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.detective-book-fallback__btn:hover:not(:disabled) {
  background: rgb(0 0 0 / 0.04);
}

.detective-book-fallback__btn:disabled {
  opacity: 0.35;
  cursor: default;
}
</style>
