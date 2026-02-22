<template>
  <ExperimentWrapper
    title="Login Interaction"
    description="A micro-interaction study focusing on state-driven animations. Uses Rive/Lottie for the character that reacts to input focus, typing speed, and password visibility toggles. Demonstrates how small details can enhance user delight."
    :tags="['Vue 3', 'Lottie', 'State Machines', 'Forms']"
    storybook-id="login-micro-interaction-loginavatar--light-mode"
    container-class="h-[800px] flex items-center justify-center bg-[#f3f4f6]"
  >
    <LoginAvatar />
  </ExperimentWrapper>
</template>

<script setup lang="ts">
import LoginAvatar from '../components/LoginAvatar.vue';
import ExperimentWrapper from '../components/ExperimentWrapper.vue';
</script>
