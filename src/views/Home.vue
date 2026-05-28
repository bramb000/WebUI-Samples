<script setup lang="ts">
import DetectiveHeroIntro from '../components/detective/DetectiveHeroIntro.vue'
import HeroBackgroundTexture from '../components/HeroBackgroundTexture.vue'
</script>

<template>
  <div class="home-page">
    <section class="home-hero-stage">
      <HeroBackgroundTexture class="home-hero-stage__texture" />
      <div class="home-page__container home-hero-stage__content">
        <DetectiveHeroIntro />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-hero-stage {
  --hero-bg-grain-overlay-strength: 0.18;
  --hero-bg-grain-opacity: 0.16;
  --hero-bg-halftone-opacity: 0.02;
  position: relative;
  width: 100%;
  overflow: hidden;
}

.home-hero-stage__texture {
  /* Full-bleed across the viewport, not just the reading column */
  position: absolute;
  inset: 0;
  width: 100vw;
  left: 50%;
  transform: translateX(-50%);
}

.home-hero-stage__content {
  position: relative;
  z-index: 1;
}

.home-page__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
}
</style>
