<script setup lang="ts">

defineProps<{
  label: string
  active: boolean
}>()

const emit = defineEmits<{
  pick: []
}>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    emit('pick')
  }
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="toc-proc-row"
    :class="{ 'toc-proc-row--active': active }"
    :aria-current="active ? 'location' : undefined"
    :aria-label="label"
    @click="emit('pick')"
    @keydown="onKeydown"
  >
    <span class="toc-proc-row__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.toc-proc-row {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  line-height: 1.42;
  /* 8px grid: row ≥40px; block / inline-end = 8px; inline-start = 32px (4×8) for tab gutter — not 4px padding */
  min-height: 40px;
  padding-block: 8px;
  padding-inline: 32px 8px;
  border-radius: 0;
  cursor: pointer;
  --toc-row-surface: transparent;
  background: var(--toc-row-surface);
  overflow: visible;
  transition:
    background 110ms var(--ease-te-snap, ease),
    color 110ms var(--ease-te-snap, ease);
}

.toc-proc-row__label {
  position: relative;
  z-index: 1;
  display: block;
  white-space: normal;
  overflow-wrap: anywhere;
  text-wrap: balance;
  color: var(--color-text);
}

.toc-proc-row--active {
  --toc-row-surface: color-mix(in srgb, var(--color-accent) 8%, transparent 92%);
}

.toc-proc-row--active .toc-proc-row__label {
  color: var(--color-text);
}

.toc-proc-row:hover {
  --toc-row-surface: color-mix(in srgb, var(--color-accent) 10%, transparent 90%);
}

.toc-proc-row:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 8px;
}
</style>
