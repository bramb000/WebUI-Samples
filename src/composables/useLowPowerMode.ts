import { onMounted, onUnmounted, ref } from 'vue'

/** Heuristic: save-data, few cores, or reduced motion → lighter effects. */
export function useLowPowerMode() {
  const lowPower = ref(false)
  let motionMq: MediaQueryList | null = null
  let saveMq: MediaQueryList | null = null

  const sync = () => {
    const cores = navigator.hardwareConcurrency ?? 8
    const saveData = saveMq?.matches ?? false
    const reducedMotion = motionMq?.matches ?? false
    lowPower.value = saveData || reducedMotion || cores <= 4
  }

  onMounted(() => {
    motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    saveMq = window.matchMedia('(prefers-reduced-data: reduce)')
    sync()
    motionMq.addEventListener('change', sync)
    saveMq.addEventListener('change', sync)
  })

  onUnmounted(() => {
    motionMq?.removeEventListener('change', sync)
    saveMq?.removeEventListener('change', sync)
  })

  return lowPower
}
