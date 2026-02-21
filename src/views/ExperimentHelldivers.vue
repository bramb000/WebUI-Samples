<script setup lang="ts">
import ExperimentWrapper from '../components/ExperimentWrapper.vue'
import VideoEmbed from '../components/VideoEmbed.vue'
</script>

<template>
  <div class="max-w-4xl pt-12 mx-auto px-6 lg:px-0 mb-24">
    <ExperimentWrapper
      title="Making the UI come to life - Inspired by Helldivers 2"
      description="Inspired by bold comic book art styles like Brawlstars, I built a UI component in Unreal Engine to treat 3D skeletal meshes as responsive 2D UI components. By leveraging Scene Capture 2D and custom Material Brushes, I created a UI system that honors standard 2D anchor and scaling rules while maintaining a live, interactive 3D preview—essential for character customization and loadout systems. Also utilised Unreal Engine's Enhanced Input system to implement multi platform interaction support for gamepads and keyboards."
      :tags="['Game Design', 'Unreal Engine', 'UI Design']"
    >
      <VideoEmbed src="https://www.youtube.com/embed/CPDyo2S8tco" />
    </ExperimentWrapper>
  </div>
</template>
