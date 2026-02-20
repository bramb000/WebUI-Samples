<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const navLinks = [
  { name: 'Work', href: '/' },
  { name: 'Experiments', href: '/projects' },
  { name: 'About', href: '/about' },
];
</script>

<template>
  <nav class="w-full py-6 px-6 md:px-12 flex justify-between items-center bg-[var(--color-cream-bg)] text-[var(--color-text-charcoal)] relative z-50">
    <!-- Logo -->
    <router-link to="/" class="text-2xl font-serif font-bold tracking-tight hover:opacity-80 transition-opacity">
      bramha.
    </router-link>

    <!-- Desktop Menu -->
    <div class="hidden md:flex gap-8 items-center">
      <router-link 
        v-for="link in navLinks" 
        :key="link.name" 
        :to="link.href"
        class="text-sm font-sans uppercase tracking-widest hover:text-[var(--color-accent-soft)] transition-colors relative group"
      >
        {{ link.name }}
        <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-text-charcoal)] transition-all group-hover:w-full"></span>
      </router-link>
      <a href="https://www.linkedin.com/in/bramha-dalvi/" target="_blank" class="px-5 py-2 border border-[var(--color-text-charcoal)] rounded-full text-sm font-sans uppercase hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors">
        Let's Talk
      </a>
    </div>

    <!-- Mobile Menu Button -->
    <button @click="isMenuOpen = !isMenuOpen" class="md:hidden focus:outline-none clean-btn">
      <div class="space-y-1.5">
        <span :class="{'rotate-45 translate-y-2': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-transform duration-300"></span>
        <span :class="{'opacity-0': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-opacity duration-300"></span>
        <span :class="{'-rotate-45 -translate-y-2': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-transform duration-300"></span>
      </div>
    </button>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMenuOpen" class="fixed inset-0 bg-[var(--color-cream-bg)] flex flex-col items-center justify-center gap-8 z-40 transition-opacity duration-300">
       <router-link 
        v-for="link in navLinks" 
        :key="link.name" 
        :to="link.href"
        @click="isMenuOpen = false"
        class="text-3xl font-serif hover:italic transition-all"
      >
        {{ link.name }}
      </router-link>
       <a href="https://www.linkedin.com/in/bramha-dalvi/" target="_blank" class="px-8 py-3 border border-[var(--color-text-charcoal)] rounded-full text-lg font-sans uppercase hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors">
        Let's Talk
      </a>
    </div>
  </nav>
</template>

<style scoped>
.clean-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
</style>
