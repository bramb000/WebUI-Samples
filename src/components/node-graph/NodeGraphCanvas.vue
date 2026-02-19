<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useNodeGraph, type ExamplesData } from '../../composables/useNodeGraph'
import { getPinRelativePos } from '../../composables/useNodeGraph'
import GraphNode from './GraphNode.vue'
import GraphWire from './GraphWire.vue'
import ExamplesModal from './ExamplesModal.vue'

const {
  nodes,
  connections,
  dragState,
  wireDrag,
  executionResult,
  isRunning,
  executionError,
  startNodeDrag,
  onNodeDrag,
  endNodeDrag,
  startWireDrag,
  onWireDrag,
  endWireDrag,
  removeConnection,
  updateNodeValue,
  evaluate,
} = useNodeGraph()

// ─── Theme ─────────────────────────────────────────────────────────

const props = withDefaults(defineProps<{
  theme?: 'light' | 'dark'
}>(), {
  theme: 'light'
})

// ─── Theme ─────────────────────────────────────────────────────────

const theme = ref<'light' | 'dark'>(props.theme)

// Sync with prop change (for Storybook controls)
import { watch } from 'vue'
watch(() => props.theme, (newVal) => {
  theme.value = newVal
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// ─── Canvas panning (middle mouse button) ──────────────────────────

const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStartX = ref(0)
const panStartY = ref(0)

// ─── Canvas zoom (scroll wheel) ────────────────────────────────────

const scale = ref(1)
const MIN_SCALE = 0.25
const MAX_SCALE = 3

function onCanvasWheel(event: WheelEvent) {
  event.preventDefault()

  // Zoom factor — smaller delta for smoother feel
  const zoomIntensity = 0.001
  const delta = -event.deltaY * zoomIntensity
  const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * (1 + delta)))

  if (newScale === scale.value) return

  // Get the canvas element bounds
  const canvas = (event.currentTarget as HTMLElement)
  const rect = canvas.getBoundingClientRect()

  // Cursor position relative to the canvas element
  const cursorX = event.clientX - rect.left
  const cursorY = event.clientY - rect.top

  // The world-space point under the cursor before zoom:
  //   worldX = (cursorX - panX) / oldScale
  // After zoom we want the same world point under cursor:
  //   cursorX = worldX * newScale + newPanX
  // Solving: newPanX = cursorX - (cursorX - panX) / oldScale * newScale
  const ratio = newScale / scale.value
  panX.value = cursorX - (cursorX - panX.value) * ratio
  panY.value = cursorY - (cursorY - panY.value) * ratio
  scale.value = newScale
}

function onCanvasMouseDown(event: MouseEvent) {
  // Middle mouse button (button === 1)
  if (event.button === 1) {
    event.preventDefault()
    isPanning.value = true
    panStartX.value = event.clientX - panX.value
    panStartY.value = event.clientY - panY.value
  }
}

function onCanvasContextMenu(event: MouseEvent) {
  // Prevent context menu from middle-click on some browsers
  if (isPanning.value) {
    event.preventDefault()
  }
}

// ─── Examples modal ────────────────────────────────────────────────

const examplesModalData = ref<ExamplesData | null>(null)

function openExamples(nodeId: string) {
  const node = nodes.value.find(n => n.id === nodeId)
  if (node?.examplesData) {
    examplesModalData.value = node.examplesData
  }
}

function closeExamples() {
  examplesModalData.value = null
}

// ─── Mouse event handlers ──────────────────────────────────────────

function onCanvasMouseMove(event: MouseEvent) {
  if (isPanning.value) {
    panX.value = event.clientX - panStartX.value
    panY.value = event.clientY - panStartY.value
    return
  }
  if (dragState.active) {
    onNodeDrag(event.clientX, event.clientY)
  }
  if (wireDrag.active) {
    // Convert to local coordinates relative to the canvas container
    // CRITICAL FIX: Do not use event.currentTarget because it might be 'window' (from global listener)
    const canvas = document.querySelector('.node-graph-canvas') as HTMLElement
    if (canvas) {
      const rect = canvas.getBoundingClientRect()
      onWireDrag(event.clientX - rect.left, event.clientY - rect.top)
    }
  }
}

function onCanvasMouseUp(event: MouseEvent) {
  if (isPanning.value && event.button === 1) {
    isPanning.value = false
    return
  }
  if (dragState.active) {
    endNodeDrag()
  }
  if (wireDrag.active) {
    const target = event.target as HTMLElement
    const pinEl = target.closest('[data-pin-id]') as HTMLElement | null
    if (pinEl && pinEl.dataset.pinDir === 'input') {
      const nodeEl = pinEl.closest('[data-node-id]') as HTMLElement | null
      if (nodeEl) {
        endWireDrag(nodeEl.dataset.nodeId, pinEl.dataset.pinId)
        return
      }
    }
    endWireDrag()
  }
}

function handleStartDrag(nodeId: string, mouseX: number, mouseY: number) {
  startNodeDrag(nodeId, mouseX, mouseY)
}

function handleStartWireDrag(nodeId: string, pinId: string, mouseX: number, mouseY: number) {
  // mouseX/Y are client coordinates from the event
  // We need to convert them to local coordinates relative to the canvas container
  // We can find the canvas element... or easier:
  // The child component emits global clientX/Y.
  // We can get the canvas bounding rect here.
  const canvas = document.querySelector('.node-graph-canvas')
  if (canvas) {
      const rect = canvas.getBoundingClientRect()
      startWireDrag(nodeId, pinId, mouseX - rect.left, mouseY - rect.top)
  } else {
      // Fallback if canvas not found (shouldn't happen)
      startWireDrag(nodeId, pinId, mouseX, mouseY)
  }
}

function handlePinDrop(nodeId: string, pinId: string) {
  if (wireDrag.active) {
    endWireDrag(nodeId, pinId)
  }
}

function handleDisconnect(connectionId: string) {
  removeConnection(connectionId)
  executionResult.value = null
}

function handleUpdateValue(nodeId: string, value: number) {
  updateNodeValue(nodeId, value)
  executionResult.value = null
}

// ─── Wire drag preview path ────────────────────────────────────────

const dragWirePath = computed(() => {
  if (!wireDrag.active || !wireDrag.fromNodeId || !wireDrag.fromPinId) return ''

  const node = nodes.value.find(n => n.id === wireDrag.fromNodeId)
  if (!node) return ''

  const fromPinOffset = getPinRelativePos(node, wireDrag.fromPinId)
  if (!fromPinOffset) return ''

  // Start point (World Space) - simple node pos + pin offset
  const x1 = node.position.x + fromPinOffset.x
  const y1 = node.position.y + fromPinOffset.y

  // End point (World Space) - map mouse (Screen) to World
  // We use wireDrag.mouseX/Y which are updated in onCanvasMouseMove relative to canvas
  const x2 = (wireDrag.mouseX - panX.value) / scale.value
  const y2 = (wireDrag.mouseY - panY.value) / scale.value

  const dx = Math.abs(x2 - x1) * 0.5

  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
})

// ─── Run execution ─────────────────────────────────────────────────

function runGraph() {
  evaluate()
}

// ─── Global listeners ──────────────────────────────────────────────

onMounted(() => {
  window.addEventListener('mousemove', onCanvasMouseMove)
  window.addEventListener('mouseup', onCanvasMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onCanvasMouseMove)
  window.removeEventListener('mouseup', onCanvasMouseUp)
})
</script>

<template>
  <div
    class="node-graph-canvas"
    :class="{ 'is-panning': isPanning }"
    :data-theme="theme"
    @mousedown="onCanvasMouseDown"
    @contextmenu="onCanvasContextMenu"
    @wheel.prevent="onCanvasWheel"
  >
    <!-- Dot grid background — moves with pan & scales with zoom -->
    <svg class="canvas-grid" width="100%" height="100%" aria-hidden="true">
      <defs>
        <pattern
          id="dot-pattern"
          :x="panX % (24 * scale)"
          :y="panY % (24 * scale)"
          :width="24 * scale"
          :height="24 * scale"
          patternUnits="userSpaceOnUse"
        >
          <circle :cx="12 * scale" :cy="12 * scale" :r="Math.max(0.5, 1 * scale)" fill="var(--grid-dot)"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)"/>
    </svg>

    <!-- Toolbar -->
    <div class="canvas-toolbar" role="toolbar" aria-label="Node graph controls">
      <div class="toolbar-left">
        <div class="toolbar-title">
          <svg width="20" height="20" viewBox="0 0 20 20" class="toolbar-icon" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" rx="1" fill="#4F8EEE"/>
            <rect x="12" y="2" width="6" height="6" rx="1" fill="#EE4F94"/>
            <rect x="2" y="12" width="6" height="6" rx="1" fill="#EE4F94"/>
            <rect x="12" y="12" width="6" height="6" rx="1" fill="#4F8EEE"/>
          </svg>
          <span>Node Graph</span>
        </div>
      </div>

      <div class="toolbar-actions">
        <!-- Theme toggle -->
        <button
          class="theme-toggle"
          @click="toggleTheme"
          :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
        >
          <svg v-if="theme === 'light'" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <circle cx="9" cy="9" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/>
            <line v-for="i in 8" :key="i"
              :x1="9 + 6.5 * Math.cos((i * 45 - 90) * Math.PI / 180)"
              :y1="9 + 6.5 * Math.sin((i * 45 - 90) * Math.PI / 180)"
              :x2="9 + 8 * Math.cos((i * 45 - 90) * Math.PI / 180)"
              :y2="9 + 8 * Math.sin((i * 45 - 90) * Math.PI / 180)"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M15 10.5a6 6 0 01-7.5-7.5A6 6 0 1015 10.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <!-- Run button -->
        <button
          class="run-button"
          :class="{ running: isRunning }"
          @click="runGraph"
          :disabled="isRunning"
          :aria-label="isRunning ? 'Graph is running' : 'Run the node graph'"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <polygon points="2,1 12,7 2,13" fill="currentColor"/>
          </svg>
          {{ isRunning ? 'Running...' : 'Run' }}
        </button>

        <!-- Result / Error -->
        <div
          v-if="executionResult !== null"
          class="result-badge"
          role="status"
          aria-live="polite"
        >
          Result: <strong>{{ executionResult }}</strong>
        </div>
        <div
          v-if="executionError"
          class="error-badge"
          role="alert"
          aria-live="assertive"
        >
          ⚠ {{ executionError }}
        </div>
      </div>
    </div>

    <!-- Content layer — pans and zooms -->
    <div class="canvas-content" :style="{ transform: `translate(${panX}px, ${panY}px) scale(${scale})` }">
      <!-- SVG layer for wires -->
      <svg class="wire-layer" aria-label="Node connections">
        <GraphWire
          v-for="conn in connections"
          :key="conn.id"
          :connection="conn"
          :nodes="nodes"
          :is-running="isRunning"
          @disconnect="handleDisconnect"
        />
      </svg>

      <!-- Node layer -->
      <GraphNode
        v-for="node in nodes"
        :key="node.id"
        :node="node"
        :connections="connections"
        :is-running="isRunning"
      @start-drag="handleStartDrag"
      @start-wire-drag="handleStartWireDrag"
      @pin-drop="handlePinDrop"
      @update-value="handleUpdateValue"
        @open-examples="openExamples"
      />
      <!-- Wire drag preview (World Space) -->
      <svg v-if="wireDrag.active && dragWirePath" class="wire-drag-layer">
        <path
          :d="dragWirePath"
          fill="none"
          stroke="var(--wire-color)"
          stroke-width="2"
          stroke-dasharray="6 3"
        />
      </svg>
    </div>

    <!-- Instructions hint -->
    <div class="canvas-hint" aria-hidden="true">
      Drag headers to move · Drag output pins to connect · Hover wires to disconnect · Click "More info" for details
    </div>

    <!-- Examples modal -->
    <ExamplesModal
      v-if="examplesModalData"
      :data="examplesModalData"
      @close="closeExamples"
    />
  </div>
</template>

<style scoped>
/* ─── Theme variables ─── */
.node-graph-canvas[data-theme="light"] {
  --canvas-bg: #F0F0F5;
  --node-body: #2C2C2C;
  --wire-color: #AAAAAA;
  --wire-hover: #888888;
  --grid-dot: rgba(0, 0, 0, 0.06);
  --toolbar-bg: rgba(255, 255, 255, 0.95);
  --toolbar-text: #1A1A2E;
  --toolbar-border: rgba(0, 0, 0, 0.1);
  --input-border: #888888;
  --focus-ring: #4F8EEE;
  --modal-bg: #2C2C2C;
  --modal-backdrop: rgba(0, 0, 0, 0.5);
  --hint-bg: rgba(0, 0, 0, 0.06);
  --hint-text: rgba(0, 0, 0, 0.45);
  --hint-border: rgba(0, 0, 0, 0.06);
  --run-btn-bg: #16A34A;
  --run-btn-hover: #15803D;
  --run-btn-shadow: rgba(22, 163, 74, 0.25);
  --result-bg: rgba(22, 163, 74, 0.1);
  --result-color: #16A34A;
  --result-border: rgba(22, 163, 74, 0.2);
  --error-bg: rgba(220, 38, 38, 0.08);
  --error-color: #DC2626;
  --error-border: rgba(220, 38, 38, 0.2);
  --toggle-bg: rgba(0, 0, 0, 0.06);
  --toggle-hover: rgba(0, 0, 0, 0.1);
  --toggle-color: #555;
}

.node-graph-canvas[data-theme="dark"] {
  --canvas-bg: #1A1A2E;
  --node-body: #262626;
  --wire-color: #666666;
  --wire-hover: #999999;
  --grid-dot: rgba(255, 255, 255, 0.08);
  --toolbar-bg: rgba(22, 22, 40, 0.95);
  --toolbar-text: #E8E8F0;
  --toolbar-border: rgba(255, 255, 255, 0.08);
  --input-border: #9C9A9A;
  --focus-ring: #6BA3FF;
  --modal-bg: #363636;
  --modal-backdrop: rgba(0, 0, 0, 0.6);
  --hint-bg: rgba(22, 22, 40, 0.85);
  --hint-text: rgba(255, 255, 255, 0.45);
  --hint-border: rgba(255, 255, 255, 0.06);
  --run-btn-bg: #22C55E;
  --run-btn-hover: #16A34A;
  --run-btn-shadow: rgba(34, 197, 94, 0.3);
  --result-bg: rgba(0, 255, 136, 0.1);
  --result-color: #4ADE80;
  --result-border: rgba(0, 255, 136, 0.15);
  --error-bg: rgba(255, 68, 68, 0.1);
  --error-color: #F87171;
  --error-border: rgba(255, 68, 68, 0.15);
  --toggle-bg: rgba(255, 255, 255, 0.08);
  --toggle-hover: rgba(255, 255, 255, 0.15);
  --toggle-color: #CCC;
}

/* ─── Canvas ─── */
.node-graph-canvas {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: var(--canvas-bg);
  overflow: hidden;
  font-family: 'Inter', sans-serif;
}

.node-graph-canvas.is-panning {
  cursor: grabbing;
}

.canvas-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Pan-able + zoomable content wrapper for nodes + wires */
.canvas-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-origin: 0 0;
  will-change: transform;
}

/* Wire drag preview stays in screen space */
.wire-drag-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 50;
  overflow: visible; /* CRITICAL: Allow drawing outside the viewport-sized box */
}

.wire-layer {
  overflow: visible; /* CRITICAL: Allow drawing outside */
}

/* ─── Toolbar ─── */
.canvas-toolbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: var(--toolbar-bg);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--toolbar-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.toolbar-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--toolbar-text);
  letter-spacing: 0.3px;
}

.toolbar-icon {
  opacity: 0.85;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* ─── Theme toggle ─── */
.theme-toggle {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--toggle-bg);
  border: none;
  border-radius: 8px;
  color: var(--toggle-color);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.theme-toggle:hover {
  background: var(--toggle-hover);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

/* ─── Run button ─── */
.run-button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--run-btn-bg);
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: all 0.2s ease;
  letter-spacing: 0.3px;
}

.run-button:hover:not(:disabled) {
  background: var(--run-btn-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--run-btn-shadow);
}

.run-button:active:not(:disabled) {
  transform: translateY(0);
}

.run-button:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}

.run-button.running {
  background: #777;
  cursor: wait;
}

.run-button:disabled {
  opacity: 0.7;
}

/* ─── Result / Error badges ─── */
.result-badge {
  background: var(--result-bg);
  color: var(--result-color);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid var(--result-border);
  animation: fadeInBadge 0.3s ease;
}

.result-badge strong {
  font-weight: 700;
  margin-left: 2px;
}

.error-badge {
  background: var(--error-bg);
  color: var(--error-color);
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  border: 1px solid var(--error-border);
  animation: fadeInBadge 0.3s ease;
}

@keyframes fadeInBadge {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── Wire layer ─── */
.wire-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.wire-layer :deep(g) {
  pointer-events: auto;
}

/* ─── Hint ─── */
.canvas-hint {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--hint-bg);
  backdrop-filter: blur(8px);
  color: var(--hint-text);
  font-size: 12px;
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid var(--hint-border);
  z-index: 100;
  white-space: nowrap;
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .result-badge,
  .error-badge {
    animation: none;
  }
  .run-button,
  .theme-toggle {
    transition: none;
  }
}
</style>
