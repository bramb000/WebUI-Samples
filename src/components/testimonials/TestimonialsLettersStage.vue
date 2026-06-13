<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TESTIMONIAL_BOOK_ENTRIES } from '../../constants/testimonialBookData'
import TrifoldLetter from './TrifoldLetter.vue'

/** Scroll-driven reveal runs this much longer than the base tuning. */
const ANIMATION_LENGTH_SCALE = 1.45

/** Desktop: reveal begins when header crosses this viewport line. */
const HEADER_TRIGGER_VP = 0.66
/** Mobile: start reveal when the card stack crosses the bottom edge. */
const MOBILE_STACK_ENTER_VP = 1.0
const MOBILE_REVEAL_SCROLL_VP = 0.32

const trackRef = ref<HTMLElement | null>(null)
const stackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const isMobileLayout = ref(false)
let rafId = 0
let mobileMq: MediaQueryList | null = null

/** Viewport heights of scroll after trigger to reach full unfold (1). */
const REVEAL_SCROLL_VP = 0.38 * ANIMATION_LENGTH_SCALE

function updateProgress() {
  const viewportH = window.visualViewport?.height ?? window.innerHeight

  if (isMobileLayout.value && stackRef.value) {
    const stackTop = stackRef.value.getBoundingClientRect().top
    const enterLine = viewportH * MOBILE_STACK_ENTER_VP
    const revealDistance = viewportH * MOBILE_REVEAL_SCROLL_VP
    progress.value = clamp01((enterLine - stackTop) / revealDistance)
    return
  }

  const header = headerRef.value
  if (!header) {
    progress.value = 0
    return
  }
  const triggerY = viewportH * HEADER_TRIGGER_VP
  const headerTop = header.getBoundingClientRect().top
  const revealDistance = viewportH * REVEAL_SCROLL_VP
  const scrolledPastTrigger = triggerY - headerTop
  progress.value = clamp01(scrolledPastTrigger / revealDistance)
}

function onScroll() {
  if (rafId)
    return
  rafId = requestAnimationFrame(() => {
    rafId = 0
    updateProgress()
  })
}

function syncMobileLayout() {
  isMobileLayout.value = mobileMq?.matches ?? window.matchMedia('(max-width: 767px)').matches
  updateProgress()
}

onMounted(() => {
  syncMobileLayout()
  mobileMq = window.matchMedia('(max-width: 767px)')
  mobileMq.addEventListener('change', syncMobileLayout)
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  window.visualViewport?.addEventListener('scroll', onScroll, { passive: true })
  window.visualViewport?.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  mobileMq?.removeEventListener('change', syncMobileLayout)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  window.visualViewport?.removeEventListener('scroll', onScroll)
  window.visualViewport?.removeEventListener('resize', onScroll)
  if (rafId)
    cancelAnimationFrame(rafId)
})

const letters = computed(() =>
  TESTIMONIAL_BOOK_ENTRIES.filter((e) =>
    e.name === 'Kaiwen Young' || e.name === 'Jill Priya Keshyap' || e.name === 'Tianhao Kang',
  ).map((entry, idx) => ({
    id: `${entry.name}-${idx}`,
    ...entry,
    idx,
  })),
)

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

type Anchor = { x: string; y: string; rot: number }

function desktopAnchors(): Anchor[] {
  return [
    { x: '24%', y: '50%', rot: -5.5 },
    { x: '76%', y: '50%', rot: 6.0 },
    { x: '50%', y: '90%', rot: -3.5 },
  ]
}

function mobileAnchors(): Anchor[] {
  return [
    { x: '50%', y: '25%', rot: -2.5 },
    { x: '50%', y: '50%', rot: 2.5 },
    { x: '50%', y: '75%', rot: -1.5 },
  ]
}

const anchors = computed(() => (isMobileLayout.value ? mobileAnchors() : desktopAnchors()))

function letterProgress(globalP: number, idx: number) {
  if (isMobileLayout.value) {
    const stagger = idx * 0.05
    return clamp01((globalP - stagger) / 0.65)
  }
  const stagger = idx * 0.06 * ANIMATION_LENGTH_SCALE
  return clamp01((globalP - stagger) / 0.9)
}
</script>

<template>
  <section
    id="testimonial-letters"
    ref="trackRef"
    class="letters-track"
    :class="{ 'letters-track--mobile': isMobileLayout }"
    aria-label="Testimonials"
  >
    <div
      class="letters-stage w-full"
      :class="{ 'letters-stage--mobile': isMobileLayout }"
    >
      <div class="letters-stage__bg" aria-hidden="true" />

      <div class="letters-hud pointer-events-none">
        <h2
          ref="headerRef"
          class="type-parchment-ui letters-hud__hint"
        >
          Testimonials
        </h2>
      </div>

      <div
        ref="stackRef"
        class="letters-stack"
        :class="{ 'letters-stack--mobile': isMobileLayout }"
        aria-hidden="true"
      >
        <TrifoldLetter
          v-for="l in letters"
          :key="l.id"
          :quote="l.quote"
          :name="l.name"
          :role="l.role"
          :progress="letterProgress(progress, l.idx)"
          :z="10 + l.idx"
          :anchor-x="anchors[l.idx]?.x"
          :anchor-y="anchors[l.idx]?.y"
          :base-rot-deg="anchors[l.idx]?.rot"
          :enter-from="isMobileLayout ? 'left' : l.idx === 0 ? 'left' : l.idx === 1 ? 'top-right' : 'right'"
          :compact="isMobileLayout"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.letters-track {
  position: relative;
  background: var(--color-bg);
  /* Match home section rhythm (see .home-cta padding-block) */
  padding-bottom: var(--grid-6);
}

.letters-stage {
  z-index: 0;
  overflow: visible;
  position: relative;
  min-height: min(68vh, 640px);
}

.letters-stage__bg {
  position: absolute;
  inset: 0;
  background: var(--color-bg);
  z-index: 0;
}

.letters-stack {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.letters-hud {
  position: absolute;
  left: 0;
  right: 0;
  top: var(--grid-4);
  z-index: 2;
  display: flex;
  justify-content: center;
  padding-inline: 24px;
}

.letters-hud__hint {
  color: var(--color-text-muted);
  margin: 0;
}

@media (max-width: 767px) {
  .letters-track--mobile {
    padding-inline: var(--grid-3);
    padding-bottom: var(--grid-6);
    box-sizing: border-box;
  }

  .letters-stage--mobile .letters-hud {
    position: relative;
    top: auto;
    margin-bottom: var(--grid-4);
    padding-inline: 0;
    order: -1;
  }

  .letters-stage--mobile {
    min-height: auto;
    padding-block: var(--grid-4) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .letters-stack--mobile {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--grid-4);
    width: 100%;
    padding-bottom: var(--grid-2);
  }

  .letters-hud__hint {
    font-size: var(--text-label);
  }
}
</style>

