import { onMounted, onUnmounted, ref } from 'vue'

/** Matches Tailwind `md` — viewport below 768px is treated as mobile. */
const MOBILE_MAX_WIDTH_PX = 767

export function useIsMobile() {
  const query = `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`
  const isMobile = ref(
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  let mq: MediaQueryList | null = null

  const sync = () => {
    isMobile.value = mq?.matches ?? false
  }

  onMounted(() => {
    mq = window.matchMedia(query)
    sync()
    mq.addEventListener('change', sync)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', sync)
  })

  return isMobile
}
