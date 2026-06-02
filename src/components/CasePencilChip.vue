<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCachedPencilFrameImage, PENCIL_DIVIDER_BLEED_PX, quantizePencilBakeDimensions } from '../vfx/pencilFrameBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

const props = withDefaults(
  defineProps<{
    label: string
    /** Lightbox / dark overlays — lighter label ink */
    tone?: 'default' | 'on-dark'
    /** Baked outside case study root (e.g. teleported lightbox) */
    detached?: boolean
  }>(),
  { tone: 'default', detached: false },
)

const chipRef = ref<HTMLElement | null>(null)

let resizeObserver: ResizeObserver | null = null
let rebakeTimer = 0

let detachedBlobUrl: string | null = null
let detachedBakeKey: string | null = null

function dataUrlToBlob(dataUrl: string): Blob {
  const [header = '', b64 = ''] = dataUrl.split(',')
  const mime = /data:([^;]+)/.exec(header)?.[1] ?? 'image/png'
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++)
    bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

function applyDetachedBake(dataUrl: string) {
  const el = chipRef.value
  if (!el)
    return
  if (detachedBlobUrl)
    URL.revokeObjectURL(detachedBlobUrl)
  detachedBlobUrl = URL.createObjectURL(dataUrlToBlob(dataUrl))
  el.classList.add('pencil-baked')
  el.style.setProperty('--pencil-frame-image', `url("${detachedBlobUrl}")`)
  el.style.setProperty('--pencil-bleed', `${PENCIL_DIVIDER_BLEED_PX}px`)
}

function clearDetachedBake() {
  const el = chipRef.value
  if (el) {
    el.classList.remove('pencil-baked')
    el.style.removeProperty('--pencil-frame-image')
    el.style.removeProperty('--pencil-bleed')
  }
  if (detachedBlobUrl) {
    URL.revokeObjectURL(detachedBlobUrl)
    detachedBlobUrl = null
  }
  detachedBakeKey = null
}

function rebakeDetached(attempt = 0) {
  const el = chipRef.value
  if (!el || !props.detached)
    return

  const r = el.getBoundingClientRect()
  if (r.width < 8 || r.height < 8) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeDetached(attempt + 1))
    return
  }

  const stroke = resolveCssColorToHex(el, 'var(--color-accent)', '#2f3339')
  const { widthCss, heightCss } = quantizePencilBakeDimensions(r.width, r.height, 'frame')
  const bakeKey = `chip-detached|${widthCss}|${heightCss}|${stroke}`
  if (detachedBakeKey === bakeKey && el.classList.contains('pencil-baked'))
    return

  const url = getCachedPencilFrameImage({
    widthCss,
    heightCss,
    strokeColorHex: stroke,
    fillColorHex: '#000000',
    variant: 'frame',
    frameShape: 'rect',
    frameStyle: 'regular',
    strokeOnly: true,
    bleedPx: PENCIL_DIVIDER_BLEED_PX,
    seed: 53,
  })

  if (!url) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakeDetached(attempt + 1))
    return
  }

  detachedBakeKey = bakeKey
  applyDetachedBake(url)
}

function scheduleRebake() {
  if (rebakeTimer)
    window.clearTimeout(rebakeTimer)
  rebakeTimer = window.setTimeout(() => {
    rebakeTimer = 0
    rebakeDetached()
  }, 100)
}

function startDetached() {
  rebakeDetached()
  const el = chipRef.value
  if (!el || resizeObserver)
    return
  resizeObserver = new ResizeObserver(scheduleRebake)
  resizeObserver.observe(el)
}

function stopDetached() {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (rebakeTimer) {
    window.clearTimeout(rebakeTimer)
    rebakeTimer = 0
  }
  clearDetachedBake()
}

onMounted(() => {
  if (props.detached)
    nextTick(startDetached)
})

watch(
  () => [props.label, props.detached] as const,
  () => {
    if (props.detached)
      scheduleRebake()
  },
)

onBeforeUnmount(stopDetached)
</script>

<template>
  <span
    ref="chipRef"
    class="case-pencil-chip"
    :class="{ 'case-pencil-chip--on-dark': tone === 'on-dark' }"
    :data-pencil-detached="detached ? '' : undefined"
  >
    {{ label }}
  </span>
</template>
