<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFilter = ref('All')
const filters = ['All', 'Website Design', 'Game Design']

const projects = [
  {
    id: 'login',
    title: 'Login Micro-Interaction',
    description: 'A playful login screen featuring a Rive-style animated avatar that tracks your input.',
    route: '/login-interaction-1',
    category: 'Website Design'
  },
  {
    id: 'node-graph',
    title: 'Node Graph Visual Scripting',
    description: 'UE Blueprint-inspired node graph with interactive tooltips and live execution.',
    route: '/node-graph',
    category: 'Website Design'
  },
  {
    id: 'patapon',
    title: 'Designing rhythm-combat to feel fun',
    description: 'Walk with me as I breakdown the interaction and combat design of Patapon to recreate the entire core gameplay interaction system in Unity.',
    route: '/experiment/patapon',
    category: 'Game Design'
  },
  {
    id: 'helldivers',
    title: 'Making the UI come to life - Inspired by Helldivers 2',
    description: 'Built a UI component in Unreal Engine to treat 3D skeletal meshes as responsive 2D UI components.',
    route: '/experiment/helldivers',
    category: 'Game Design'
  },
  {
    id: 'jedi',
    title: 'Feel like a Jedi - combat design and interaction',
    description: 'Deconstruct interactions, analyse "game feel" and "game juice" to make my own interpretation on how it would feel to be a jedi in Unity.',
    route: '/experiment/jedi',
    category: 'Game Design'
  }
]

const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') return projects
  return projects.filter(p => p.category === activeFilter.value)
})
</script>

<template>
  <div class="max-w-4xl mx-auto pt-12 mb-24 text-[var(--color-text-charcoal)] px-6 lg:px-0">
    <h1 class="text-4xl font-serif font-bold mb-8">Projects & Experiments</h1>
    
    <div class="flex flex-wrap gap-4 mb-12">
      <button 
        v-for="filter in filters" 
        :key="filter"
        @click="activeFilter = filter"
        class="px-5 py-2 rounded-full border border-[var(--color-text-charcoal)] transition-all text-sm font-bold tracking-wider uppercase"
        :class="activeFilter === filter ? 'bg-[var(--color-text-charcoal)] text-[var(--color-cream-bg)]' : 'hover:bg-[var(--color-text-charcoal)]/5 text-[var(--color-text-charcoal)]/70 hover:text-[var(--color-text-charcoal)]'"
      >
        {{ filter }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <router-link 
        v-for="project in filteredProjects" 
        :key="project.id"
        :to="project.route" 
        class="group block border border-[var(--color-text-charcoal)]/20 p-8 rounded-2xl hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-all duration-300 flex flex-col h-full"
      >
        <div class="flex-grow">
          <div class="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-4">{{ project.category }}</div>
          <h2 class="text-2xl font-serif font-bold mb-3 leading-tight">{{ project.title }}</h2>
          <p class="font-sans opacity-80 mb-8 group-hover:opacity-100 text-sm md:text-base">{{ project.description }}</p>
        </div>
        <div class="font-sans font-bold uppercase tracking-widest text-sm flex items-center gap-2 mt-auto">View Experiment &rarr;</div>
      </router-link>
    </div>
  </div>
</template>
