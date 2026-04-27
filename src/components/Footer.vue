<script setup lang="ts">
import posthog from 'posthog-js'

const trackSocialClick = (platform: string) => {
  posthog.capture('social_clicked', { platform, source: 'footer' })
}

const trackEmailClick = () => {
  posthog.capture('email_clicked', { source: 'footer' })
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

        <!-- Skill Tags (PCB component labels) -->
        <div class="footer-tags">
          <span class="label-segment">User Research</span>
          <span class="label-segment">UX Design</span>
          <span class="label-segment">Web Design</span>
          <span class="label-segment">App Design</span>
          <span class="label-segment">Game Design</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="footer-cta-btn-row">
        <a
          href="https://www.linkedin.com/in/bramdal/"
          target="_blank"
          @click="trackSocialClick('linkedin_footer_cta')"
          class="btn-extruded footer-cta-btn"
        >
          Get in touch
        </a>
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
            <span class="indicator-dot"></span>
            LinkedIn
          </a>
          <a
            href="mailto:hello@bramha.work"
            @click="trackEmailClick"
            class="footer-link"
          >
            <span class="indicator-dot"></span>
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
  margin-top: 96px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow:
    inset 0 6px 24px rgba(0, 0, 0, 0.8),
    0 -1px 0 rgba(197, 168, 114, 0.08),
    var(--dl-glow-global);
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

/* ── Display Heading — Cinzel with occult glow ── */
.footer-heading {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(26px, 4.5vw, 46px);
  letter-spacing: 0.06em;
  line-height: 1.15;
  color: var(--color-text);
  margin: 0 0 12px 0;
  text-shadow:
    0 0 24px rgba(197, 168, 114, 0.15),
    0 1px 0 rgba(0, 0, 0, 0.5);
}

.footer-subheading {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-text-muted);
  margin: 0;
  opacity: 0.75;
}

/* ── Tags ── */
.footer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 280px;
}

/* ── CTA Button Row ── */
.footer-cta-btn-row {
  display: flex;
}
.footer-cta-btn {
  padding: 12px 28px;
  font-size: 12px;
}

/* ── Divider — brass hairline ── */
.footer-divider {
  border-top: 1px solid var(--color-border);
  opacity: 0.4;
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
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--color-text-muted);
  margin: 0;
  opacity: 0.6;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--color-text-muted);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 100ms var(--ease-te-snap), color 100ms var(--ease-te-snap);
}
.footer-link:hover {
  opacity: 1;
  color: var(--color-border-hi);
}
.footer-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}
</style>
