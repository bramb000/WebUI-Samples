<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

type Props = {
  to?: RouteLocationRaw;
  href?: string;
  target?: string;
  rel?: string;
  variant?: 'filled' | 'outline';
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'outline',
});
const attrs = useAttrs();

const isRouterLink = computed(() => props.to !== undefined && props.to !== null);
const isAnchor = computed(() => !isRouterLink.value && !!props.href);
const tag = computed(() => (isRouterLink.value ? 'router-link' : isAnchor.value ? 'a' : 'button'));

const safeRel = computed(() => {
  if (!isAnchor.value) return undefined;
  const target = props.target ?? (attrs as any)?.target;
  const rel = props.rel ?? (attrs as any)?.rel;
  if (target === '_blank' && (!rel || !String(rel).includes('noopener'))) {
    return [rel, 'noopener', 'noreferrer'].filter(Boolean).join(' ');
  }
  return rel;
});
</script>

<template>
  <component
    :is="tag"
    :class="['dl-button-master', { 'dl-button-master--outline': variant === 'outline' }]"
    :to="isRouterLink ? to : undefined"
    :href="isAnchor ? href : undefined"
    :target="isAnchor ? target : undefined"
    :rel="isAnchor ? safeRel : undefined"
    v-bind="attrs"
  >
    <span><slot /></span>
  </component>
</template>
