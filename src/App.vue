<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRouteSeo } from './seo/applyRouteSeo';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
import GlobalBackgroundTexture from './components/GlobalBackgroundTexture.vue';
import SeoStructuredData from './components/SeoStructuredData.vue';
const route = useRoute();
useRouteSeo(route);

/** Keep `/work` viewport shell until the route leave transition finishes (avoids detail-pane flash). */
const workStageActive = ref(route.path === '/work');

watch(
  () => route.path,
  (path) => {
    if (path === '/work')
      workStageActive.value = true
  },
)

function onPageTransitionAfterLeave() {
  if (route.path !== '/work')
    workStageActive.value = false
}

const showWorkStage = computed(() => workStageActive.value);
const isHome = computed(() => route.path === '/');
const isAbout = computed(() => route.path === '/about');
const isFullScreen = computed(() => route.query.fullscreen === 'true');
/** Fixed nav does not reserve flow space — offset main except `/work` (uses `.work-stage`). */
const mainBelowNav = computed(() => !isFullScreen.value && !showWorkStage.value);
const isConstrainedMain = computed(
  () =>
    !isFullScreen.value
    && !showWorkStage.value
    && !isHome.value
    && !isAbout.value
    && !route.path.startsWith('/work/'),
);

</script>

<template>
  <div
    :class="[
      'flex flex-col min-h-screen font-sans',
      isFullScreen
        ? 'h-screen overflow-hidden bg-transparent text-[var(--color-text)]'
        : 'bg-[var(--color-bg)] text-[var(--color-text)] selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]',
    ]"
  >
    <SeoStructuredData />
    <GlobalBackgroundTexture />
    <NavBar v-if="!isFullScreen" />
    
    <main :class="[
      'flex-grow w-full',
      mainBelowNav ? 'main-below-nav' : '',
      showWorkStage ? 'work-stage' : '',
      isConstrainedMain ? 'max-w-7xl mx-auto px-6 md:px-12 py-12' : '',
      isHome || isAbout ? 'py-0' : '',
    ]">
      <router-view v-slot="{ Component }">
        <transition
          v-if="!isFullScreen"
          name="fade"
          mode="out-in"
          @after-leave="onPageTransitionAfterLeave"
        >
          <component :is="Component" :key="route.path" />
        </transition>
        <component v-else :is="Component" :key="route.path" />
      </router-view>
    </main>

    <Footer v-if="!isFullScreen && !showWorkStage" />

    <!-- Global SVG filters -->
    <svg style="visibility: hidden; position: absolute;" width="0" height="0">
      <defs>
        <!-- Demo: procedural aged paper dim overlay -->
        <linearGradient id="dim_grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="50%" stop-color="rgba(0,0,0,0.1)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.85)" />
        </linearGradient>

        <!-- Roster cards — hand-drawn pencil stroke (see RosterCard .inner-card::before) -->
        <filter id="roster-pencil-border" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.052" numOctaves="3" seed="19" result="coarse" />
          <feTurbulence type="fractalNoise" baseFrequency="0.18" numOctaves="2" seed="53" result="fine" />
          <feDisplacementMap in="SourceGraphic" in2="coarse" scale="1.15" xChannelSelector="R" yChannelSelector="G" result="wobble" />
          <feDisplacementMap in="wobble" in2="fine" scale="0.45" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="roster-pencil-border-alt" x="-12%" y="-12%" width="124%" height="124%" color-interpolation-filters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.061" numOctaves="2" seed="37" result="coarse" />
          <feDisplacementMap in="SourceGraphic" in2="coarse" scale="0.9" xChannelSelector="R" yChannelSelector="G" />
        </filter>

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

@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.01ms !important;
  }
  .fade-enter-from,
  .fade-leave-to {
    transform: none !important;
  }
}
</style>
