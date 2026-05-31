<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import CasePencilChip from './CasePencilChip.vue'

const props = defineProps<{
  open: boolean
  caption?: string
  lightboxBadge?: string
  /** Primary label for the dialog — typically the image or video alt text. */
  imageLabel?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const overlayRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
let previouslyFocused: HTMLElement | null = null

const dialogLabel = computed(() => props.caption || props.imageLabel || 'Media preview')

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    ),
  ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.open)
    return

  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
    return
  }

  if (e.key !== 'Tab' || !overlayRef.value)
    return

  const focusable = getFocusableElements(overlayRef.value)
  if (focusable.length === 0)
    return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  }
  else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (isOpen) {
      previouslyFocused = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
      await nextTick()
      closeButtonRef.value?.focus()
    }
    else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
      previouslyFocused = null
    }
  },
)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="open"
        ref="overlayRef"
        class="lightbox-overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="dialogLabel"
        @click.self="emit('close')"
      >
        <button
          ref="closeButtonRef"
          class="lightbox-close"
          type="button"
          aria-label="Close lightbox"
          @click="emit('close')"
        >
          ✕
        </button>

        <div class="lightbox-content" @click.self="emit('close')">
          <CasePencilChip
            v-if="lightboxBadge"
            :label="lightboxBadge"
            tone="on-dark"
            detached
          />
          <slot />
          <p v-if="caption" class="lightbox-caption type-case-caption">
            {{ caption }}
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 2rem;
}

.lightbox-close {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  font-weight: 700;
  color: var(--text-on-tint);
  background: color-mix(in srgb, var(--text-on-tint) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-on-tint) 28%, transparent);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    background 0.2s var(--ease-te-snap),
    border-color 0.2s var(--ease-te-snap);
  z-index: 10000;
}

.lightbox-close:hover {
  background: color-mix(in srgb, var(--text-on-tint) 24%, transparent);
  border-color: color-mix(in srgb, var(--text-on-tint) 45%, transparent);
}

.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 90vw;
  max-height: 90vh;
}

.lightbox-caption {
  color: var(--text-on-tint-muted);
  text-align: center;
  max-width: 600px;
  margin: 0;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
