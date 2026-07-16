<script setup lang="ts">
import { ref } from 'vue'
import ShubaDuckViewer from './ShubaDuckViewer.vue'

interface Props {
  scale?: number
}

withDefaults(defineProps<Props>(), { scale: 0.75 })

const stageRef = ref<HTMLElement | null>(null)
const gooseHovered = ref(false)
const pointerX = ref(0)
const pointerY = ref(0)

function onStageEnter() {
  gooseHovered.value = true
}

function onStageLeave() {
  gooseHovered.value = false
}

function onStageMove(event: MouseEvent) {
  const stage = stageRef.value
  if (!stage)
    return

  const rect = stage.getBoundingClientRect()
  pointerX.value = event.clientX - rect.left
  pointerY.value = event.clientY - rect.top
}

const CHIPS = [
  { id: 'builds', label: 'Builds End-to-End', placement: 'top-left' },
  { id: 'data', label: 'Deep in the data', placement: 'top-right' },
  { id: 'team', label: 'Customer obsessed', placement: 'bottom-left' },
] as const
</script>

<template>
  <div
    ref="stageRef"
    class="hero-duck-chips"
    :class="{ 'hero-duck-chips--goose': gooseHovered }"
    @mouseenter="onStageEnter"
    @mouseleave="onStageLeave"
    @mousemove="onStageMove"
  >
    <ShubaDuckViewer class="hero-duck-chips__viewer" :scale="scale" />

    <ul class="hero-duck-chips__list" aria-hidden="true">
      <li
        v-for="(chip, index) in CHIPS"
        :key="chip.id"
        class="hero-duck-chips__item"
        :class="`hero-duck-chips__item--${chip.placement}`"
        :style="{ '--chip-float-delay': `${index * 420}ms` }"
      >
        <span class="hero-duck-chips__chip">{{ chip.label }}</span>
      </li>
    </ul>

    <div
      class="hero-duck-chips__figma-select"
      :class="{ 'hero-duck-chips__figma-select--visible': gooseHovered }"
      :style="{
        transform: `translate3d(${pointerX}px, ${pointerY}px, 0)`,
      }"
      aria-hidden="true"
    >
      <svg
        class="hero-duck-chips__figma-cursor"
        viewBox="0 0 24 24"
        width="22"
        height="22"
      >
        <path
          d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35Z"
          fill="#111"
          stroke="#fff"
          stroke-width="1.35"
          stroke-linejoin="round"
        />
      </svg>
      <span class="hero-duck-chips__chip hero-duck-chips__chip--attached">a silly goose</span>
    </div>
  </div>
</template>

<style scoped>
.hero-duck-chips {
  --duck-chip-font: clamp(0.55rem, 5.2cqi, 0.7rem);
  --duck-chip-pad-y: clamp(0.12rem, 1.4cqi, 0.25rem);
  --duck-chip-pad-x: clamp(0.28rem, 2.8cqi, 0.5rem);
  --duck-chip-radius: clamp(2px, 1.2cqi, 6px);
  --duck-chip-border: max(1px, 0.35cqi);
  --duck-chip-float: clamp(2px, 1.4cqi, 5px);
  --duck-chip-cursor: clamp(14px, 9cqi, 22px);
  --duck-chip-attach-top: clamp(0.65rem, 6.5cqi, 1.05rem);
  --duck-chip-attach-left: clamp(0.55rem, 5.8cqi, 0.95rem);

  position: relative;
  width: clamp(13.5rem, 30vw, 18rem);
  height: clamp(16.5rem, 36vw, 22.5rem);
  flex-shrink: 0;
  overflow: visible;
  cursor: default;
  container-type: inline-size;
  container-name: duck-chips;
}

.hero-duck-chips--goose {
  cursor: none;
}

.hero-duck-chips__viewer {
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.hero-duck-chips__list {
  position: absolute;
  inset: 0;
  z-index: 5;
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
}

.hero-duck-chips__item {
  position: absolute;
  z-index: 4;
  max-width: min(46cqi, 9rem);
  animation: hero-duck-chip-float 4.8s ease-in-out infinite;
  animation-delay: var(--chip-float-delay, 0ms);
}

.hero-duck-chips__item--top-left {
  top: 2%;
  left: -12%;
  transform: rotate(-4deg);
}

.hero-duck-chips__item--top-right {
  top: 8%;
  right: -14%;
  transform: rotate(3deg);
}

.hero-duck-chips__item--bottom-left {
  bottom: 10%;
  left: -10%;
  transform: rotate(2deg);
}

.hero-duck-chips__figma-select {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;
  width: max-content;
  height: max-content;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  will-change: transform;
}

.hero-duck-chips__figma-select--visible {
  opacity: 1;
  visibility: visible;
}

.hero-duck-chips__figma-cursor {
  display: block;
  width: var(--duck-chip-cursor);
  height: var(--duck-chip-cursor);
  filter: drop-shadow(0 1px 2px rgba(26, 24, 20, 0.18));
}

.hero-duck-chips__chip--attached {
  position: absolute;
  top: var(--duck-chip-attach-top);
  left: var(--duck-chip-attach-left);
  white-space: nowrap;
  max-width: none;
}

.hero-duck-chips__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--duck-chip-pad-y) var(--duck-chip-pad-x);
  background: var(--color-elevated);
  color: var(--color-accent);
  border: var(--duck-chip-border) solid var(--color-border-hi);
  border-radius: var(--duck-chip-radius);
  box-shadow: var(--dl-glow-global);
  font-family: var(--font-sans);
  font-size: var(--duck-chip-font);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.2;
  white-space: nowrap;
  text-align: center;
}

@keyframes hero-duck-chip-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 calc(var(--duck-chip-float) * -1); }
}

/* Narrow stage (mobile / stacked hero) — keep all chips, pull in + allow wrap */
@container duck-chips (max-width: 15.5rem) {
  .hero-duck-chips__item {
    max-width: min(42cqi, 7rem);
  }

  .hero-duck-chips__item--top-left {
    top: 0;
    left: -4%;
  }

  .hero-duck-chips__item--top-right {
    top: 4%;
    right: -4%;
  }

  .hero-duck-chips__item--bottom-left {
    bottom: 6%;
    left: -2%;
  }

  .hero-duck-chips__chip:not(.hero-duck-chips__chip--attached) {
    white-space: normal;
  }
}

@media (max-width: 767px) {
  .hero-duck-chips {
    width: clamp(11.5rem, 58vw, 15rem);
    height: clamp(14rem, 70vw, 18.5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-duck-chips__item {
    animation: none;
  }
}
</style>
