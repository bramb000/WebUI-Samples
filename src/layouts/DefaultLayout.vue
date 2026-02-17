<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans">
    <header class="bg-gray-800 text-white px-4 py-4">
      <nav class="flex justify-between items-center max-w-[1200px] mx-auto">
        <router-link to="/" class="text-2xl font-bold no-underline text-white hover:text-gray-300 transition-colors">My Portfolio</router-link>
        <div class="flex gap-4">
          <router-link to="/" class="text-white no-underline hover:underline transition-all">Home</router-link>
          <router-link to="/projects" class="text-white no-underline hover:underline transition-all">Projects</router-link>
          <router-link to="/about" class="text-white no-underline hover:underline transition-all">About</router-link>
        </div>
      </nav>
    </header>

    <main class="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8 box-border">
      <slot />
    </main>

    <footer class="bg-gray-800 text-white text-center px-4 py-4 mt-auto">
      <p class="m-0">&copy; 2026 My Portfolio. All rights reserved.</p>
    </footer>
  </div>
</template>
