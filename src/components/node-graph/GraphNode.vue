<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GraphNodeData, Connection } from '../../composables/useNodeGraph'
import { NODE_COLORS } from '../../composables/useNodeGraph'
import NodeInfoPanel from './NodeInfoPanel.vue'

const props = defineProps<{
  node: GraphNodeData
  connections: Connection[]
  isRunning: boolean
}>()

const emit = defineEmits<{
  (e: 'startDrag', nodeId: string, mouseX: number, mouseY: number): void
  (e: 'startWireDrag', nodeId: string, pinId: string, mouseX: number, mouseY: number): void
  (e: 'pinDrop', nodeId: string, pinId: string): void
  (e: 'updateValue', nodeId: string, value: number): void
  (e: 'openExamples', nodeId: string): void
}>()

const moreInfoOpen = ref(false)

const headerColor = computed(() => NODE_COLORS[props.node.type])
const isIntNode = computed(() => props.node.type === 'integer')
const nodeWidth = computed(() => isIntNode.value ? 163 : 369)

function isPinConnected(pinId: string): boolean {
  return props.connections.some(
    (c) => (c.fromPinId === pinId && c.fromNodeId === props.node.id) ||
           (c.toPinId === pinId && c.toNodeId === props.node.id)
  )
}

function onHeaderMouseDown(event: MouseEvent) {
  event.preventDefault()
  emit('startDrag', props.node.id, event.clientX, event.clientY)
}

function onOutputPinMouseDown(pinId: string, event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  emit('startWireDrag', props.node.id, pinId, event.clientX, event.clientY)
}

function onInputPinMouseUp(pinId: string) {
  emit('pinDrop', props.node.id, pinId)
}

function onValueInput(event: Event) {
  const val = parseInt((event.target as HTMLInputElement).value)
  if (!isNaN(val)) {
    emit('updateValue', props.node.id, val)
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && moreInfoOpen.value) {
    moreInfoOpen.value = false
    event.stopPropagation()
  }
}

function handleSeeExamples() {
  emit('openExamples', props.node.id)
}

const nodeAriaLabel = computed(() => {
  if (isIntNode.value) {
    return `${props.node.label} node, value ${props.node.value}`
  }
  return `${props.node.label} node: ${props.node.shortDescription}`
})
</script>

<template>
  <div
    class="graph-node"
    :class="{
      'graph-node--compact': isIntNode,
      'graph-node--wide': !isIntNode,
      'graph-node--running': isRunning
    }"
    :style="{
      left: node.position.x + 'px',
      top: node.position.y + 'px',
      width: nodeWidth + 'px',
      '--header-color': headerColor
    }"
    :data-node-id="node.id"
    :data-node-type="node.type"
    role="group"
    :aria-label="nodeAriaLabel"
    tabindex="0"
    @keydown="onKeyDown"
  >
    <!-- Header -->
    <div
      class="node-header"
      @mousedown="onHeaderMouseDown"
      role="button"
      :aria-label="`Drag to move ${node.label} node`"
    >
      <span class="node-title">{{ node.label }}</span>
      <span class="node-subtitle">{{ node.shortDescription }}</span>
    </div>

    <!-- Body -->
    <div class="node-body">

      <!-- ══════ Exec pin row (ADD/SUB only) ══════ -->
      <div v-if="!isIntNode" class="exec-row">
        <!-- Exec input (left) -->
        <div
          v-for="pin in node.execInputs"
          :key="pin.id"
          class="exec-pin exec-pin--in"
          :class="{ connected: isPinConnected(pin.id) }"
          :data-pin-id="pin.id"
          :data-pin-dir="'input'"
          @mouseup="onInputPinMouseUp(pin.id)"
          role="button"
          :aria-label="`Execution input${isPinConnected(pin.id) ? ', connected' : ''}`"
          tabindex="0"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <polygon points="1,1 11,7 1,13" fill="currentColor"/>
          </svg>
        </div>

        <!-- Exec output (right) -->
        <div
          v-for="pin in node.execOutputs"
          :key="pin.id"
          class="exec-pin exec-pin--out"
          :class="{ connected: isPinConnected(pin.id) }"
          :data-pin-id="pin.id"
          :data-pin-dir="'output'"
          @mousedown="onOutputPinMouseDown(pin.id, $event)"
          role="button"
          :aria-label="`Execution output${isPinConnected(pin.id) ? ', connected' : ''}`"
          tabindex="0"
        >
          <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true">
            <polygon points="1,1 11,7 1,13" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- ══════ INT node body ══════ -->
      <div v-if="isIntNode" class="int-row">
        <input
          type="number"
          class="int-value-input"
          :value="node.value"
          @input="onValueInput"
          :aria-label="`Value for ${node.label} node`"
        />
        <div
          v-if="node.outputs[0]"
          class="data-pin data-pin--output"
          :class="{ connected: isPinConnected(node.outputs[0].id) }"
          :data-pin-id="node.outputs[0].id"
          :data-pin-dir="'output'"
          @mousedown="onOutputPinMouseDown(node.outputs[0].id, $event)"
          role="button"
          :aria-label="`Output pin${isPinConnected(node.outputs[0].id) ? ', connected' : ''}`"
          tabindex="0"
        />
      </div>

      <!-- ══════ ADD/SUB data pin rows ══════ -->
      <template v-if="!isIntNode">
        <div
          v-for="(input, index) in node.inputs"
          :key="input.id"
          class="pin-row"
        >
          <!-- Left: input pin + label -->
          <div class="pin-side pin-side--left">
            <div
              class="data-pin data-pin--input"
              :class="{ connected: isPinConnected(input.id) }"
              :data-pin-id="input.id"
              :data-pin-dir="'input'"
              @mouseup="onInputPinMouseUp(input.id)"
              role="button"
              :aria-label="`${input.label} input${isPinConnected(input.id) ? ', connected' : ''}`"
              tabindex="0"
            />
            <span class="pin-label">{{ input.label }}</span>
          </div>

          <!-- Right: output pin + label (first row only) -->
          <div v-if="index === 0 && node.outputs[0]" class="pin-side pin-side--right">
            <span class="pin-label">{{ node.outputs[0].label }}</span>
            <div
              class="data-pin data-pin--output"
              :class="{ connected: isPinConnected(node.outputs[0].id) }"
              :data-pin-id="node.outputs[0].id"
              :data-pin-dir="'output'"
              @mousedown="onOutputPinMouseDown(node.outputs[0].id, $event)"
              role="button"
              :aria-label="`${node.outputs[0].label} output${isPinConnected(node.outputs[0].id) ? ', connected' : ''}`"
              tabindex="0"
            />
          </div>
        </div>
      </template>

      <!-- ══════ More info toggle ══════ -->
      <div
        class="more-info-toggle"
        @click="moreInfoOpen = !moreInfoOpen"
        role="button"
        :aria-expanded="moreInfoOpen"
        aria-label="Toggle more information"
        tabindex="0"
        @keydown.enter.prevent="moreInfoOpen = !moreInfoOpen"
        @keydown.space.prevent="moreInfoOpen = !moreInfoOpen"
      >
        <svg
          width="8" height="8" viewBox="0 0 8 8"
          class="toggle-chevron" :class="{ open: moreInfoOpen }"
          aria-hidden="true"
        >
          <polygon points="1,0.5 7,4 1,7.5" fill="currentColor"/>
        </svg>
        <span>More info</span>
      </div>

      <NodeInfoPanel
        v-if="moreInfoOpen"
        :info="node.detailedInfo"
        @see-examples="handleSeeExamples"
      />
    </div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════
   GRAPH NODE — Apple-level polish
   ═══════════════════════════════════════════════════ */

.graph-node {
  position: absolute;
  border-radius: 8px;
  overflow: visible;
  z-index: 1;
  user-select: none;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.graph-node:hover {
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.16),
    0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 5;
}

.graph-node:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 3px;
  z-index: 10;
}

.graph-node--running {
  box-shadow:
    0 0 0 2px var(--header-color),
    0 0 16px color-mix(in srgb, var(--header-color) 30%, transparent),
    0 4px 12px rgba(0, 0, 0, 0.15);
}

/* ─── Header ─── */
.node-header {
  background: var(--header-color);
  padding: 10px 14px;
  cursor: grab;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.node-header:active { cursor: grabbing; }

.node-title {
  font-size: 15px;
  font-weight: 600;
  color: #FFF;
  line-height: 1.1;
  letter-spacing: 0.02em;
}

.node-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.2;
  letter-spacing: 0.01em;
}

/* ─── Body ─── */
.node-body {
  background: var(--node-body, #262626);
  padding: 10px 14px 8px;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* ═══════════════════════════════════════════════════
   EXEC PINS — Unreal-style flow control triangles
   ═══════════════════════════════════════════════════ */

.exec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0 6px;
  /* Thin separator below exec row */
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 4px;
}

.exec-pin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.35);
  transition: color 0.15s ease, transform 0.12s ease;
  border-radius: 3px;
}

.exec-pin:hover {
  color: rgba(255, 255, 255, 0.8);
  transform: scale(1.15);
}

.exec-pin:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 2px;
}

.exec-pin.connected {
  color: rgba(255, 255, 255, 0.85);
}

/* ═══════════════════════════════════════════════════
   DATA PINS — circular connectors
   ═══════════════════════════════════════════════════ */

.data-pin {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

.data-pin:hover {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.25);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
}

.data-pin:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 3px;
}

.data-pin.connected {
  background: #FFF;
  border-color: #FFF;
  box-shadow: 0 0 4px rgba(255, 255, 255, 0.15);
}

/* ═══════════════════════════════════════════════════
   INT NODE — Compact layout
   ═══════════════════════════════════════════════════ */

.int-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 0;
}

.int-value-input {
  width: 60px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: #FFF;
  font-size: 12px;
  font-family: 'Inter', -apple-system, sans-serif;
  padding: 3px 8px;
  height: 22px;
  box-sizing: border-box;
  outline: none;
  -moz-appearance: textfield;
  transition: border-color 0.15s ease;
}

.int-value-input::-webkit-inner-spin-button,
.int-value-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.int-value-input:focus-visible {
  border-color: var(--focus-ring, #4F8EEE);
  box-shadow: 0 0 0 1px var(--focus-ring, #4F8EEE);
}

/* ═══════════════════════════════════════════════════
   PIN ROWS — Data i/o for ADD/SUB
   ═══════════════════════════════════════════════════ */

.pin-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 0;
  min-height: 24px;
}

.pin-side {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-side--right {
  margin-left: auto;
}

.pin-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1;
  letter-spacing: 0.01em;
}

/* ═══════════════════════════════════════════════════
   MORE INFO TOGGLE
   ═══════════════════════════════════════════════════ */

.more-info-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0 2px;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  letter-spacing: 0.02em;
  transition: color 0.15s ease;
}

.more-info-toggle:hover {
  color: rgba(255, 255, 255, 0.65);
}

.more-info-toggle:focus-visible {
  outline: 2px solid var(--focus-ring, #4F8EEE);
  outline-offset: 2px;
}

.toggle-chevron {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.toggle-chevron.open {
  transform: rotate(90deg);
}

/* ═══════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .graph-node,
  .data-pin,
  .exec-pin,
  .toggle-chevron,
  .int-value-input,
  .more-info-toggle {
    transition: none;
  }
}
</style>
