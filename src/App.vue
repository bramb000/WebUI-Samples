<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import { useCaseTheme } from './composables/useCaseTheme';

const route = useRoute();
const isHeroSelect = computed(() => route.path === '/work');
const isFullScreen = computed(() => route.query.fullscreen === 'true');

// Applies data-theme on <html> for case study Hero theming
useCaseTheme();
</script>

<template>
  <div
    :class="[
      'flex flex-col min-h-screen font-sans',
      isFullScreen
        ? 'h-screen overflow-hidden bg-transparent text-[var(--color-text)]'
        : 'bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-border-hi)] selection:text-[#111113]',
    ]"
  >
    <NavBar v-if="!isFullScreen" />
    
    <main :class="[
      'flex-grow w-full', 
      // Hero Select needs a full-bleed stage (but still a normal page w/ Nav).
      isHeroSelect ? 'h-[calc(100vh-72px)] min-h-0 overflow-hidden' : '',
      (!isFullScreen && !isHeroSelect && !route.path.startsWith('/work/')) ? 'max-w-7xl mx-auto px-6 md:px-12 py-12' : ''
    ]">
      <router-view v-slot="{ Component }">
        <transition v-if="!isFullScreen" name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
        <component v-else :is="Component" />
      </router-view>
    </main>

    <Footer v-if="!isFullScreen && !isHeroSelect" />

    <!-- Global SVG filters -->
    <svg style="visibility: hidden; position: absolute;" width="0" height="0">
      <defs>
        <!-- Demo: procedural aged paper dim overlay -->
        <linearGradient id="dim_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="50%" stop-color="rgba(0,0,0,0.1)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.85)" />
        </linearGradient>

        <!-- Demo: paper crumple (displacement) -->
        <filter id="paper-crumple" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
          <feTurbulence id="crumple-noise" type="fractalNoise" baseFrequency="0.025" numOctaves="3" result="noise" seed="0" />
          <feDisplacementMap id="crumple-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" edgeMode="duplicate" />
        </filter>

        <!-- Unstable Magic/Heat Flicker -->
        <filter id="ui-flicker">
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
