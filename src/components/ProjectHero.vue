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
    <!-- Tags row -->
    <div class="hero-tags">
      <span v-for="tag in tags" :key="tag" class="dl-plaque">{{ tag }}</span>
    </div>

    <!-- Title & Intro -->
    <div class="hero-title-block">
      <h1 class="hero-title">{{ title }}</h1>
      <p class="hero-desc">{{ description }}</p>
    </div>

    <!-- Metadata Grid -->
    <div class="hero-meta-grid panel-recessed panel-recessed--borderless">
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="meta-label-text">Role</span>
        </div>
        <p class="meta-value">{{ role }}</p>
      </div>
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="meta-label-text">Timeline</span>
        </div>
        <p class="meta-value">{{ timeline }}</p>
      </div>
      <div class="hero-meta-cell hero-meta-cell--wide">
        <div class="meta-label">
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
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) { .project-hero { padding: 64px 0 48px; } }

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.dl-plaque {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  padding: 4px 12px;
  background: var(--color-surface);
  border: none;
  color: var(--color-text);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.5);
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
  padding-left: 0;
  text-shadow: 0 0 30px rgba(197, 168, 114, 0.08);
}
.hero-desc {
  font-family: var(--font-sans);
  font-size: clamp(15px, 2vw, 18px);
  line-height: 1.7;
  color: var(--color-text);
  opacity: 0.75;
  margin: 0;
  padding-left: 0;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hero-meta-cell--wide { grid-column: 1 / -1; }
@media (min-width: 768px) {
  .hero-meta-cell--wide { grid-column: auto; }
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
