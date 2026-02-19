<template>
  <div class="max-w-[1000px] mx-auto">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">My Projects</h1>
    
    <div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
      <router-link to="/login-interaction-1" class="block border border-gray-200 p-6 rounded-lg shadow-sm no-underline text-inherit hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <h2 class="text-xl font-bold mb-2 mt-0 text-gray-700">Login Screen Micro Interaction 1</h2>
        <p class="text-gray-500 m-0">A playful login screen featuring a Rive-style animated avatar that tracks your input and reacts to password focus.</p>
        <div class="mt-4 text-[#2cd203] font-medium">View Interaction &rarr;</div>
      </router-link>
      
      <router-link to="/node-graph" class="block border border-gray-200 p-6 rounded-lg shadow-sm no-underline text-inherit hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
        <h2 class="text-xl font-bold mb-2 mt-0 text-gray-700">Node Graph Visual Scripting</h2>
        <p class="text-gray-500 m-0">UE Blueprint-inspired node graph with interactive info tooltips and live execution.</p>
        <div class="mt-4 text-[#4F8EEE] font-medium">View Interaction &rarr;</div>
      </router-link>
    </div>
  </div>
</template>
