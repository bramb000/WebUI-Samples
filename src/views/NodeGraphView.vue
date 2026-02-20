<template>
  <ExperimentWrapper
    title="Node Graph Experiment"
    :tags="['Vue 3', 'SVG & Mouse Events', 'State Management']"
    storybook-id="components-nodegraph-nodegraph--default"
    footer-note="Tip: Use the scroll wheel to zoom and middle-mouse button to pan."
    container-class="h-[75vh] min-h-[600px] relative"
  >
    <template #description>
      A canvas-based node editor built from scratch in Vue. Features include infinite panning, smooth zooming, bezier wire connections, and a reactive data flow engine.
    </template>

    <NodeGraphCanvas />
  </ExperimentWrapper>
</template>

<script setup lang="ts">
import NodeGraphCanvas from '../components/node-graph/NodeGraphCanvas.vue'
import ExperimentWrapper from '../components/ExperimentWrapper.vue'
</script>
