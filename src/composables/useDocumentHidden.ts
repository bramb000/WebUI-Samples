import { onMounted, onUnmounted, ref } from 'vue'

/** Reactive `document.hidden` — pauses RAF/WebGL when tab is in background. */
export function useDocumentHidden() {
  const hidden = ref(typeof document !== 'undefined' ? document.hidden : false)

  function sync() {
    hidden.value = document.hidden
  }

  onMounted(() => {
    sync()
    document.addEventListener('visibilitychange', sync)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', sync)
  })

  return hidden
}
