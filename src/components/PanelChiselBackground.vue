<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  registerChiselFrame,
  unregisterChiselFrame,
} from '../vfx/chiselFrameOverlay'

/** Rim stroke matches parchment fill (`--paper-surface-fill`) */
const PAPER_STROKE = '#ebe4d6'
/** Organic outer edge extends this far beyond the paper rect (into the gutter padding) */
const PANEL_BLEED_PX = 36

const trackRef = ref<HTMLElement | null>(null)
let frameId: number | null = null
let cancelled = false

onMounted(() => {
  nextTick(() => {
    if (cancelled) return
    const el = trackRef.value
    if (!el) return
    frameId = registerChiselFrame(el, {
      colorHex: PAPER_STROKE,
      fillColorHex: PAPER_STROKE,
      hoverFlame: false,
      panelFill: false,
      staticRim: true,
      flatRim: true,
      bleedPx: PANEL_BLEED_PX,
      skipAncestorClip: true,
    })
  })
})

onBeforeUnmount(() => {
  cancelled = true
  if (frameId != null) {
    unregisterChiselFrame(frameId)
    frameId = null
  }
})
</script>

<template>
  <div class="panel-chisel-bg" data-surface="paper">
    <!-- Gutter padding = dark stage for deckled outer edge (must not use overflow:hidden) -->
    <div ref="trackRef" class="panel-chisel-bg__sheet noise-overlay">
      <div class="panel-chisel-bg__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-chisel-bg {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: visible;
  color: var(--color-text);
  box-sizing: border-box;
  /* Space for WebGL organic rim outside the paper rectangle */
  padding: 40px;
}

/* WebGL bounds = this sheet; rough edge bleeds into .panel-chisel-bg padding */
.panel-chisel-bg__sheet {
  position: relative;
  z-index: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  width: 100%;
  overflow: visible;
  background: var(--paper-surface-fill);
}

/* Global .noise-overlay sets overflow:hidden — that was squaring the outer edge */
.panel-chisel-bg__sheet.noise-overlay {
  overflow: visible;
}

.panel-chisel-bg__content {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
