import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

export const NAV_SCROLL_REFRESH_KEY = Symbol('navScrollRefresh')

const SCROLL_HIDE_THRESHOLD_PX = 12
const WORK_SCROLL_ROOT_SELECTORS = '#roster-pane, .dl-embedded'

function isWorkSelectRoute(path: string): boolean {
  return path === '/work'
}

function readScrollTop(path: string): number {
  if (isWorkSelectRoute(path)) {
    let top = 0
    for (const el of document.querySelectorAll(WORK_SCROLL_ROOT_SELECTORS)) {
      top = Math.max(top, (el as HTMLElement).scrollTop)
    }
    return top
  }
  return window.scrollY || document.documentElement.scrollTop
}

/**
 * Hides the fixed nav when the user scrolls away from the top.
 * On `/work`, the nav stays visible (pane scroll does not trigger auto-hide).
 */
export function useNavAutoHide(options: { enabled?: Ref<boolean> } = {}) {
  const route = useRoute()
  const scrolledAway = ref(false)
  const boundRoots = new Set<HTMLElement>()
  let rafId = 0
  let bindRetryTimer = 0

  const update = () => {
    if (options.enabled?.value === false) {
      scrolledAway.value = false
      return
    }
    // Work page scrolls inside panes; keep the nav always visible there.
    if (isWorkSelectRoute(route.path)) {
      scrolledAway.value = false
      return
    }
    scrolledAway.value = readScrollTop(route.path) > SCROLL_HIDE_THRESHOLD_PX
  }

  const onScroll = () => {
    if (rafId) return
    rafId = requestAnimationFrame(() => {
      rafId = 0
      update()
    })
  }

  function unbindRoots() {
    for (const el of boundRoots) {
      el.removeEventListener('scroll', onScroll)
    }
    boundRoots.clear()
  }

  function bindWorkScrollRoots() {
    if (!isWorkSelectRoute(route.path)) {
      unbindRoots()
      return
    }
    for (const el of document.querySelectorAll(WORK_SCROLL_ROOT_SELECTORS)) {
      if (el instanceof HTMLElement && !boundRoots.has(el)) {
        el.addEventListener('scroll', onScroll, { passive: true })
        boundRoots.add(el)
      }
    }
  }

  function clearBindRetry() {
    if (bindRetryTimer) {
      window.clearTimeout(bindRetryTimer)
      bindRetryTimer = 0
    }
  }

  /** Re-attach when `/work` panes mount (e.g. embedded detail after project pick). */
  function refresh() {
    if (!isWorkSelectRoute(route.path)) return
    bindWorkScrollRoots()
    update()
  }

  function scheduleWorkRootBinding() {
    clearBindRetry()
    if (!isWorkSelectRoute(route.path)) {
      unbindRoots()
      return
    }

    let attempts = 0
    const tryBind = () => {
      bindWorkScrollRoots()
      update()
      attempts += 1
      const rosterReady = document.querySelector('#roster-pane') instanceof HTMLElement
      if (attempts < 24 && !rosterReady) {
        bindRetryTimer = window.setTimeout(tryBind, 50)
      }
    }
    tryBind()
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    scheduleWorkRootBinding()
    update()
  })

  watch(
    () => route.path,
    () => {
      scrolledAway.value = false
      scheduleWorkRootBinding()
      requestAnimationFrame(update)
    },
  )

  watch(
    () => options.enabled?.value,
    () => update(),
  )

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    clearBindRetry()
    unbindRoots()
    if (rafId) cancelAnimationFrame(rafId)
  })

  return { scrolledAway, update, refresh }
}
