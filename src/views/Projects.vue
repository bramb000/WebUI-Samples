<template>
  <div class="max-w-4xl mx-auto pt-12 text-[var(--color-text-charcoal)]">
    <h1 class="text-4xl font-serif font-bold mb-12">Projects & Experiments</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <router-link to="/login-interaction-1" class="group block border border-[var(--color-text-charcoal)]/20 p-8 rounded-2xl hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-all duration-300">
        <h2 class="text-2xl font-serif font-bold mb-3">Login Micro-Interaction</h2>
        <p class="font-sans opacity-80 mb-6 group-hover:opacity-100">A playful login screen featuring a Rive-style animated avatar that tracks your input.</p>
        <div class="font-sans font-bold uppercase tracking-widest text-sm flex items-center gap-2">View Experiment &rarr;</div>
      </router-link>
      
      <router-link to="/node-graph" class="group block border border-[var(--color-text-charcoal)]/20 p-8 rounded-2xl hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-all duration-300">
        <h2 class="text-2xl font-serif font-bold mb-3">Node Graph Visual Scripting</h2>
        <p class="font-sans opacity-80 mb-6 group-hover:opacity-100">UE Blueprint-inspired node graph with interactive tooltips and live execution.</p>
        <div class="font-sans font-bold uppercase tracking-widest text-sm flex items-center gap-2">View Experiment &rarr;</div>
      </router-link>
    </div>
  </div>
</template>
