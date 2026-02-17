<template>
  <div class="text-center py-8">
    <h1 class="text-4xl font-bold mb-4 text-gray-800">Welcome to My Portfolio</h1>
    <p class="text-xl text-gray-500 mb-8">This is the home page of my Web UI practice project.</p>
    
    <div class="flex gap-4 justify-center">
      <router-link to="/projects" class="px-6 py-3 rounded bg-blue-600 text-white font-bold no-underline hover:bg-blue-700 transition-colors">View Projects</router-link>
      <router-link to="/about" class="px-6 py-3 rounded border border-gray-300 text-gray-700 bg-white font-bold no-underline hover:bg-gray-50 transition-colors">About Me</router-link>
    </div>
  </div>
</template>
