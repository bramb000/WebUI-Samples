<script setup lang="ts">
import type { ClientName } from '../assets/images/clients/clientLogos';
import { CLIENT_LOGOS } from '../assets/images/clients/clientLogos';

interface Props {
  title: string;
  description: string;
  role: string;
  timeline: string;
  tags: string[];
  client?: ClientName;
}

defineProps<Props>();
</script>

<template>
  <header class="project-hero">
    <!-- Tags row -->
    <div class="hero-tags">
      <span v-if="client" class="dl-plaque hero-client-tag">
        <img
          class="hero-client-logo"
          :src="CLIENT_LOGOS[client]"
          :alt="`${client} logo`"
        />
        <span>{{ client }}</span>
      </span>
      <span v-for="tag in tags" :key="tag" class="dl-plaque">{{ tag }}</span>
    </div>

    <!-- Title & Intro -->
    <div class="hero-title-block">
      <h1 class="type-hero-title">{{ title }}</h1>
      <p class="type-case-body-lg text-muted">{{ description }}</p>
    </div>

    <!-- Metadata Grid -->
    <div
      class="hero-meta-grid panel-recessed panel-recessed--borderless panel-recessed--pencil-frame"
      :class="{ 'hero-meta-grid--no-team': !$slots.team }"
    >
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
      <div v-if="$slots.team" class="hero-meta-cell hero-meta-cell--wide">
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
  padding: var(--case-study-hero-padding-top) 0 0;
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--grid-3);
}
@media (min-width: 768px) {
  .project-hero {
    padding-top: var(--case-study-hero-padding-top-md);
  }
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: calc(var(--grid-1) * 0.75);
}

.project-hero .dl-plaque {
  padding: calc(var(--grid-1) / 2) var(--grid-2);
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

.hero-client-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--grid-1);
}

.hero-client-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.hero-title-block {
  display: flex;
  flex-direction: column;
  gap: var(--grid-2);
  max-width: var(--case-study-hero-title-max);
}
.project-hero .type-hero-title {
  margin: 0;
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.project-hero .type-case-body-lg {
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
  .hero-meta-grid--no-team { grid-template-columns: 1fr 1fr; }
}

.hero-meta-cell {
  padding: var(--grid-2) var(--case-study-list-indent);
  display: flex;
  flex-direction: column;
  gap: var(--grid-1);
}
.hero-meta-cell--wide { grid-column: 1 / -1; }
@media (min-width: 768px) {
  .hero-meta-cell--wide { grid-column: auto; }
}

.meta-label {
  display: flex;
  align-items: center;
  gap: calc(var(--grid-1) * 0.75);
}
.project-hero .type-meta-value {
  margin: 0;
}
</style>
