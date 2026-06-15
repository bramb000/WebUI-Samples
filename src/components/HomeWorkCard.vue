<script setup lang="ts">
import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import CaseCreamInsight from './CaseCreamInsight.vue'

interface Props {
  year: string
  company: string
  title: string
  description: string
  to: RouteLocationRaw
  poster?: string
  video?: string
  visualPlaceholder?: boolean
  transparentVisual?: boolean
}

const props = defineProps<Props>()

const hasVideo = computed(
  () => !!props.video && /\.webm($|\?)/i.test(props.video),
)

const showCreamPanel = computed(
  () => !props.transparentVisual && !props.visualPlaceholder,
)
</script>

<template>
  <router-link :to="to" class="home-work-card">
    <div class="home-work-card__body">
      <p class="home-work-card__meta type-meta-label">
        <span>{{ year }}</span>
        <span class="home-work-card__delimiter" aria-hidden="true">·</span>
        <span>{{ company }}</span>
      </p>
      <div class="home-work-card__headline">
        <h3 class="home-work-card__title type-section-title">{{ title }}</h3>
        <p class="home-work-card__desc type-body-lg text-muted">{{ description }}</p>
      </div>
    </div>

    <CaseCreamInsight
      v-if="showCreamPanel"
      class="home-work-card__visual"
      media-only
      :grain-key="title"
    >
      <video
        v-if="hasVideo"
        class="home-work-card__media"
        :src="video"
        :poster="poster"
        autoplay
        loop
        muted
        playsinline
        disablepictureinpicture
        preload="metadata"
        :aria-label="title"
      />
      <img
        v-else-if="poster"
        class="home-work-card__media"
        :src="poster"
        :alt="`${title} preview`"
        loading="lazy"
        decoding="async"
      />
    </CaseCreamInsight>

    <div
      v-else
      class="home-work-card__visual"
      :class="{
        'home-work-card__visual--transparent': transparentVisual,
        'home-work-card__visual--placeholder': visualPlaceholder,
      }"
      :aria-hidden="visualPlaceholder || undefined"
    >
      <video
        v-if="hasVideo"
        class="home-work-card__media"
        :src="video"
        :poster="poster"
        autoplay
        loop
        muted
        playsinline
        disablepictureinpicture
        preload="metadata"
        :aria-label="title"
      />
      <img
        v-else-if="poster"
        class="home-work-card__media"
        :src="poster"
        :alt="`${title} preview`"
        loading="lazy"
        decoding="async"
      />
    </div>
  </router-link>
</template>

<style scoped>
.home-work-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, clamp(16rem, 48vw, 30rem));
  gap: clamp(var(--grid-3), 4vw, var(--grid-5));
  align-items: center;
  text-decoration: none;
  color: inherit;
  padding: clamp(var(--grid-3), 3vw, var(--grid-4));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--dl-border-radius);
  transition: border-color 150ms ease;
}

.home-work-card:hover {
  border-color: var(--color-accent);
}

.home-work-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--grid-3);
  min-width: 0;
}

.home-work-card__headline {
  display: flex;
  flex-direction: column;
  gap: var(--grid-1);
}

.home-work-card__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.home-work-card__delimiter {
  color: var(--color-border-hi);
}

.home-work-card__title,
.home-work-card__desc {
  margin: 0;
}

.home-work-card__visual {
  position: relative;
  aspect-ratio: 4 / 3;
  align-self: center;
  min-width: 0;
  overflow: visible;
}

.home-work-card__visual--transparent,
.home-work-card__visual--placeholder {
  overflow: hidden;
  background: transparent;
  border: none;
  box-shadow: none;
}

.home-work-card__visual--placeholder {
  visibility: hidden;
}

.home-work-card__media {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: var(--home-work-video-cream);
}

@media (max-width: 767px) {
  .home-work-card {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }

  .home-work-card__visual {
    width: min(100%, 24rem);
    justify-self: end;
  }

  /* Let touch scroll pass through video to the page (iOS intercepts otherwise) */
  .home-work-card__media {
    pointer-events: none;
  }
}
</style>
