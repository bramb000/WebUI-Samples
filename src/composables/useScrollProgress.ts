import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type ScrollProgressOptions = {
  /** Extra viewport heights of scroll distance (default: track height − 1vh). */
  trackRef: Ref<HTMLElement | null>
}

/**
 * Normalised scroll progress (0–1) through a tall track with a sticky child.
 * progress = (scrollY − trackTop) / (trackHeight − viewportHeight)
 */
export function useScrollProgress(trackRef: Ref<HTMLElement | null>) {
  const progress = ref(0)
  let rafId = 0

  const update = () => {
    const track = trackRef.value
    if (!track) {
      progress.value = 0
      return
    }
    const rect = track.getBoundingClientRect()
    const trackTop = window.scrollY + rect.top
    const scrollable = track.offsetHeight - window.innerHeight
    if (scrollable <= 0) {
      progress.value = 0
      return
    }
    const raw = (window.scrollY - trackTop) / scrollable
    progress.value = Math.max(0, Math.min(1, raw))
  }

  const onScroll = () => {
    if (rafId)
      return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      update()
    })
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId)
      cancelAnimationFrame(rafId)
  })

  return { progress, update }
}
