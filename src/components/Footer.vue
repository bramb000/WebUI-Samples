<template>
  <footer class="relative mt-24">
    <!-- Curved Top -->
    <div class="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
      <svg class="relative block w-full h-[40px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path d="M0,80 Q720,0 1440,80 L1440,80 L0,80 Z" class="fill-[var(--color-text-charcoal)]" />
      </svg>
    </div>

    <div class="bg-[var(--color-text-charcoal)] text-[var(--color-cream-bg)] px-6 py-16 md:px-12 md:py-24">
      <div class="max-w-7xl mx-auto flex flex-col gap-12">
        
        <!-- CTA Section -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div class="max-w-xl">
             <h2 class="text-4xl md:text-6xl font-serif mb-6 leading-tight">
              Let's make some magic happen.
            </h2>
            <p class="text-[var(--color-accent-soft)] font-sans text-lg opacity-80">
              Open to new opportunities in Product Design, Game UX, and Frontend Development.
            </p>
          </div>
          
          <div class="flex flex-wrap gap-3 max-w-sm">
            <span class="px-4 py-2 border border-[var(--color-accent-soft)] rounded-full text-sm font-sans opacity-70 hover:opacity-100 cursor-default transition-opacity">
              UX Research
            </span>
             <span class="px-4 py-2 border border-[var(--color-accent-soft)] rounded-full text-sm font-sans opacity-70 hover:opacity-100 cursor-default transition-opacity">
              Game Design
            </span>
             <span class="px-4 py-2 border border-[var(--color-accent-soft)] rounded-full text-sm font-sans opacity-70 hover:opacity-100 cursor-default transition-opacity">
              Vue.js
            </span>
             <span class="px-4 py-2 border border-[var(--color-accent-soft)] rounded-full text-sm font-sans opacity-70 hover:opacity-100 cursor-default transition-opacity">
              Prototyping
            </span>
          </div>
        </div>

        <div class="w-full h-[1px] bg-[var(--color-accent-soft)] opacity-20"></div>

        <!-- Bottom Section -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-sans opacity-60">
          <p>&copy; {{ new Date().getFullYear() }} Bramha Dalvi. All rights reserved.</p>
          <div class="flex gap-6">
             <a href="https://www.linkedin.com/in/bramha-dalvi/" target="_blank" class="hover:text-[var(--color-cream-bg)] hover:opacity-100 transition-all">LinkedIn</a>
             <a href="mailto:hello@bramha.work" class="hover:text-[var(--color-cream-bg)] hover:opacity-100 transition-all">Email</a>
          </div>
        </div>

      </div>
    </div>
  </footer>
</template>
