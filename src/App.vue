<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen bg-[var(--color-cream-bg)] text-[var(--color-text-charcoal)] font-sans selection:bg-[var(--color-text-charcoal)] selection:text-[var(--color-cream-bg)]">
    <NavBar />
    
    <main class="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
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
