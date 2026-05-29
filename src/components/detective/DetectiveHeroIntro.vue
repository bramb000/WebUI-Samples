<template>
  <header class="detective-hero-intro">
    <div class="detective-hero-intro__copy">
      <div class="type-hero-stack detective-hero-intro__headline">
        <h1 class="type-display-hero detective-hero-intro__title">
          <span class="type-display-hero-name text-accent">Bramha</span>
        </h1>
        <h2 class="type-hero-role text-accent detective-hero-intro__role">
          Product Specialist
        </h2>
      </div>
      <p class="detective-hero-intro__tagline">
        7 years of experience in turning engagement into revenue
      </p>
    </div>
  </header>
</template>

<style scoped>
.detective-hero-intro {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
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
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .detective-hero-intro {
    justify-content: center;
    text-align: center;
    min-height: auto;
    padding-top: 24px;
  }

  .detective-hero-intro__tagline {
    margin-inline: auto;
  }
}
</style>
