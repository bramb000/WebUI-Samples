import { onMounted, onUnmounted, ref } from 'vue'

export function useCaseLightbox() {
  const isOpen = ref(false)

  function open() {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  function close() {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && isOpen.value)
      close()
  }

  onMounted(() => window.addEventListener('keydown', onKeydown))
  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    if (isOpen.value)
      document.body.style.overflow = ''
  })

  return { isOpen, open, close }
}
