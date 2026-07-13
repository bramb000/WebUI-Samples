<script setup lang="ts">
import { computed, /* defineAsyncComponent, */ provide, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { captureEvent /*, captureVfxRenderStatus */ } from '../analytics';
// import { useLowPowerMode } from '../composables/useLowPowerMode';
import { NAV_SCROLL_REFRESH_KEY, useNavAutoHide } from '../composables/useNavAutoHide';
// Hover flame (WebGL wisp on CTA / nav buttons) — temporarily disabled
// import { setWispHover, triggerWispClick } from '../composables/wispState';

// const WebGLWisp = defineAsyncComponent(() => import('./WebGLWisp.vue'));
// const lowPower = useLowPowerMode();
// const showWisp = computed(() => !lowPower.value);

const route = useRoute();
const isMenuOpen = ref(false);

const { scrolledAway: navScrolledAway, refresh: refreshNavScroll } = useNavAutoHide();
provide(NAV_SCROLL_REFRESH_KEY, refreshNavScroll);
const isNavHidden = computed(() => navScrolledAway.value && !isMenuOpen.value);

// watch(showWisp, (show) => {
//   if (!show)
//     captureVfxRenderStatus('nav_wisp', { mode: 'disabled', reason: 'low_power' })
// }, { immediate: true })

watch(isMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

type NavLink = {
  name: string
  href: string
  external?: boolean
}

const navLinks: NavLink[] = [
  { name: 'Work', href: '/work' },
  { name: 'About', href: '/about' },
  { name: 'Let\'s Talk', href: 'https://www.linkedin.com/in/bramdal/', external: true },
];

const trackContactClick = (source: string) => {
  captureEvent('contact_clicked', { source });
};

function prefetchRoute(importer: () => Promise<unknown>) {
  void importer();
}

function onNavLinkEnter(link: NavLink, _el: HTMLElement) {
  // setWispHover(el);
  if (link.href === '/work')
    prefetchRoute(() => import('../views/ProjectSelect.vue'));
}

function onExternalNavClick(source: string) {
  trackContactClick(source);
}
</script>

<template>
  <header
    class="dl-nav-shell"
    :class="{ 'dl-nav-shell--hidden': isNavHidden }"
  >
  <div class="dl-nav-ledge-bg" aria-hidden="true"></div>
  <nav
    class="dl-nav-bar w-full flex justify-between md:justify-center items-center py-4 px-6 md:px-12"
  >
    <!-- Hover flame (WebGL wisp) — temporarily disabled
    <WebGLWisp v-if="showWisp" />
    -->

    <div class="flex items-center justify-between md:justify-center w-full">
      <div class="flex items-center gap-6">
        <router-link
          to="/"
          class="nav-logo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
          @click="isMenuOpen = false"
        >
          <span>bramha.</span>
        </router-link>

        <div class="hidden md:inline-flex seg-strip">
          <!-- Hover flame handlers disabled on these links:
               @mouseleave="() => setWispHover(null)"
               @mousedown="triggerWispClick"
               and on external: @mouseenter="(e) => setWispHover(e.currentTarget as HTMLElement)"
          -->
          <template v-for="link in navLinks" :key="link.name">
            <router-link
              v-if="!link.external"
              :to="link.href"
              :class="['seg-btn', route.path === link.href || (link.href !== '/' && route.path.startsWith(link.href)) ? 'active' : '']"
              :title="link.name"
              @mouseenter="(e) => onNavLinkEnter(link, e.currentTarget as HTMLElement)"
            >
              <span>{{ link.name }}</span>
            </router-link>

            <a
              v-else
              :href="link.href"
              target="_blank"
              rel="noopener noreferrer"
              class="seg-btn"
              :title="link.name"
              @click="onExternalNavClick('navbar_desktop')"
            >
              <span>{{ link.name }}</span>
            </a>
          </template>
        </div>
      </div>

      <!-- Mobile Controls -->
      <div class="flex md:hidden items-center gap-3 relative z-50">
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
    </div>

    <!-- Mobile Menu Overlay -->
    <Teleport to="body">
      <transition name="mobile-menu">
        <div v-if="isMenuOpen" class="mobile-overlay noise-overlay">
          <div class="mobile-seam"></div>

          <nav class="flex flex-col items-center justify-center gap-2 w-full h-full pt-24 pb-12">
            <template v-for="link in navLinks" :key="link.name">
              <router-link
                v-if="!link.external"
                :to="link.href"
                @click="isMenuOpen = false"
                class="mobile-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-4 py-2"
              >
                <span>{{ link.name }}</span>
              </router-link>

              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                class="mobile-nav-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm px-4 py-2"
                @click="isMenuOpen = false; onExternalNavClick('navbar_mobile')"
              >
                <span>{{ link.name }}</span>
              </a>
            </template>
          </nav>
        </div>
      </transition>
    </Teleport>
  </nav>
  </header>
</template>

<style scoped>
.dl-nav-shell {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 72px;
  transition: transform 0.28s var(--ease-te-snap);
  will-change: transform;
}

.dl-nav-shell--hidden {
  transform: translateY(-100%);
  pointer-events: none;
}

.dl-nav-ledge-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.dl-nav-bar {
  position: relative;
  z-index: 1;
  height: 72px;
  box-sizing: border-box;
  transition:
    background-color 0.25s var(--ease-te-snap),
    color 0.25s var(--ease-te-snap);
}

@media (prefers-reduced-motion: reduce) {
  .dl-nav-shell {
    transition-duration: 0.01ms;
  }
  .dl-nav-shell--hidden {
    transform: none;
    pointer-events: auto;
  }
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-border-hi);
  text-decoration: none;
  transition: color 150ms var(--ease-te-snap);
  line-height: 1;
}
.nav-logo:hover {
  color: var(--color-text);
}

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

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 95;
  box-shadow: inset 0 4px 24px rgba(26, 24, 20, 0.08);
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
