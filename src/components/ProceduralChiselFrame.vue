<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Optional override for `--dl-card-frame-color` on this frame */
    color?: string
    /** Cards use a CSS rim; live ink is reserved for work panels. */
    hoverFlame?: boolean
  }>(),
  {
    color: undefined,
    hoverFlame: false,
  },
)
</script>

<template>
  <div
    class="chisel-frame dl-card-frame"
    :style="color ? { '--dl-card-frame-color': color } : undefined"
  >
    <div class="chisel-frame__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.chisel-frame {
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 0;
  height: auto;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  align-self: stretch;
  box-sizing: border-box;
}

.chisel-frame__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
