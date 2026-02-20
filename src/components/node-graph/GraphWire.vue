```
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Connection, GraphNodeData } from '../../composables/useNodeGraph'
import { getPinRelativePos } from '../../composables/useNodeGraph'

const props = defineProps<{
  connection: Connection
  nodes: GraphNodeData[]
}>()

const emit = defineEmits<{
  (e: 'disconnect', connectionId: string): void
}>()

const hovered = ref(false)

const fromNode = computed(() => props.nodes.find(n => n.id === props.connection.fromNodeId))
const toNode = computed(() => props.nodes.find(n => n.id === props.connection.toNodeId))

// Determine if this is an exec wire
const isExecWire = computed(() => {
  const node = fromNode.value
  if (!node) return false
  return node.execOutputs.some(p => p.id === props.connection.fromPinId)
})

const fromPos = computed(() => {
  const node = fromNode.value
  if (!node) return { x: 0, y: 0 }

  const offset = getPinRelativePos(node, props.connection.fromPinId)
  if (!offset) return { x: 0, y: 0 }

  return {
    x: node.position.x + offset.x,
    y: node.position.y + offset.y
  }
})

const toPos = computed(() => {
  const node = toNode.value
  if (!node) return { x: 0, y: 0 }

  const offset = getPinRelativePos(node, props.connection.toPinId)
  if (!offset) return { x: 0, y: 0 }

  return {
    x: node.position.x + offset.x,
    y: node.position.y + offset.y
  }
})

const pathD = computed(() => {
  const x1 = fromPos.value.x
  const y1 = fromPos.value.y
  const x2 = toPos.value.x
  const y2 = toPos.value.y
  const dx = Math.abs(x2 - x1) * 0.5
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
})

const midpoint = computed(() => ({
  x: (fromPos.value.x + toPos.value.x) / 2,
  y: (fromPos.value.y + toPos.value.y) / 2
}))

function onDisconnect(event: MouseEvent) {
  event.stopPropagation()
  emit('disconnect', props.connection.id)
}
</script>

<template>
  <g
    class="graph-wire"
    :class="{ 'graph-wire--exec': isExecWire }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    role="group"
    :aria-label="`${isExecWire ? 'Execution' : 'Data'} wire from ${fromNode?.label} to ${toNode?.label}`"
  >
    <!-- Invisible wide hit area -->
    <path
      :d="pathD"
      fill="none"
      stroke="transparent"
      stroke-width="16"
      style="cursor: pointer;"
    />

    <!-- Visible wire -->
    <path
      :d="pathD"
      fill="none"
      :stroke="hovered ? 'var(--wire-hover, #999)' : 'var(--wire-color, #AAA)'"
      :stroke-width="hovered ? 3 : 2"
      stroke-linecap="round"
      :style="{ transition: 'stroke-width 0.15s ease, stroke 0.15s ease' }"
    />

    <!-- Disconnect button at midpoint -->
    <g
      v-if="hovered"
      class="disconnect-btn"
      :transform="`translate(${midpoint.x}, ${midpoint.y})`"
      @click="onDisconnect"
      style="cursor: pointer;"
      role="button"
      :aria-label="`Disconnect ${isExecWire ? 'execution' : 'data'} wire from ${fromNode?.label} to ${toNode?.label}`"
      tabindex="0"
    >
      <circle r="10" fill="var(--wire-disconnect-bg, #E53E3E)" opacity="0.95"/>
      <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </g>
  </g>
</template>

<style scoped>
/* Exec wires are slightly thinner and dashed when not running */
.graph-wire--exec path:not(.running) {
  stroke-dasharray: 6 4;
}

.disconnect-btn {
  animation: fadeIn 0.12s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .disconnect-btn {
    animation: none;
  }
}
</style>
