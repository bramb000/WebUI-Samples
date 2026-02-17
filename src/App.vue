<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'

const route = useRoute()
const isBlankLayout = computed(() => route.meta.layout === 'blank')
</script>

<template>
  <div v-if="isBlankLayout">
    <router-view />
  </div>
  <DefaultLayout v-else>
    <router-view />
  </DefaultLayout>
</template>
