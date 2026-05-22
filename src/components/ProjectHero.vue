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
      <h1 class="type-hero-title">{{ title }}</h1>
      <p class="type-body-lg text-muted">{{ description }}</p>
    </div>

    <!-- Metadata Grid -->
    <div class="hero-meta-grid panel-recessed panel-recessed--borderless">
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="type-meta-label">Role</span>
        </div>
        <p class="type-meta-value">{{ role }}</p>
      </div>
      <div class="hero-meta-cell">
        <div class="meta-label">
          <span class="type-meta-label">Timeline</span>
        </div>
        <p class="type-meta-value">{{ timeline }}</p>
      </div>
      <div class="hero-meta-cell hero-meta-cell--wide">
        <div class="meta-label">
          <span class="type-meta-label">Team</span>
        </div>
        <div class="type-meta-value">
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

.project-hero .dl-plaque {
  padding: 4px 12px;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--color-border) 30%, transparent);
  color: var(--color-text);
  box-shadow: none;
  transition: none;
}

.project-hero .dl-plaque:hover {
  background: transparent;
  color: var(--color-text);
  box-shadow: none;
  border-color: color-mix(in srgb, var(--color-border) 30%, transparent);
  animation: none;
}

.hero-title-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
}
.project-hero .type-hero-title {
  margin: 0;
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.project-hero .type-body-lg {
  margin: 0;
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
.project-hero .type-meta-value {
  margin: 0;
}
</style>
