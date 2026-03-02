<template>
  <ExperimentWrapper
    title="AI Voice Chat Simulation"
    description="A Neumorphic exploration of ethereal braille micro-interactions. The central UI features fluid 'braille marks' that represent an AI's state. These marks merge and shape themselves based on listening, processing, and speaking states, while remaining independently animated like floating sand."
    :tags="['Vue 3', 'HTML Canvas', 'Neumorphism', 'Web Speech API']"
    storybook-id="portfolio-voice-chat-default--docs"
    container-class="h-full w-full"
    full-screen-class="h-screen w-screen"
  >
    <!-- Moved wrapper classes INSIDE the component so Vue's style scoped attributes apply correctly -->
    <div class="w-full h-full flex items-center justify-center voice-sim-wrapper relative rounded-xl sm:rounded-none">
        <VoiceChatComponent />
    </div>
  </ExperimentWrapper>
</template>

<script setup lang="ts">
import ExperimentWrapper from '../components/ExperimentWrapper.vue';
import VoiceChatComponent from '../components/VoiceChatComponent.vue';
</script>

<style scoped>
/* Wrapper styles to ensure the embedded Neumorphic style blends correctly */
.voice-sim-wrapper {
    /* Define the variables locally, forcing a sleek dark theme by default */
    --neo-bg: #1e2024;
    --neo-text: #E6E9EF;
    --neo-shadow-light: #2a2d33;
    --neo-shadow-dark: #121417;
    
    background-color: var(--neo-bg);
    color: var(--neo-text);
    transition: background-color 0.5s ease, color 0.5s ease;
}
</style>
