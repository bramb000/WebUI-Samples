<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import type { ExamplesData } from '../../composables/useNodeGraph'

const props = withDefaults(defineProps<{
  data: ExamplesData
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light'
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const modalRef = ref<HTMLElement | null>(null)
const closeButtonRef = ref<HTMLButtonElement | null>(null)

function onBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    emit('close')
  }
  // Focus trap
  if (event.key === 'Tab' && modalRef.value) {
    const focusable = modalRef.value.querySelectorAll<HTMLElement>(
      'button, [tabindex]:not([tabindex="-1"]), input, a[href]'
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  nextTick(() => {
    closeButtonRef.value?.focus()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      class="modal-backdrop"
      :data-theme="theme"
      @click="onBackdropClick"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'modal-title'"
    >
      <div class="modal-card" ref="modalRef">
        <!-- Close button -->
        <button
          ref="closeButtonRef"
          class="modal-close"
          @click="emit('close')"
          aria-label="Close examples dialog"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="13" y1="3" x2="3" y2="13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">{{ data.title }}</h2>
          <p class="modal-subtitle">{{ data.subtitle }}</p>
        </div>

        <!-- Syntax section -->
        <div class="modal-section">
          <h3 class="modal-section-title">Syntax</h3>
          <div class="modal-syntax-visual">
            <div class="syntax-placeholder" aria-label="Visual example of node connection syntax">
              <div class="syntax-node syntax-node--int" style="top: 10px; left: 10px;">
                <div class="sn-header sn-header--int">
                  <span class="sn-title">INT</span>
                  <span class="sn-sub">An integer</span>
                </div>
                <div class="sn-body">
                  <span class="sn-value">5</span>
                  <span class="sn-dot sn-dot--filled"></span>
                </div>
              </div>

              <div class="syntax-node syntax-node--op" :style="{ top: '10px', left: '180px' }">
                <div class="sn-header sn-header--op">
                  <span class="sn-title">{{ data.title }}</span>
                  <span class="sn-sub">{{ data.subtitle }}</span>
                </div>
                <!-- Exec row (visual fix) -->
                <div class="sn-exec-row">
                  <div class="sn-exec-pin sn-exec-pin--in">
                    <svg width="10" height="12" viewBox="0 0 12 14" aria-hidden="true">
                      <polygon points="1,1 11,7 1,13" />
                    </svg>
                  </div>
                  <div class="sn-exec-pin sn-exec-pin--out">
                    <svg width="10" height="12" viewBox="0 0 12 14" aria-hidden="true">
                      <polygon points="1,1 11,7 1,13" />
                    </svg>
                  </div>
                </div>
                <div class="sn-body sn-body--op">
                  <div class="sn-pin-row">
                    <div class="sn-pin-left">
                      <span class="sn-dot"></span>
                      <span class="sn-label">Number 1</span>
                    </div>
                    <div class="sn-pin-right">
                      <span class="sn-label">Result</span>
                      <span class="sn-dot"></span>
                    </div>
                  </div>
                  <div class="sn-pin-row">
                    <div class="sn-pin-left">
                      <span class="sn-dot"></span>
                      <span class="sn-label">Number 2</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="syntax-node syntax-node--int" style="top: 150px; left: 10px;">
                <div class="sn-header sn-header--int">
                  <span class="sn-title">INT</span>
                  <span class="sn-sub">An integer</span>
                </div>
                <div class="sn-body">
                  <span class="sn-value">5</span>
                  <span class="sn-dot sn-dot--filled"></span>
                </div>
              </div>

              <!-- Wire SVG -->
              <svg class="syntax-wires" width="100%" height="100%">
                <path d="M 130 50 C 155 50, 165 90, 190 90" fill="none" stroke="#AAA" stroke-width="2" stroke-linecap="round"/>
                <path d="M 130 192 C 155 192, 165 115, 190 115" fill="none" stroke="#AAA" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Notes section -->
        <div class="modal-section">
          <h3 class="modal-section-title">Notes</h3>
          <div class="modal-notes">
            <p v-for="(note, i) in data.notes" :key="i" class="modal-note">{{ note }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

/* ─── Theme Variables ─── */
.modal-backdrop[data-theme="light"] {
  --modal-bg: #FFFFFF;
  --modal-backdrop: rgba(0, 0, 0, 0.4);
  --modal-text: #1A1A2E;
  --modal-sub: rgba(0, 0, 0, 0.6);
  --visual-bg: rgba(0, 0, 0, 0.05); /* Light grey for syntax area */
  --node-body: #2C2C2C; /* Match graph nodes (dark bodies) */
  --node-text: #FFFFFF;
  --wire-color: #AAAAAA;
  --btn-close-bg: rgba(0, 0, 0, 0.05);
  --btn-close-color: rgba(0, 0, 0, 0.5);
  --btn-close-hover-bg: rgba(0, 0, 0, 0.1);
  --btn-close-hover-color: #000;
  --sn-value-border: #9C9A9A;
  --sn-exec-poly: rgba(255, 255, 255, 0.35); /* Pins on dark nodes */
}

.modal-backdrop[data-theme="dark"] {
  --modal-bg: #363636;
  --modal-backdrop: rgba(0, 0, 0, 0.55);
  --modal-text: #FFFFFF;
  --modal-sub: rgba(255, 255, 255, 0.7);
  --visual-bg: rgba(0, 0, 0, 0.2);
  --node-body: #262626;
  --node-text: #FFFFFF;
  --wire-color: #AAAAAA;
  --btn-close-bg: rgba(255, 255, 255, 0.08);
  --btn-close-color: rgba(255, 255, 255, 0.7);
  --btn-close-hover-bg: rgba(255, 255, 255, 0.15);
  --btn-close-hover-color: #FFFFFF;
  --sn-value-border: #9C9A9A;
  --sn-exec-poly: rgba(255, 255, 255, 0.35);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--modal-backdrop);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInBackdrop 0.2s ease;
  color: var(--modal-text); /* Global text color */
}

.modal-card {
  position: relative;
  background: var(--modal-bg);
  border-radius: 5px;
  padding: 24px;
  width: 658px;
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
  animation: slideUpModal 0.25s ease;
  font-family: 'Inter', sans-serif;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--btn-close-bg);
  border: none;
  border-radius: 4px;
  color: var(--btn-close-color);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.modal-close:hover {
  background: var(--btn-close-hover-bg);
  color: var(--btn-close-hover-color);
}

.modal-close:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 2px;
}

.modal-header {
  margin-bottom: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 400;
  color: var(--modal-text);
  margin: 0;
  line-height: 1.2;
}

.modal-subtitle {
  font-size: 12px;
  color: var(--modal-sub);
  margin: 6px 0 0;
}

.modal-section {
  margin-bottom: 24px;
}

.modal-section:last-child {
  margin-bottom: 0;
}

.modal-section-title {
  font-size: 20px;
  font-weight: 400;
  color: var(--modal-text);
  margin: 0 0 10px;
}

/* ─── Syntax Visual ─── */
.modal-syntax-visual {
  background: var(--visual-bg);
  border-radius: 4px;
  overflow: hidden;
}

.syntax-placeholder {
  position: relative;
  width: 100%;
  height: 260px;
  padding: 16px;
}

.syntax-wires {
  position: absolute;
  top: 16px;
  left: 16px;
  pointer-events: none;
}
/* Wires use stroke=currentColor via CSS or prop? The SVG uses hardcoded #AAA.
   Let's target path inside SVG or set stroke=current on SVG and use CSS var. */
.syntax-wires path {
  stroke: var(--wire-color);
}

.syntax-node {
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.syntax-node--int { width: 120px; }
.syntax-node--op { width: 220px; }

.sn-header {
  padding: 6px 8px;
}
.sn-header--int { background: #EE4F94; }
.sn-header--op { background: #4F8EEE; }

.sn-title {
  display: block;
  font-size: 12px;
  color: #FFFFFF; /* Available on both themes (headers are colored) */
  font-weight: 400;
}

.sn-sub {
  display: block;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
}

.sn-body {
  background: var(--node-body);
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.sn-body--op {
  flex-direction: column;
  gap: 4px;
}

.sn-value {
  font-size: 10px;
  color: var(--node-text);
  border: 1px solid var(--sn-value-border);
  border-radius: 3px;
  padding: 1px 6px;
}

.sn-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--sn-value-border);
  flex-shrink: 0;
}

.sn-dot--filled {
  background: var(--node-text);
  border-color: var(--node-text);
}

.sn-pin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.sn-pin-left,
.sn-pin-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sn-label {
  font-size: 10px;
  color: var(--node-text);
}

.sn-exec-row {
  background: var(--node-body);
  padding: 6px 8px 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 4px;
}

.sn-exec-pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 3px;
}

.sn-exec-pin svg polygon {
  fill: var(--sn-exec-poly);
}

/* ─── Notes ─── */
.modal-notes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-note {
  font-size: 12px;
  color: var(--modal-sub);
  margin: 0;
  line-height: 1.5;
}

/* ─── Animations ─── */
@keyframes fadeInBackdrop {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUpModal {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-card {
    animation: none;
  }
}
</style>
