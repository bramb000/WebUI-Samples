<script setup lang="ts">
import { FlaskConical } from 'lucide-vue-next'
import PrimaryButton from '../PrimaryButton.vue'
</script>

<template>
  <header class="detective-hero-intro">
    <div class="detective-hero-intro__copy">
      <div class="type-hero-stack detective-hero-intro__headline">
        <h1 class="type-display-hero detective-hero-intro__title">
          <span class="type-display-hero-name text-accent">Bramha</span>
        </h1>
        <h2 class="type-hero-role text-accent detective-hero-intro__role">
          Product Alchemist
        </h2>
      </div>
      <p class="detective-hero-intro__tagline">
        7 years of experience in turning engagement into revenue
      </p>
      <PrimaryButton to="/work" class="detective-hero-intro__cta">
        View Work
      </PrimaryButton>
    </div>

    <div
      class="detective-hero-intro__portrait panel-recessed noise-overlay"
      aria-hidden="true"
    >
      <FlaskConical class="detective-hero-intro__portrait-icon" :stroke-width="1.25" />
      <span class="label-segment detective-hero-intro__portrait-label">Portrait asset</span>
    </div>
  </header>
</template>

<style scoped>
.detective-hero-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: clamp(24px, 5vw, 48px);
  min-height: min(92vh, 880px);
  padding-top: clamp(24px, 4vw, 48px);
  padding-bottom: clamp(32px, 6vw, 64px);
}

.detective-hero-intro__title {
  margin: 0;
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.detective-hero-intro__headline .type-display-hero-name {
  margin-block-end: calc(-1 * var(--hero-name-role-overlap));
}

.detective-hero-intro__role {
  margin-block-end: var(--grid-3);
  margin-inline: 0;
  text-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.detective-hero-intro__tagline {
  font-family: var(--font-display);
  font-size: var(--text-body-sm);
  font-weight: 500;
  letter-spacing: var(--tracking-heading-tight);
  line-height: var(--leading-snug);
  max-width: 32rem;
  margin: 0 0 var(--grid-4);
  color: var(--color-text-muted);
}

.detective-hero-intro__cta {
  display: inline-flex;
}

.detective-hero-intro__portrait {
  flex-shrink: 0;
  width: clamp(200px, 28vw, 300px);
  aspect-ratio: 1;
  border-radius: var(--dl-border-radius);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-style: dashed;
  border-color: color-mix(in srgb, var(--color-border) 55%, transparent);
  color: var(--color-text-muted);
}

.detective-hero-intro__portrait-icon {
  width: 64px;
  height: 64px;
  opacity: 0.35;
}

.detective-hero-intro__portrait-label {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .detective-hero-intro {
    flex-direction: column;
    text-align: center;
    justify-content: center;
    min-height: auto;
    padding-top: 24px;
  }

  .detective-hero-intro__tagline {
    margin-inline: auto;
  }

  .detective-hero-intro__cta {
    margin-inline: auto;
  }
}
</style>
