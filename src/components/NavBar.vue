<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useTheme } from '../composables/useTheme';
import posthog from 'posthog-js';

const isMenuOpen = ref(false);

watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
const { theme, toggle } = useTheme();

const showNavbar = ref(true);
const lastScrollPosition = ref(0);

const handleScroll = () => {
  const currentScrollPosition = window.scrollY;
  if (currentScrollPosition < 0) return;
  
  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60 && currentScrollPosition > 100) return;

  if (currentScrollPosition <= 60) {
    showNavbar.value = true;
  } else {
    showNavbar.value = currentScrollPosition < lastScrollPosition.value;
  }
  lastScrollPosition.value = currentScrollPosition;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const navLinks = [
  { name: 'Work', href: '/work' },
  { name: 'Micro-projects', href: '/micro-projects' },
  { name: 'About', href: '/about' },
];

const trackContactClick = (source: string) => {
  posthog.capture('contact_clicked', { source });
};
</script>

<template>
  <nav 
    :class="[
      'nav-rail w-full flex justify-between md:justify-center items-center sticky top-0 z-50',
      showNavbar ? 'translate-y-0' : '-translate-y-full'
    ]"
    style="transition: background-color 0.25s var(--ease-te-snap), color 0.25s var(--ease-te-snap), transform 0.3s ease;"
  >
    <!-- Mobile Logo -->
    <router-link
      to="/"
      class="md:hidden nav-logo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
      @click="isMenuOpen = false"
    >
      bramha.
    </router-link>

    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center justify-center w-full">
      <div class="flex items-center gap-6">

        <!-- Logo -->
        <router-link
          to="/"
          class="nav-logo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
        >
          bramha.
        </router-link>

        <!-- Segmented Nav Strip -->
        <div class="seg-strip">
          <router-link
            v-for="link in navLinks"
            :key="link.name"
            :to="link.href"
            custom
            v-slot="{ isActive, navigate }"
          >
            <button
              @click="navigate"
              :class="['seg-btn', isActive ? 'active' : '']"
              :title="link.name"
            >
              {{ link.name }}
            </button>
          </router-link>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3">
          <!-- Material Switcher: ALUM ↔ CFRP -->
          <button
            @click="toggle"
            class="material-switcher focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
            :title="theme === 'dark' ? 'Switch to Aluminium (light mode)' : 'Switch to Carbon Fibre (dark mode)'"
          >
            <span class="material-swatch" :class="theme === 'dark' ? 'swatch-carbon' : 'swatch-alum'"></span>
            <span class="material-label" style="transform: rotate(2deg); display: inline-block;">{{ theme === 'dark' ? 'CFRP' : 'ALUM' }}</span>
          </button>

          <!-- Let's Talk CTA -->
          <a
            href="https://www.linkedin.com/in/bramdal/"
            target="_blank"
            @click="trackContactClick('navbar_desktop')"
            class="deadlock-action-btn px-8 py-3 focus-visible:outline-none"
          >
            <span>Let's Talk</span>
          </a>
        </div>

      </div>
    </div>

    <!-- Mobile Controls -->
    <div class="flex md:hidden items-center gap-3 relative z-50">
      <!-- Mobile Material Switcher -->
      <button
        @click="toggle"
        class="material-switcher focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
        :title="theme === 'dark' ? 'Switch to Aluminium' : 'Switch to Carbon Fibre'"
      >
        <span class="material-swatch" :class="theme === 'dark' ? 'swatch-carbon' : 'swatch-alum'"></span>
        <span class="material-label">{{ theme === 'dark' ? 'CFRP' : 'ALUM' }}</span>
      </button>

      <!-- Hamburger -->
      <button
        @click="isMenuOpen = !isMenuOpen"
        class="hamburger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm p-1"
        :aria-label="isMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <span :class="{'rotate-45 translate-y-[7px]': isMenuOpen}" class="ham-bar"></span>
        <span :class="{'opacity-0': isMenuOpen}" class="ham-bar"></span>
        <span :class="{'-rotate-45 -translate-y-[7px]': isMenuOpen}" class="ham-bar"></span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Teleport to="body">
      <transition name="mobile-menu">
        <div v-if="isMenuOpen" class="mobile-overlay noise-overlay">
          <!-- Seam detail at top -->
          <div class="mobile-seam"></div>

          <nav class="flex flex-col items-center justify-center gap-2 w-full h-full pt-24 pb-12">
            <router-link
              v-for="link in navLinks"
              :key="link.name"
              :to="link.href"
              @click="isMenuOpen = false"
              class="mobile-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-4 py-2"
            >
              {{ link.name }}
            </router-link>

            <div class="mt-8">
              <a
                href="https://www.linkedin.com/in/bramdal/"
                target="_blank"
                @click="trackContactClick('navbar_mobile')"
                class="btn-extruded px-8 py-3 text-sm"
              >
                Let's Talk
              </a>
            </div>
          </nav>
        </div>
      </transition>
    </Teleport>
  </nav>
</template>

<style scoped>
/* ── Nav Rail ── */
.nav-rail {
  background: linear-gradient(180deg, #1A1A1D 0%, #0D0D0F 100%);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0,0,0,0.8);
  padding: 10px 24px;
}

/* ── Logo: Cinzel occult display ── */
.nav-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-border-hi);
  text-decoration: none;
  transition: color 150ms var(--ease-te-snap), text-shadow 150ms var(--ease-te-snap);
  line-height: 1;
  text-shadow: 0 0 12px rgba(197, 168, 114, 0.3);
}
.nav-logo:hover {
  color: var(--color-text);
  text-shadow: 0 0 20px rgba(197, 168, 114, 0.55);
}

/* ── Occult Gauge Indicator — decorative, toggle() still fires ── */
.material-switcher {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--dl-border-radius);
  padding: 4px 10px;
  cursor: pointer;
  box-shadow:
    inset 0 1px 4px rgba(0, 0, 0, 0.6),
    var(--dl-glow-global);
  transition: all 100ms var(--ease-te-snap);
}
.material-switcher:hover {
  border-color: var(--color-border-hi);
  box-shadow:
    inset 0 1px 4px rgba(0, 0, 0, 0.6),
    0 0 10px rgba(197, 168, 114, 0.2);
}
.material-switcher:active {
  transform: translateY(1px);
  box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.8);
}

.material-swatch {
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.swatch-alum {
  background: var(--color-border-hi);
  box-shadow: 0 0 4px var(--color-accent);
  animation: glow-pulse 2.5s ease-in-out infinite alternate;
}
.swatch-carbon {
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
  animation: glow-pulse 1.2s ease-in-out infinite alternate;
}

.material-label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--color-border-hi);
  text-transform: uppercase;
  line-height: 1;
}

/* ── Hamburger ── */
.hamburger {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
}
.ham-bar {
  display: block;
  width: 26px;
  height: 2px;
  background: var(--color-border-hi);
  border-radius: 1px;
  transition: transform 200ms var(--ease-te-slide), opacity 150ms linear;
}

/* ── Mobile Overlay — full obsidian panel ── */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 40;
  box-shadow: inset 0 4px 24px rgba(0,0,0,0.9);
}
.mobile-seam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  box-shadow: 0 0 14px var(--color-accent);
  animation: glow-pulse 2s ease-in-out infinite alternate;
}

.mobile-nav-link {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 2px;
  transition: all 100ms var(--ease-te-snap);
  border: 1px solid transparent;
  width: 280px;
  text-align: center;
}
.mobile-nav-link:hover {
  color: var(--color-border-hi);
  background: var(--color-surface);
  border-color: var(--color-border);
  text-shadow: 0 0 12px rgba(197, 168, 114, 0.4);
}
.mobile-nav-link.router-link-active {
  color: var(--color-accent);
  border-color: var(--color-border);
  background: var(--color-surface);
  text-shadow: 0 0 16px var(--color-accent);
}

/* ── Mobile Menu Transition ── */
.mobile-menu-enter-active {
  transition: opacity 0.15s var(--ease-te-slide), transform 0.15s var(--ease-te-slide);
}
.mobile-menu-leave-active {
  transition: opacity 0.08s var(--ease-te-snap), transform 0.08s var(--ease-te-snap);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
