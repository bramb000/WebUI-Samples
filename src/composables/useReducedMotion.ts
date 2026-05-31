import { onMounted, onUnmounted, ref } from 'vue'

function readReducedMotionPreference(): boolean {
  if (typeof window === 'undefined')
    return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Site-wide `prefers-reduced-motion: reduce` (sync on client, then live updates). */
export function useReducedMotion() {
  const reduced = ref(readReducedMotionPreference())
  let mq: MediaQueryList | null = null

  const sync = () => {
    reduced.value = mq?.matches ?? readReducedMotionPreference()
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    mq.addEventListener('change', sync)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', sync)
  })

  return reduced
}
