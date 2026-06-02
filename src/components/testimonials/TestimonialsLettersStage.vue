<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { TESTIMONIAL_BOOK_ENTRIES } from '../../constants/testimonialBookData'
import TrifoldLetter from './TrifoldLetter.vue'

/** Scroll-driven reveal runs this much longer than the base tuning. */
const ANIMATION_LENGTH_SCALE = 1.45

/**
 * Reveal begins when the “Testimonials” header top crosses this viewport line
 * (0.66 — achievements + CTA still in view when reveal begins).
 */
const HEADER_TRIGGER_VP = 0.66
/** Viewport heights of scroll after trigger to reach full unfold (1). */
const REVEAL_SCROLL_VP = 0.38 * ANIMATION_LENGTH_SCALE

const trackRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const isMobileLayout = ref(false)
let rafId = 0
let mobileMq: MediaQueryList | null = null

function updateProgress() {
  const header = headerRef.value
  if (!header) {
    progress.value = 0
    return
  }
  const viewportH = window.visualViewport?.height ?? window.innerHeight
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
  isMobileLayout.value = window.matchMedia('(max-width: 767px)').matches
}

onMounted(() => {
  syncMobileLayout()
  mobileMq = window.matchMedia('(max-width: 767px)')
  mobileMq.addEventListener('change', syncMobileLayout)
  updateProgress()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  mobileMq?.removeEventListener('change', syncMobileLayout)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (rafId)
    cancelAnimationFrame(rafId)
})

const letters = computed(() =>
  TESTIMONIAL_BOOK_ENTRIES.filter((e) =>
    e.name === 'Chris Clay' || e.name === 'Jill Priya Keshyap' || e.name === 'Tianhao Kang',
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
    { x: '50%', y: '36%', rot: -2.5 },
    { x: '50%', y: '54%', rot: 2.5 },
    { x: '50%', y: '72%', rot: -1.5 },
  ]
}

const anchors = computed(() => (isMobileLayout.value ? mobileAnchors() : desktopAnchors()))

function letterProgress(globalP: number, idx: number) {
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
    >
      <div class="letters-stage__bg" aria-hidden="true" />

      <div class="letters-stack" aria-hidden="true">
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

      <div class="letters-hud pointer-events-none">
        <h2
          ref="headerRef"
          class="type-parchment-ui letters-hud__hint"
        >
          Testimonials
        </h2>
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
    box-sizing: border-box;
  }

  .letters-stage {
    min-height: min(78vh, 44rem);
    padding-block: var(--grid-4) 0;
  }

  .letters-hud {
    top: var(--grid-3);
    padding-inline: 0;
  }

  .letters-hud__hint {
    font-size: var(--text-label);
  }
}
</style>

