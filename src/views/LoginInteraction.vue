<template>
  <div class="login-page">
    <LoginAvatar />
  </div>
</template>

<script setup lang="ts">
import LoginAvatar from '../components/LoginAvatar.vue';
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f3f4f6;
  padding: 1rem;
}
</style>
