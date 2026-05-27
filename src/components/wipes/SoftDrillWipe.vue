<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Phase = 'idle' | 'exit' | 'loading' | 'enter'

const props = defineProps<{
  trigger: number
  phase: Phase
}>()

const emit = defineEmits<{
  (e: 'cleared', trigger: number): void
  (e: 'done', trigger: number): void
}>()

const phaseLocal = ref<Phase>('idle')
const localKey = ref(0)

const EXIT_MS = 220
const ENTER_MS = 240

const isRunning = computed(() => phaseLocal.value !== 'idle')

let exitTimeout: number | null = null
let enterTimeout: number | null = null

function clearTimers() {
  if (exitTimeout != null) window.clearTimeout(exitTimeout)
  if (enterTimeout != null) window.clearTimeout(enterTimeout)
  exitTimeout = null
  enterTimeout = null
}

function startPhase(phase: Phase) {
  clearTimers()
  phaseLocal.value = phase
  localKey.value++

  if (phase === 'exit') {
    const trig = props.trigger
    exitTimeout = window.setTimeout(() => emit('cleared', trig), EXIT_MS - 8)
  }
  if (phase === 'enter') {
    const trig = props.trigger
    enterTimeout = window.setTimeout(() => {
      phaseLocal.value = 'idle'
      emit('done', trig)
    }, ENTER_MS)
  }
}

let loadingRaf = 0
const shimmerX = ref(0)
function startLoading() {
  cancelAnimationFrame(loadingRaf)
  const start = performance.now()
  const tick = (t: number) => {
    const p = ((t - start) * 0.22) % 1
    shimmerX.value = p
    loadingRaf = requestAnimationFrame(tick)
  }
  loadingRaf = requestAnimationFrame(tick)
}

watch(
  () => [props.trigger, props.phase] as const,
  async ([, phase]) => {
    await nextTick()
    if (phase === 'idle') {
      phaseLocal.value = 'idle'
      clearTimers()
      cancelAnimationFrame(loadingRaf)
      return
    }
    if (phase === 'loading') {
      phaseLocal.value = 'loading'
      startLoading()
      return
    }
    cancelAnimationFrame(loadingRaf)
    startPhase(phase)
  },
  { immediate: true },
)

onMounted(() => {})
onBeforeUnmount(() => {
  clearTimers()
  cancelAnimationFrame(loadingRaf)
})
</script>

<template>
  <div class="drill-root" :class="{ running: isRunning }" aria-hidden="true">
    <!-- Exit: fill from left→right, with soft leading edge -->
    <div v-if="phaseLocal === 'exit'" :key="`exit-${localKey}`" class="layer exit" />

    <!-- Loading: blank panel + subtle shimmer -->
    <div v-else-if="phaseLocal === 'loading'" class="layer loading">
      <div class="shimmer" :style="{ '--shimmer-x': String(shimmerX) }" />
    </div>

    <!-- Enter: cover starts full, then drills away left→right revealing content -->
    <div v-else-if="phaseLocal === 'enter'" :key="`enter-${localKey}`" class="layer enter" />
  </div>
</template>

<style scoped>
.drill-root {
  position: absolute;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: 0;
}
.drill-root.running {
  opacity: 1;
}

.layer {
  position: absolute;
  inset: 0;
  background: #111111;
}

/* Soft edge is a gradient “front” riding the clip-path. */
.layer::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 84px;
  left: calc(var(--front-x, 0%) - 42px);
  background: linear-gradient(90deg, rgba(235, 232, 226, 0.00), rgba(235, 232, 226, 0.09), rgba(235, 232, 226, 0.00));
  mix-blend-mode: screen;
  opacity: 0.9;
}

/* Exit: panel gets covered L→R */
.layer.exit {
  --front-x: 0%;
  clip-path: inset(0 100% 0 0);
  animation: exitCover 220ms var(--ease-te-snap) forwards;
}
.layer.exit::after {
  animation: exitFront 220ms var(--ease-te-snap) forwards;
}

@keyframes exitCover {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0% 0 0); }
}
@keyframes exitFront {
  from { --front-x: 0%; }
  to { --front-x: 100%; }
}

/* Enter: start covered, drill away to the right */
.layer.enter {
  --front-x: 0%;
  clip-path: inset(0 0% 0 0);
  animation: enterReveal 240ms var(--ease-te-slide) forwards;
}
.layer.enter::after {
  animation: enterFront 240ms var(--ease-te-slide) forwards;
}

@keyframes enterReveal {
  from { clip-path: inset(0 0% 0 0); }
  to { clip-path: inset(0 0% 0 100%); }
}
@keyframes enterFront {
  from { --front-x: 0%; }
  to { --front-x: 100%; }
}

/* Loading indicator: very subtle shimmer sweep */
.layer.loading {
  background: #111111;
}
.layer.loading::after {
  display: none;
}
.shimmer {
  position: absolute;
  left: calc((var(--shimmer-x, 0) * 100%) - 160px);
  top: 56%;
  width: 320px;
  height: 2px;
  background: linear-gradient(90deg, rgba(235, 232, 226, 0), rgba(235, 232, 226, 0.08), rgba(235, 232, 226, 0));
  opacity: 0.9;
}
</style>
