<template>
  <ExperimentWrapper
    title="Sales Modal"
    description="A responsive, component-driven pricing modal featuring dynamic user-specific banner alerts for 'Pro' and 'Team' tiers, interactive billing toggles, and atomic sub-components for high reusability."
    :tags="['Vue 3', 'Tailwind', 'Component-Driven']"
    storybook-id="sales-modal-full-view--default"
    container-class="w-full bg-[#f3f4f6] min-h-[600px] flex items-center justify-center p-8"
  >
    <SalesModal :inline="true" />
  </ExperimentWrapper>
</template>

<script setup lang="ts">
import SalesModal from '../components/sales-modal/SalesModal.vue';
import ExperimentWrapper from '../components/ExperimentWrapper.vue';
</script>
