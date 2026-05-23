<script setup lang="ts">
import DetectiveHeroIntro from '../components/detective/DetectiveHeroIntro.vue'
</script>

<template>
  <div class="home-page">
    <div class="home-page__container">
      <DetectiveHeroIntro />
    </div>
  </div>
</template>

<style scoped>
.home-page__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
}
</style>
