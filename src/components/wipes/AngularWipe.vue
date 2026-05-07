<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'

type WipePalette = 'crimson-teal' | 'teal-crimson'

const props = withDefaults(
  defineProps<{
    trigger: number
    active: boolean
    palette?: WipePalette
  }>(),
  { palette: 'crimson-teal' },
)

const emit = defineEmits<{
  (e: 'covered'): void
  (e: 'done'): void
}>()

const phase = ref<'idle' | 'cover' | 'reveal'>('idle')
const localKey = ref(0)

const coverMs = 240
const revealMs = 280

const isRunning = computed(() => props.active && phase.value !== 'idle')

function start() {
  phase.value = 'cover'
  localKey.value++

  window.setTimeout(() => emit('covered'), coverMs - 10)

  window.setTimeout(() => {
    phase.value = 'reveal'
    localKey.value++
  }, coverMs)

  window.setTimeout(() => {
    phase.value = 'idle'
    emit('done')
  }, coverMs + revealMs)
}

watch(
  () => [props.trigger, props.active] as const,
  async ([, active]) => {
    if (!active) return
    await nextTick()
    start()
  },
  { immediate: false },
)

const colors = computed(() => {
  const crimson = 'rgba(165, 30, 44, 0.95)'
  const teal = 'rgba(70, 240, 209, 0.75)'
  const ink = 'rgba(8, 8, 10, 0.95)'
  return props.palette === 'crimson-teal' ? { a: crimson, b: teal, c: ink } : { a: teal, b: crimson, c: ink }
})
</script>

<template>
  <div
    class="wipe-root"
    :class="{
      running: isRunning,
      cover: phase === 'cover',
      reveal: phase === 'reveal',
    }"
    aria-hidden="true"
  >
    <svg :key="`${localKey}-${phase}`" class="wipe-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polygon class="shard shard--c" :fill="colors.c" points="-30,0 45,0 25,55 -30,65" />
      <polygon class="shard shard--a" :fill="colors.a" points="-25,35 35,10 70,40 10,85" />
      <polygon class="shard shard--b" :fill="colors.b" points="5,-10 85,0 120,45 25,60" />
      <polygon class="shard shard--a2" :fill="colors.a" points="35,55 105,35 130,90 40,115" />
    </svg>
  </div>
</template>

<style scoped>
.wipe-root {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0;
}

.wipe-root.running {
  opacity: 1;
  pointer-events: auto;
}

.wipe-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: saturate(1.1) contrast(1.05);
}

.shard {
  transform-box: fill-box;
  transform-origin: left center;
  will-change: transform;
}

.wipe-root.cover .shard--c { animation: coverC 240ms var(--ease-te-snap) forwards; }
.wipe-root.cover .shard--a { animation: coverA 240ms var(--ease-te-snap) forwards; }
.wipe-root.cover .shard--b { animation: coverB 240ms var(--ease-te-snap) forwards; }
.wipe-root.cover .shard--a2 { animation: coverA2 240ms var(--ease-te-snap) forwards; }

.wipe-root.reveal .shard--c { animation: revealC 280ms var(--ease-te-slide) forwards; }
.wipe-root.reveal .shard--a { animation: revealA 280ms var(--ease-te-slide) forwards; }
.wipe-root.reveal .shard--b { animation: revealB 280ms var(--ease-te-slide) forwards; }
.wipe-root.reveal .shard--a2 { animation: revealA2 280ms var(--ease-te-slide) forwards; }

@keyframes coverC { from { transform: translateX(-140%) skewX(-10deg); } to { transform: translateX(0%) skewX(-10deg); } }
@keyframes coverA { from { transform: translateX(-160%) skewX(-16deg); } to { transform: translateX(0%) skewX(-8deg); } }
@keyframes coverB { from { transform: translateX(-180%) skewX(-12deg); } to { transform: translateX(0%) skewX(-4deg); } }
@keyframes coverA2 { from { transform: translateX(-200%) skewX(-10deg); } to { transform: translateX(0%) skewX(-6deg); } }

@keyframes revealC { from { transform: translateX(0%) skewX(-10deg); } to { transform: translateX(160%) skewX(-10deg); } }
@keyframes revealA { from { transform: translateX(0%) skewX(-8deg); } to { transform: translateX(170%) skewX(-12deg); } }
@keyframes revealB { from { transform: translateX(0%) skewX(-4deg); } to { transform: translateX(200%) skewX(-16deg); } }
@keyframes revealA2 { from { transform: translateX(0%) skewX(-6deg); } to { transform: translateX(190%) skewX(-10deg); } }
</style>

