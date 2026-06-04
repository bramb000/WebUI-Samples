import { type Ref, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

export type TypewriterCycleOptions = {
  typeMs?: number
  deleteMs?: number
  holdMs?: number
  reducedMotion?: Ref<boolean>
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined')
    return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Cycles through strings with delete-then-type typewriter transitions. */
export function useTypewriterCycle(
  phrases: readonly string[],
  options: TypewriterCycleOptions = {},
) {
  const {
    typeMs = 45,
    deleteMs = 28,
    holdMs = 2800,
    reducedMotion,
  } = options

  const displayed = ref(phrases[0] ?? '')
  const phraseIndex = ref(0)
  let timer: ReturnType<typeof setTimeout> | null = null
  let rafHandle = 0

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (rafHandle) {
      cancelAnimationFrame(rafHandle)
      rafHandle = 0
    }
  }

  /** rAF-based delay — setTimeout is throttled on some Windows power/efficiency modes. */
  function schedule(fn: () => void, ms: number) {
    clearTimer()
    if (ms <= 0) {
      fn()
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      if (now - start >= ms) {
        rafHandle = 0
        fn()
        return
      }
      rafHandle = requestAnimationFrame(tick)
    }
    rafHandle = requestAnimationFrame(tick)
  }

  function isReducedMotion() {
    return reducedMotion?.value ?? prefersReducedMotion()
  }

  function stepType() {
    const target = phrases[phraseIndex.value] ?? ''
    if (displayed.value.length >= target.length) {
      schedule(stepHold, holdMs)
      return
    }
    displayed.value = target.slice(0, displayed.value.length + 1)
    schedule(stepType, typeMs)
  }

  function stepDelete() {
    if (displayed.value.length === 0) {
      phraseIndex.value = (phraseIndex.value + 1) % phrases.length
      stepType()
      return
    }
    displayed.value = displayed.value.slice(0, -1)
    schedule(stepDelete, deleteMs)
  }

  function stepHold() {
    schedule(stepDelete, holdMs)
  }

  function start() {
    clearTimer()
    if (phrases.length === 0)
      return

    if (isReducedMotion()) {
      phraseIndex.value = 0
      displayed.value = phrases[0] ?? ''
      if (phrases.length > 1) {
        schedule(() => {
          phraseIndex.value = (phraseIndex.value + 1) % phrases.length
          displayed.value = phrases[phraseIndex.value] ?? ''
          start()
        }, holdMs * 2)
      }
      return
    }

    displayed.value = ''
    phraseIndex.value = 0
    stepType()
  }

  onMounted(() => {
    void nextTick(() => {
      start()
    })
  })

  onUnmounted(clearTimer)

  if (reducedMotion) {
    watch(reducedMotion, () => start())
  }

  return { displayed, phraseIndex }
}
