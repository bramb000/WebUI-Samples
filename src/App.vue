<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const isFullScreen = computed(() => route.query.fullscreen === 'true');
</script>

<template>
  <div :class="[
    'flex flex-col min-h-screen text-[var(--color-text-charcoal)] font-sans',
    isFullScreen ? 'bg-white h-screen overflow-hidden' : 'bg-[var(--color-cream-bg)] selection:bg-[var(--color-text-charcoal)] selection:text-[var(--color-cream-bg)]'
  ]">
    <NavBar v-if="!isFullScreen" />
    
    <main :class="['flex-grow w-full', !isFullScreen ? 'max-w-7xl mx-auto px-6 md:px-12 py-12' : '']">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer v-if="!isFullScreen" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
