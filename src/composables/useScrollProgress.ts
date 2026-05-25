import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export type ScrollProgressOptions = {
  /**
   * Sticky `top` offset in px (e.g. nav height). Progress stays 0 until the track
   * has pinned and the user scrolls past this inset — avoids animation before lock.
   */
  pinTop?: number
}

/**
 * Normalised scroll progress (0–1) through a tall track with a sticky child.
 * Counts only scroll after the track has pinned at `pinTop`.
 */
export function useScrollProgress(
  trackRef: Ref<HTMLElement | null>,
  options: ScrollProgressOptions = {},
) {
  const progress = ref(0)
  let rafId = 0
  const pinTop = options.pinTop ?? 0

  const update = () => {
    const track = trackRef.value
    if (!track) {
      progress.value = 0
      return
    }
    const rect = track.getBoundingClientRect()
    const viewportH = window.visualViewport?.height ?? window.innerHeight
    const scrollable = track.offsetHeight - viewportH
    if (scrollable <= 0) {
      progress.value = 0
      return
    }
    const scrolledPastPin = Math.max(0, -rect.top - pinTop)
    const raw = scrolledPastPin / scrollable
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
