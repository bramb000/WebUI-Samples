<script setup lang="ts">
</script>

<template>
  <div class="home">
    <h1>Welcome to My Portfolio</h1>
    <p class="subtitle">This is the home page of my Web UI practice project.</p>
    
    <div class="actions">
      <router-link to="/projects" class="button primary">View Projects</router-link>
      <router-link to="/about" class="button secondary">About Me</router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  text-align: center;
  padding: 2rem 0;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.25rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.primary {
  background-color: #007bff;
  color: white;
}

.primary:hover {
  background-color: #0056b3;
}

.secondary {
  border: 1px solid #ccc;
  color: #333;
  background-color: white;
}

.secondary:hover {
  background-color: #f8f9fa;
}
</style>
