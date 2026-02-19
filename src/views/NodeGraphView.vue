<template>
  <div class="node-graph-view">
    <NodeGraphCanvas />
  </div>
</template>

<script setup lang="ts">
import NodeGraphCanvas from '../components/node-graph/NodeGraphCanvas.vue'
</script>

<style scoped>
.node-graph-view {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
</style>
