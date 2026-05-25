<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    /** Lightbox / dark overlays — lighter label ink */
    tone?: 'default' | 'on-dark'
    /** Kept for API compat; chips use CSS frame everywhere */
    detached?: boolean
  }>(),
  { tone: 'default', detached: false },
)
</script>

<template>
  <span
    class="case-pencil-chip"
    :class="{ 'case-pencil-chip--on-dark': tone === 'on-dark' }"
    :data-pencil-detached="detached ? '' : undefined"
  >
    {{ label }}
  </span>
</template>
