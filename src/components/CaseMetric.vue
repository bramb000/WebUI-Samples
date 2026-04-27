<script setup lang="ts">
withDefaults(defineProps<{
  value: string | number;
  label: string;
  theme?: 'neutral' | 'success' | 'danger';
}>(), {
  theme: 'neutral'
});
</script>

<template>
  <div class="metric-wrap panel-recessed">
    <!-- Side axle knobs (matching AccountTray) -->
    <div class="axle axle-left">
      <div class="axle-groove"></div>
      <div class="axle-groove"></div>
    </div>
    <div class="axle axle-right">
      <div class="axle-groove"></div>
      <div class="axle-groove"></div>
    </div>

    <!-- LCD value display -->
    <div class="metric-lcd lcd-data">
      <div class="lcd-glare"></div>
      <span class="metric-value">{{ value }}</span>
    </div>

    <!-- Label row -->
    <div class="metric-label">
      <span class="indicator-dot" :class="{ 'dot-success': theme === 'success', 'dot-danger': theme === 'danger' }"></span>
      <span class="metric-label-text">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.metric-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px 20px;
  min-height: 120px;
  transition:
    box-shadow 200ms var(--ease-mechanical-spring),
    transform  200ms var(--ease-mechanical-spring);
}
.metric-wrap:hover {
  transform: translateY(-3px);
  border-color: var(--color-border-hi);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.7),
    0 12px 28px rgba(0, 0, 0, 0.7),
    var(--dl-glow-global);
}

/* ── Axle knobs ── */
.axle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 32px;
  background: var(--color-border);
  border: 1px solid var(--color-text-muted);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 3px 0;
}
.axle-left {
  left: -6px;
  border-right: none;
  border-radius: 2px 0 0 2px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), -1px 2px 4px rgba(0,0,0,0.6);
}
.axle-right {
  right: -6px;
  border-left: none;
  border-radius: 0 2px 2px 0;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 1px 2px 4px rgba(0,0,0,0.6);
}
.axle-groove {
  width: 100%;
  height: 1px;
  background: var(--color-text-muted);
  opacity: 0.4;
}

/* ── LCD Screen ── */
.metric-lcd {
  width: 80%;
  min-width: 80px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.metric-value {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 900;
  color: var(--color-lcd-text);
  letter-spacing: 0.05em;
  line-height: 1;
  position: relative;
  z-index: 1;
}

/* ── Label ── */
.metric-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.metric-label-text {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}
.dot-success { background: #4caf50; box-shadow: 0 0 4px rgba(76,175,80,0.6); }
.dot-danger  { background: #f44336; box-shadow: 0 0 4px rgba(244,67,54,0.6); }
</style>
