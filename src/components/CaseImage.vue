<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  src: string;
  alt: string;
  caption?: string;
  /** Additional classes on the <img> element */
  imgClass?: string;
}>();

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
      :class="[
        'w-full h-auto rounded-xl cursor-zoom-in transition-transform duration-200 hover:scale-[1.01] hover:shadow-lg',
        props.imgClass,
      ]"
      @click="open"
    />
    <figcaption
      v-if="props.caption"
      class="text-sm font-sans text-center opacity-60"
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
            <img
              :src="props.src"
              :alt="props.alt"
              class="lightbox-image"
            />
            <p v-if="props.caption" class="lightbox-caption">
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
  font-size: 1.5rem;
  color: white;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10000;
}
.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.3);
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
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  text-align: center;
  max-width: 600px;
  line-height: 1.5;
  font-family: var(--font-sans, system-ui, sans-serif);
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
