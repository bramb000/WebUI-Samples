import { onMounted, onUnmounted, ref } from 'vue'

/** Site-wide `prefers-reduced-motion: reduce` (SSR-safe default: false). */
export function useReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList | null = null

  const sync = () => {
    reduced.value = mq?.matches ?? false
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
