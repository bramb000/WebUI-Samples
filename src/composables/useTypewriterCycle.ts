import { type Ref, onMounted, onUnmounted, ref, watch } from 'vue'

export type TypewriterCycleOptions = {
  typeMs?: number
  deleteMs?: number
  holdMs?: number
  reducedMotion?: Ref<boolean>
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

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function schedule(fn: () => void, ms: number) {
    clearTimer()
    timer = setTimeout(fn, ms)
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

    if (reducedMotion?.value) {
      displayed.value = phrases[0] ?? ''
      phraseIndex.value = 0
      return
    }

    displayed.value = ''
    phraseIndex.value = 0
    stepType()
  }

  onMounted(start)

  onUnmounted(clearTimer)

  if (reducedMotion) {
    watch(reducedMotion, () => start())
  }

  return { displayed, phraseIndex }
}
