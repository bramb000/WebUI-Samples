<template>
  <ExperimentWrapper
    title="Login Interaction"
    description="A micro-interaction study focusing on state-driven animations. Uses Rive/Lottie for the character that reacts to input focus, typing speed, and password visibility toggles. Demonstrates how small details can enhance user delight."
    :tags="['Vue 3', 'Lottie', 'State Machines', 'Forms']"
    storybook-id="portfolio-login-avatar--docs"
    container-class="w-full h-full flex flex-col items-center justify-center bg-[#f3f4f6] p-4 sm:py-6 sm:px-8 overflow-y-auto"
    full-screen-class="w-full min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4 sm:p-8 lg:p-12"
  >
    <LoginAvatar />
  </ExperimentWrapper>
</template>

<script setup lang="ts">
import LoginAvatar from '../components/LoginAvatar.vue';
import ExperimentWrapper from '../components/ExperimentWrapper.vue';
</script>
