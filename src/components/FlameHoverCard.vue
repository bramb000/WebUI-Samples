<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { setFlameHover } from '../composables/flameState';

type Props = {
  enabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), { enabled: true });
const attrs = useAttrs();

const isEnabled = computed(() => props.enabled);

function onEnter(e: PointerEvent) {
  if (!isEnabled.value) return;
  setFlameHover(e.currentTarget as HTMLElement);
}
</script>

<template>
  <div
    v-bind="attrs"
    @pointerenter="onEnter"
    @pointerleave="() => setFlameHover(null)"
  >
    <slot />
  </div>
</template>

