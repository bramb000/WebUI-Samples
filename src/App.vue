<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { useCaseTheme } from './composables/useCaseTheme';

const route = useRoute();
const isFullScreen = computed(() => route.query.fullscreen === 'true');

// Applies data-theme on <html> for case study Hero theming
useCaseTheme();
</script>

<template>
  <div :class="[
    'flex flex-col min-h-screen font-sans',
    isFullScreen ? 'bg-white h-screen overflow-hidden' : 'bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-border-hi)] selection:text-[#111113]'
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

    <!-- Deadlock UI Global Filters -->
    <svg style="visibility: hidden; position: absolute;" width="0" height="0">
      <defs>
        <!-- Unstable Magic/Heat Flicker -->
        <filter id="deadlock-flicker">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="1">
            <animate attributeName="seed" from="1" to="100" dur="2s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>

        <!-- Noir Grain Displacement -->
        <filter id="noir-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="5">
            <animate attributeName="seed" from="5" to="500" dur="1s" steps="12" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>

        <!-- Deadlock Living Ink (Smooth Organic Flow) -->
        <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
          <filter id="deadlock-ink-boil" x="-50%" y="-50%" width="200%" height="200%">
            <!-- Static noise field -->
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <!-- Smoothly slide the noise field to create correlated organic morphing -->
            <feOffset in="noise" result="movingNoise">
              <animate attributeName="dx" from="0" to="60" dur="3s" repeatCount="indefinite" />
              <animate attributeName="dy" from="0" to="30" dur="4s" repeatCount="indefinite" />
            </feOffset>
            <!-- Apply displacement -->
            <feDisplacementMap in="SourceGraphic" in2="movingNoise" scale="30" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </defs>
    </svg>
  </div>
</template>

<style>
.fade-enter-active {
  transition:
    opacity   0.18s var(--ease-te-slide),
    transform 0.18s var(--ease-te-slide);
}
.fade-leave-active {
  transition:
    opacity   0.08s var(--ease-te-snap),
    transform 0.08s var(--ease-te-snap);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
</style>
