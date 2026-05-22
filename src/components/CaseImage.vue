<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import CasePencilChip from './CasePencilChip.vue'

const props = defineProps<{
  src: string
  alt: string
  caption?: string
  /** Shown in the lightbox (e.g. Before / After on comparison images). */
  lightboxBadge?: string
  /** Additional classes on the <img> element */
  imgClass?: string
  /** First visible image on a route — prioritize LCP */
  priority?: boolean
}>()

const isOpen = ref(false);

function open() {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
}

function close() {
  isOpen.value = false;
  document.body.style.overflow = '';
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    close();
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <figure class="case-image space-y-2">
    <img
      :src="props.src"
      :alt="props.alt"
      :loading="props.priority ? 'eager' : 'lazy'"
      :fetchpriority="props.priority ? 'high' : 'auto'"
      decoding="async"
      :class="[
        'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
        props.imgClass,
      ]"
      @click="open"
    />
    <figcaption
      v-if="props.caption"
      class="type-case-caption text-center"
    >
      {{ props.caption }}
    </figcaption>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="isOpen"
          class="lightbox-overlay"
          @click.self="close"
        >
          <button
            class="lightbox-close"
            aria-label="Close lightbox"
            @click="close"
          >
            ✕
          </button>

          <div class="lightbox-content" @click.self="close">
            <CasePencilChip
              v-if="props.lightboxBadge"
              :label="props.lightboxBadge"
              tone="on-dark"
              detached
            />
            <img
              :src="props.src"
              :alt="props.alt"
              class="lightbox-image"
            />
            <p v-if="props.caption" class="lightbox-caption type-case-caption">
              {{ props.caption }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </figure>
</template>

<style scoped>
/* ─── Overlay ─── */
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

/* ─── Close button ─── */
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

/* ─── Content wrapper ─── */
.lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 90vw;
  max-height: 90vh;
}

/* ─── Image ─── */
.lightbox-image {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* ─── Caption ─── */
.lightbox-caption {
  color: var(--text-on-tint-muted);
  text-align: center;
  max-width: 600px;
  margin: 0;
}

/* ─── Transition ─── */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
