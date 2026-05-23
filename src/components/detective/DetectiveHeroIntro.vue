<script setup lang="ts">
import { FlaskConical } from 'lucide-vue-next'
</script>

<template>
  <header class="detective-hero-intro">
    <div class="detective-hero-intro__copy">
      <p class="label-segment detective-hero-intro__eyebrow">Portfolio</p>
      <h1 class="type-display-hero detective-hero-intro__title">
        Hi, I'm<br>
        <span class="text-accent">Bramha</span>
      </h1>
      <h2 class="detective-hero-intro__role type-hero-title text-accent">
        Product Alchemist
      </h2>
      <p class="type-body-lg text-muted detective-hero-intro__value">
        I craft products that make users happy and make businesses money.
      </p>
      <a href="#alchemist-book" class="detective-hero-intro__scroll-cta label-segment">
        Explore my process ↓
      </a>
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

.detective-hero-intro__eyebrow {
  margin-bottom: 12px;
}

.detective-hero-intro__title {
  margin: 0 0 8px;
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.detective-hero-intro__role {
  margin: 0 0 20px;
  text-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.detective-hero-intro__value {
  max-width: 32rem;
  margin: 0 0 28px;
}

.detective-hero-intro__scroll-cta {
  display: inline-block;
  color: var(--color-accent);
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 150ms ease, text-shadow 150ms ease;
}

.detective-hero-intro__scroll-cta:hover {
  opacity: 1;
  text-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 35%, transparent);
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

  .detective-hero-intro__value {
    margin-inline: auto;
  }
}
</style>
