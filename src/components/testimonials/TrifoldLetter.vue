<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Props = {
  quote: string
  name: string
  role: string
  /** 0..1: drives enter + unfold */
  progress: number
  /** Slight depth ordering in the stack */
  z: number
  /** Anchor position inside stage (CSS length, e.g. `52vw`) */
  anchorX?: string
  anchorY?: string
  /** “Strewn” rotation at rest */
  baseRotDeg?: number
  /** Entry direction for the gentle slide-in. */
  enterFrom?: 'left' | 'right' | 'top-right'
  /** Narrow viewport — tighter slide-in and card footprint */
  compact?: boolean
}

const props = defineProps<Props>()

const p = computed(() => Math.max(0, Math.min(1, props.progress)))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

const enter = computed(() => easeOutCubic(p.value))

const viewportScale = ref(1)

function recomputeViewportScale() {
  const vw = window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const compact = props.compact ?? false

  const maxNeededHeight = compact ? 280 : 720
  const maxNeededWidth = compact ? 280 : 520
  const scaleY = vh / maxNeededHeight
  const scaleX = vw / maxNeededWidth
  viewportScale.value = Math.min(1, scaleX, scaleY)
}

onMounted(() => {
  recomputeViewportScale()
  window.addEventListener('resize', recomputeViewportScale, { passive: true })
})

watch(() => props.compact, recomputeViewportScale)

onBeforeUnmount(() => {
  window.removeEventListener('resize', recomputeViewportScale)
})

const styleVars = computed(() => {
  const e = enter.value
  // Gentle slide-in toward the anchor.
  const from = props.enterFrom ?? 'top-right'
  const compact = props.compact ?? false
  const enterSpread = compact ? 6 : 16
  const tx =
    from === 'left'
      ? (1 - e) * -enterSpread
      : from === 'right'
        ? (1 - e) * enterSpread
        : (1 - e) * (compact ? 4 : 10)
  const ty = from === 'top-right' ? (1 - e) * -3 : 0
  const rot = (1 - e) * -10 // deg
  const scale = 0.82 + e * 0.06
  const alpha = 0.02 + e * 0.98

  // Single fold: top flap opens while entering.
  const topProg = clamp01(e * 1.35)
  const topAngle = -179 * (1 - topProg)

  // Scene tilt: folded has a slight perspective; open lays flatter.
  const sceneRotX = -20 * (1 - e)
  const sceneRotY = 10 * (1 - e)

  if (compact) {
    return {
      '--letter-alpha': String(alpha),
      '--letter-enter-y': `${(1 - e) * 14}px`,
      '--letter-rot': `${props.baseRotDeg ?? 0}deg`,
    } as Record<string, string>
  }

  return {
    '--letter-ax': props.anchorX ?? '50vw',
    '--letter-ay': props.anchorY ?? '50%',
    '--letter-tx': `${tx}vw`,
    '--letter-ty': `${ty}vh`,
    '--letter-rot': `${rot + (props.baseRotDeg ?? 0)}deg`,
    '--letter-scale': String(scale),
    '--letter-alpha': String(alpha),
    '--fold-top': `${topAngle}deg`,
    '--scene-scale': String(viewportScale.value),
    '--scene-rot-x': `${sceneRotX}deg`,
    '--scene-rot-y': `${sceneRotY}deg`,
    '--letter-z': String(props.z),
  } as Record<string, string>
})
</script>

<template>
  <article
    class="trifold-letter"
    :class="{ 'trifold-letter--compact': compact }"
    :style="styleVars"
    aria-label="Testimonial letter"
  >
    <div v-if="compact" class="trifold-letter__flat">
      <div class="letter-body">
        <blockquote class="trifold-letter__quote type-body-lg">
          “{{ quote }}”
        </blockquote>
        <footer class="trifold-letter__attribution">
          <div class="type-case-testimonial-name">{{ name }}</div>
          <div class="type-case-testimonial-role">{{ role }}</div>
        </footer>
      </div>
    </div>

    <div v-else class="trifold-letter__paper">
      <section class="panel top-panel" aria-hidden="true">
        <div class="face front">
          <div class="text-content">
            <div class="letter-body">
              <blockquote class="trifold-letter__quote type-body-lg">
                “{{ quote }}”
              </blockquote>
              <footer class="trifold-letter__attribution">
                <div class="type-case-testimonial-name">{{ name }}</div>
                <div class="type-case-testimonial-role">{{ role }}</div>
              </footer>
            </div>
          </div>
        </div>
        <div class="face back envelope-front">
          <span class="type-parchment-ui">Testimonials</span>
        </div>
      </section>

      <section class="panel center-panel">
        <div class="face front">
          <div class="text-content">
            <div class="letter-body">
              <blockquote class="trifold-letter__quote type-body-lg">
                “{{ quote }}”
              </blockquote>
              <footer class="trifold-letter__attribution">
                <div class="type-case-testimonial-name">{{ name }}</div>
                <div class="type-case-testimonial-role">{{ role }}</div>
              </footer>
            </div>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<style scoped>
.trifold-letter {
  position: absolute;
  left: var(--letter-ax, 50vw);
  top: var(--letter-ay, 50%);
  transform:
    translate3d(calc(-50% + var(--letter-tx, 0vw)), calc(-50% + var(--letter-ty, 0vh)), 0)
    rotate(var(--letter-rot, 0deg))
    scale(var(--letter-scale, 1));
  opacity: var(--letter-alpha, 1);
  z-index: var(--letter-z, 1);
  width: min(28vw, 320px);
  max-width: 360px;
  /* One panel (folded) height is 1/3 of the full letter */
  height: min(24vh, 190px);
  pointer-events: none;
  will-change: transform, opacity;
}

.trifold-letter__paper {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  perspective: 2500px;
  transform:
    scale(var(--scene-scale, 1))
    rotateX(var(--scene-rot-x, 0deg))
    rotateY(var(--scene-rot-y, 0deg));
  will-change: transform;
}

.panel {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  will-change: transform;
}

.center-panel { z-index: 0; top: 0; }

.top-panel {
  /* 1px overlap at hinge — hides antialiased gap between panels */
  bottom: calc(100% - 1px);
  transform-origin: bottom center;
  z-index: 2;
  transform: rotateX(var(--fold-top, -179deg));
}


.face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  box-sizing: border-box;
  overflow: hidden; /* used for continuous-text slicing */
  background: var(--paper-surface-fill);
  border: none;
  box-shadow: none;
}

/* One continuous sheet: stroke only on outer edges, not at the hinge */
.top-panel .front,
.center-panel .front {
  border-style: solid;
  border-color: color-mix(in srgb, var(--paper-on-fill-border) 52%, transparent);
  border-width: 0 1px;
}

.top-panel .front {
  border-top-width: 1px;
}

.center-panel .front {
  border-bottom-width: 1px;
}

.top-panel .back {
  transform: rotateX(180deg);
  background: var(--paper-surface-fill-deep);
}

.envelope-front {
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 40px rgba(26, 24, 20, 0.07);
}

.text-content {
  position: absolute;
  left: 0;
  width: 100%;
  height: 200%;
  padding: 12px 14px;
  box-sizing: border-box;
}

.top-panel .text-content { top: 0; }
.center-panel .text-content { top: -100%; }

.letter-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--grid-2);
}

.trifold-letter__quote {
  margin: 0;
  color: var(--paper-on-fill-text);
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  line-height: var(--leading-body-sm);
  letter-spacing: 0;
  max-width: 34ch;
}

.trifold-letter__attribution {
  margin-top: auto;
  padding-top: var(--grid-2);
  border-top: 1px solid color-mix(in srgb, var(--paper-on-fill-border) 55%, transparent);
}

.trifold-letter--compact {
  position: relative;
  left: auto;
  top: auto;
  width: min(88vw, 320px);
  max-width: none;
  height: auto;
  transform: translateY(var(--letter-enter-y, 0)) rotate(var(--letter-rot, 0deg));
  z-index: auto;
}

.trifold-letter__flat {
  box-sizing: border-box;
  padding: var(--grid-3);
  background: var(--paper-surface-fill);
  border: 1px solid color-mix(in srgb, var(--paper-on-fill-border) 52%, transparent);
}

.trifold-letter--compact .letter-body {
  height: auto;
}

.trifold-letter--compact .trifold-letter__attribution {
  margin-top: 0;
}

.trifold-letter--compact .trifold-letter__quote {
  max-width: none;
}

@media (max-width: 767px) {
  .trifold-letter:not(.trifold-letter--compact) {
    width: min(78vw, 280px);
    height: min(20vh, 160px);
  }

  .text-content {
    padding: var(--grid-2) var(--grid-2);
  }

  .trifold-letter__quote {
    font-size: var(--text-caption);
    line-height: var(--leading-label);
  }
}
</style>

