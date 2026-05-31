<script setup lang="ts">
import { DEFAULT_ROLE_LABEL } from '../../constants/campaignRoles'

withDefaults(
  defineProps<{
    roleLabel?: string
  }>(),
  { roleLabel: DEFAULT_ROLE_LABEL },
)
</script>

<template>
  <header class="detective-hero-intro">
    <div class="type-hero-stack detective-hero-intro__headline">
      <h1 class="type-display-hero detective-hero-intro__title">
        <span class="type-display-hero-name text-accent">Bramha</span>
      </h1>
      <h2 class="type-hero-role text-accent detective-hero-intro__role">
        {{ roleLabel }}
      </h2>
    </div>
    <p class="type-hero-tagline detective-hero-intro__tagline">
      <span class="detective-hero-intro__tagline-line">7 years of experience in</span>
      <span class="detective-hero-intro__tagline-line detective-hero-intro__tagline-line--sub">
        turning <span class="text-accent">engagement</span> into <span class="text-accent">revenue</span>
      </span>
    </p>
  </header>
</template>

<style scoped>
.detective-hero-intro {
  position: relative;
  width: 100%;
  min-height: var(--home-hero-min-height, calc(100vh - 72px));
  height: var(--home-hero-min-height, calc(100vh - 72px));
  box-sizing: border-box;
}

.detective-hero-intro__headline {
  position: absolute;
  inset-inline: 0;
  top: var(--hero-thirds-first-line);
  transform: translateY(-50%);
  margin: 0;
}

.detective-hero-intro__title {
  margin: 0;
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.detective-hero-intro__headline .type-display-hero-name {
  margin-block-end: calc(-1 * var(--hero-name-role-overlap));
}

.detective-hero-intro__role {
  margin: 0;
  text-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.detective-hero-intro__tagline {
  position: absolute;
  inset-inline: 0;
  top: var(--hero-thirds-second-line);
  transform: translateY(-50%);
  margin: 0;
}

.detective-hero-intro__tagline-line {
  display: block;
}

.detective-hero-intro__tagline-line--sub {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .detective-hero-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--grid-4);
    min-height: auto;
    height: auto;
    padding-block: 24px 16px;
    text-align: center;
  }

  .detective-hero-intro__headline,
  .detective-hero-intro__tagline {
    position: static;
    transform: none;
  }

  .detective-hero-intro__tagline-line--sub {
    white-space: normal;
  }
}
</style>
