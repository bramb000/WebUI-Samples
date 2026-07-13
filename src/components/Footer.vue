<script setup lang="ts">
import { captureEvent } from '../analytics'
// Hover flame (WebGL wisp on CTA button) — temporarily disabled
// import { setWispHover, triggerWispClick } from '../composables/wispState'
import PrimaryButton from './PrimaryButton.vue';

const trackSocialClick = (platform: string) => {
  captureEvent('social_clicked', { platform, source: 'footer' })
}

const trackEmailClick = () => {
  captureEvent('email_clicked', { source: 'footer' })
}
</script>

<template>
  <footer class="footer-plate noise-overlay">

    <!-- Hard Mechanical Seam -->
    <div class="footer-seam"></div>

    <div class="footer-inner">

      <!-- CTA Section -->
      <div class="footer-cta-row">
        <div class="footer-cta-text">
          <h2 class="footer-heading">Let's make some magic happen.</h2>
          <p class="footer-subheading">Ready to improve your retention or monetisation metrics? Contact me</p>
        </div>

        <!-- Skill Tags (Metal Plaques) -->
        <div class="footer-tags">
          <span class="dl-plaque dl-plaque-game">User Research</span>
          <span class="dl-plaque dl-plaque-web">UX Design</span>
          <span class="dl-plaque dl-plaque-web">Web Design</span>
          <span class="dl-plaque dl-plaque-mobile">App Design</span>
          <span class="dl-plaque dl-plaque-game">Game Design</span>
        </div>
      </div>

      <!-- CTA Button -->
      <!-- Hover flame handlers disabled:
           @mouseenter="(e) => setWispHover(e.currentTarget as HTMLElement)"
           @mouseleave="() => setWispHover(null)"
           @mousedown="triggerWispClick"
      -->
      <div class="footer-cta-btn-row">
        <PrimaryButton
          href="https://www.linkedin.com/in/bramdal/"
          target="_blank"
          @click="trackSocialClick('linkedin_footer_cta')"
        >
          Get in touch
        </PrimaryButton>
      </div>

      <!-- Divider -->
      <div class="footer-divider"></div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p class="footer-copyright">&copy; {{ new Date().getFullYear() }} Bramha Dalvi. All rights reserved.</p>
        <div class="footer-links">
          <a
            href="https://www.linkedin.com/in/bramdal/"
            target="_blank"
            @click="trackSocialClick('linkedin')"
            class="footer-link"
          >
            LinkedIn
          </a>
          <a
            href="mailto:hello@bramha.work"
            @click="trackEmailClick"
            class="footer-link"
          >
            Email
          </a>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
/* ── Obsidian Mounting Plate ── */
.footer-plate {
  margin-top: var(--grid-8);
  background: var(--color-surface);
  border-top: 2px solid var(--color-border);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, white 65%, transparent),
    0 -4px 20px rgba(26, 24, 20, 0.06);
}

/* Brass accent seam — occult gradient, not flat orange */
.footer-seam {
  height: 2px;
  background: linear-gradient(90deg, transparent 5%, var(--color-accent) 30%, var(--color-border-hi) 50%, var(--color-accent) 70%, transparent 95%);
  box-shadow: 0 0 16px var(--color-accent), 0 0 32px color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  position: relative;
  z-index: 50;
}
@media (min-width: 768px) {
  .footer-inner { padding: 80px 48px; }
}

/* ── CTA Row ── */
.footer-cta-row {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
@media (min-width: 768px) {
  .footer-cta-row {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

/* ── Display Heading — primary with accent glow ── */
.footer-heading {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 4.5vw, 46px);
  letter-spacing: 0.06em;
  line-height: 1.15;
  margin: 0 0 12px 0;
}

.footer-subheading {
  font-family: var(--font-sans);
  font-size: var(--text-label);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
  color: var(--color-text-muted);
  margin: 0;
}

/* ── Tags ── */
.footer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* ── CTA Button Row ── */
.footer-cta-btn-row {
  display: flex;
}

/* ── Divider ── */
.footer-divider {
  border-top: var(--dl-border-width) solid var(--color-border);
  margin: 0;
}

/* ── Bottom ── */
.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
  }
}

.footer-copyright {
  font-family: var(--font-sans);
  font-size: var(--text-label-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-label);
  color: var(--color-text-muted);
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-size: var(--text-label-sm);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-label-md);
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 100ms var(--ease-te-snap);
}
.footer-link:hover {
  color: var(--color-text);
}
.footer-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}
</style>
