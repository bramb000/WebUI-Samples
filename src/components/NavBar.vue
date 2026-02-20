<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from '../composables/useTheme';

const isMenuOpen = ref(false);
const { theme, toggle } = useTheme();

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

      <!-- Theme Toggle -->
      <button 
        @click="toggle" 
        class="clean-btn p-2 rounded-full hover:bg-[var(--color-text-charcoal)]/10 transition-colors"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <!-- Sun icon (visible in dark mode) -->
        <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <!-- Moon icon (visible in light mode) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <a href="https://www.linkedin.com/in/bramha-dalvi/" target="_blank" class="px-5 py-2 border border-[var(--color-text-charcoal)] rounded-full text-sm font-sans uppercase hover:bg-[var(--color-text-charcoal)] hover:text-[var(--color-cream-bg)] transition-colors">
        Let's Talk
      </a>
    </div>

    <!-- Mobile Menu Button -->
    <div class="flex md:hidden gap-4 items-center">
      <!-- Mobile Theme Toggle -->
      <button 
        @click="toggle" 
        class="clean-btn p-2"
        :title="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <svg v-if="theme === 'dark'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>

      <button @click="isMenuOpen = !isMenuOpen" class="focus:outline-none clean-btn">
        <div class="space-y-1.5">
          <span :class="{'rotate-45 translate-y-2': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-transform duration-300"></span>
          <span :class="{'opacity-0': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-opacity duration-300"></span>
          <span :class="{'-rotate-45 -translate-y-2': isMenuOpen}" class="block w-8 h-0.5 bg-[var(--color-text-charcoal)] transition-transform duration-300"></span>
        </div>
      </button>
    </div>

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
