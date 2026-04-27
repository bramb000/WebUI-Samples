<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  role: string;
  timeline: string;
  tags: string[];
}

defineProps<Props>();
</script>

<template>
  <header class="project-hero">
    <!-- Back link -->
    <router-link to="/work" class="hero-back">
      &larr; Back to Work
    </router-link>

    <!-- Tags row -->
    <div class="hero-tags">
      <span v-for="tag in tags" :key="tag" class="label-segment">{{ tag }}</span>
    </div>

    <!-- Title & Intro -->
    <div class="hero-title-block">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-desc">{{ description }}</p>
    </div>

    <!-- Metadata Grid -->
    <div class="hero-meta-grid panel-recessed">
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="indicator-dot"></span>
          <span class="meta-label-text">Role</span>
        </div>
        <p class="meta-value">{{ role }}</p>
      </div>
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="indicator-dot"></span>
          <span class="meta-label-text">Timeline</span>
        </div>
        <p class="meta-value">{{ timeline }}</p>
      </div>
      <div class="hero-meta-cell hero-meta-cell--wide">
        <div class="meta-label">
          <span class="indicator-dot"></span>
          <span class="meta-label-text">Team</span>
        </div>
        <div class="meta-value">
          <slot name="team"></slot>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.project-hero {
  padding: 48px 0 40px;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) { .project-hero { padding: 64px 0 48px; } }

.hero-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 100ms var(--ease-te-snap), color 100ms var(--ease-te-snap);
  border-left: 2px solid var(--color-border);
  padding-left: 10px;
}
.hero-back:hover {
  opacity: 1;
  color: var(--color-border-hi);
  border-left-color: var(--color-accent);
  text-shadow: 0 0 10px rgba(197, 168, 114, 0.3);
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.hero-title-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
}
.hero-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(28px, 6vw, 52px);
  letter-spacing: 0.06em;
  line-height: 1.1;
  color: var(--color-text);
  margin: 0;
  border-left: 4px solid var(--color-accent);
  padding-left: 16px;
  animation: glow-pulse 3s ease-in-out infinite alternate;
  text-shadow: 0 0 30px rgba(197, 168, 114, 0.08);
}
.hero-desc {
  font-family: var(--font-sans);
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.75;
  margin: 0;
  padding-left: 20px;
}

/* Metadata panel */
.hero-meta-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  overflow: hidden;
}
@media (min-width: 768px) {
  .hero-meta-grid { grid-template-columns: 1fr 1fr 2fr; }
}

.hero-meta-cell {
  padding: 16px 20px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hero-meta-cell:last-child { border-right: none; }
.hero-meta-cell--wide { grid-column: 1 / -1; border-right: none; border-top: 1px solid var(--color-border); }
@media (min-width: 768px) {
  .hero-meta-cell--wide { grid-column: auto; border-top: none; border-right: none; }
}

.meta-label {
  display: flex;
  align-items: center;
  gap: 6px;
}
.meta-label-text {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-text-muted);
}
.meta-value {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
