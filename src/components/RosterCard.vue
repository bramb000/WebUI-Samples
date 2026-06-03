<script setup lang="ts">
import { computed } from 'vue'
import type { RosterDiscipline } from '../constants/rosterDiscipline'

export type RosterCardVariant = 'default' | 'case-study'
export type RosterCardPlateTypography = 'default' | 'achievement'

export type RosterCardRoster = {
  points: string
  color1: string
  color2: string
  label: string
}

interface Props {
  id: string
  discipline: RosterDiscipline
  title: string
  /** Project art / video — only when `showMedia` is true (e.g. home achievements). */
  thumb?: string
  /** WebP/PNG poster while a `.webm` thumb decodes */
  thumbPoster?: string
  /** When false, card is parchment + title only (work roster grid). */
  showMedia?: boolean
  roster: RosterCardRoster
  plateGrain?: string
  variant?: RosterCardVariant
  plateTypography?: RosterCardPlateTypography
  clientName?: string
  /** When false, plate shows `clientName` only (no “for ” prefix). Default true. */
  clientPrefix?: boolean
  selected?: boolean
  pressed?: boolean
  /** When false, skips scale/sway hover keyframes (e.g. home achievement strip). */
  hoverMotion?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  plateTypography: 'default',
  selected: false,
  pressed: false,
  hoverMotion: true,
  clientPrefix: true,
  showMedia: false,
})

const isThumbVideo = computed(
  () => props.showMedia && !!props.thumb && /\.webm($|\?)/i.test(props.thumb),
)
</script>

<template>
  <div
    class="thumbnail"
    :class="[
      `thumbnail--${discipline}`,
      {
        'thumbnail--case-study': variant === 'case-study',
        'thumbnail--text-only': !showMedia,
        'thumbnail--achievement-plate': plateTypography === 'achievement',
        'thumbnail--calm-hover': !hoverMotion,
        selected,
        pressed,
      },
    ]"
    :data-roster-discipline="discipline"
    :id="`proj-${id}`"
    role="option"
    :aria-selected="selected"
  >
    <div
      class="inner-card"
      :class="{
        'inner-card--case-study': variant === 'case-study',
        'inner-card--case-study-solo': variant === 'case-study' && !clientName,
        'inner-card--text-only': !showMedia,
      }"
    >
      <div v-if="showMedia" class="card-art">
        <video
          v-if="isThumbVideo"
          class="card-art-img"
          :src="thumb"
          :poster="thumbPoster"
          autoplay
          loop
          muted
          playsinline
          disablepictureinpicture
          preload="metadata"
          :aria-label="title"
        />
        <img
          v-else
          class="card-art-img"
          :src="thumb"
          :alt="title"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="card-name-plate">
        <img
          v-if="plateGrain"
          class="card-plate-grain"
          :src="plateGrain"
          alt=""
          aria-hidden="true"
        />
        <div v-else class="card-plate-grain card-plate-grain--fallback" aria-hidden="true" />
      </div>

      <svg class="paper-svg" viewBox="0 0 100 140" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient :id="`grad_${id}`" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="roster.color1" />
            <stop offset="100%" :stop-color="roster.color2" />
          </linearGradient>
        </defs>
        <polygon
          class="card-poly"
          :points="roster.points"
          :fill="`url(#grad_${id})`"
          stroke-width="2"
          vector-effect="non-scaling-stroke"
        />
        <polygon class="card-overlay" :points="roster.points" fill="url(#dim_grad)" />
      </svg>

      <div class="thumbnail-content">
        <span
          class="thumbnail-label"
          :class="plateTypography === 'achievement' ? 'type-roster-achievement-title' : 'type-roster-card-title'"
        >{{ title }}</span>
        <span
          v-if="variant === 'case-study' && clientName && plateTypography !== 'achievement'"
          class="thumbnail-client"
          :class="'type-roster-card-client'"
        >
          {{ clientPrefix ? `for ${clientName}` : clientName }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
  --roster-plate-base: var(--roster-card-plate-base);
  --roster-grain-fallback: var(--roster-card-grain-base);
  --roster-card-settle-duration: calc(0.125s / 2.5);
  aspect-ratio: 1 / 1.4;
  cursor: pointer;
  position: relative;
  z-index: 1;
  min-width: 0;
  isolation: isolate;
  container-type: inline-size;
}

.thumbnail--case-study {
  aspect-ratio: 1 / 1.72;
}

.thumbnail--text-only {
  aspect-ratio: 1 / 1.12;
}

.thumbnail--text-only.thumbnail--case-study {
  aspect-ratio: 1 / 1.28;
}

.inner-card {
  position: absolute;
  inset: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: 60fr 40fr;
  grid-template-areas:
    'art'
    'plate';
  border-radius: 12px;
  border: none;
  box-shadow: var(--roster-card-shadow);
  background: var(--roster-card-surface);
  --roster-sketch-stroke: 2px;
  transition: box-shadow 0.15s ease;
}

/* Pencil sketch rim — width jitter via layered strokes + noise displacement (max 2px / 4px selected) */
.inner-card::before,
.inner-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 15;
  border-style: solid;
  border-color: var(--roster-card-border);
  transition: border-color 0.15s ease, border-width 0.15s ease, opacity 0.15s ease;
}

.inner-card::before {
  border-width: var(--roster-sketch-stroke);
  filter: url(#roster-pencil-border);
}

.inner-card::after {
  inset: 1px;
  border-radius: 11px;
  border-width: 1px;
  opacity: 0.42;
  filter: url(#roster-pencil-border-alt);
}

.inner-card--case-study {
  grid-template-rows: 58fr 42fr;
}

.inner-card--text-only {
  grid-template-rows: minmax(0, 1fr);
  grid-template-areas: 'plate';
}

.card-art {
  grid-area: art;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--roster-card-surface-deep);
}

.card-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

.card-name-plate {
  grid-area: plate;
  position: relative;
  z-index: 2;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
  background-color: var(--roster-plate-base);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 45%, transparent);
}

.card-plate-grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: fill;
  mix-blend-mode: multiply;
  opacity: var(--roster-card-grain-opacity, 0.41);
  pointer-events: none;
  user-select: none;
}

.card-plate-grain--fallback {
  background-color: var(--roster-grain-fallback);
  -webkit-mask-image: var(--roster-paint-mask);
  mask-image: var(--roster-paint-mask);
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-mode: alpha;
  mask-mode: alpha;
  mix-blend-mode: multiply;
  opacity: var(--roster-card-grain-fallback-opacity, 0.21);
}

.paper-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  opacity: 0;
  pointer-events: none;
  transition: filter 0.15s;
}

.card-poly {
  stroke: transparent;
  transition: stroke 0.15s;
}

.card-overlay {
  transition: opacity 0.2s;
}

.thumbnail-content {
  grid-area: plate;
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 100%;
  padding: 12px 14px;
  pointer-events: none;
  text-align: center;
  box-sizing: border-box;
}

.inner-card--case-study:not(.inner-card--text-only):not(.inner-card--case-study-solo) .thumbnail-content {
  justify-content: flex-end;
}

.inner-card--text-only .thumbnail-content {
  justify-content: center;
}

/* Work grid case studies — title centred in plate, client along bottom edge */
.inner-card--text-only.inner-card--case-study:not(.inner-card--case-study-solo) .thumbnail-content {
  justify-content: flex-start;
  gap: 0;
}

.inner-card--text-only.inner-card--case-study:not(.inner-card--case-study-solo) .thumbnail-label {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block: 0;
  min-height: 0;
  width: 100%;
}

.inner-card--text-only.inner-card--case-study:not(.inner-card--case-study-solo) .thumbnail-client {
  flex: 0 0 auto;
  margin-top: 0;
  width: 100%;
}

.thumbnail-label {
  color: var(--roster-card-text);
  transition: color 0.15s, text-shadow 0.15s;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.inner-card--case-study:not(.inner-card--case-study-solo) .thumbnail-label {
  margin-block: auto 0;
}

/* Case-study without client row — vertically centered title in the plate */
.inner-card--case-study-solo .thumbnail-content {
  justify-content: center;
}

.inner-card--case-study-solo .thumbnail-label {
  margin-block: 0;
}

.thumbnail-client {
  color: var(--roster-card-text-muted);
  margin-top: auto;
}

.thumbnail--achievement-plate .thumbnail-content {
  justify-content: center;
  padding: var(--roster-achievement-plate-padding);
  gap: 8px;
}

.thumbnail--achievement-plate .inner-card--case-study .thumbnail-content {
  justify-content: center;
}

.thumbnail--achievement-plate .inner-card--case-study .thumbnail-label {
  margin-block: 0;
}

/* Display strip — stable hit target; glow only, no scale/sway loop */
.thumbnail--calm-hover:hover:not(.selected):not(.pressed),
.thumbnail--calm-hover:not(:hover):not(.selected):not(.pressed) {
  animation: none;
  transform: none;
}

.thumbnail--calm-hover:hover .inner-card {
  animation: none;
  filter: none;
}

.thumbnail--calm-hover:hover,
.thumbnail--calm-hover.pressed {
  z-index: auto;
}

.thumbnail--calm-hover.pressed {
  transform: none;
}

.thumbnail:hover:not(.selected):not(.pressed) {
  animation: crunchAndPop 0.65s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards;
}

.thumbnail:not(:hover):not(.selected):not(.pressed) {
  animation: settleBack var(--roster-card-settle-duration) ease-out forwards;
}

.thumbnail:not(:hover):not(.selected):not(.pressed) .inner-card {
  transition: transform var(--roster-card-settle-duration) ease-out;
}

.thumbnail:hover:not(.selected):not(.pressed) .inner-card {
  animation: cardSway 4.1s ease-in-out infinite;
  filter: url(#paper-crumple);
}

.thumbnail:hover:not(.selected) .inner-card::before,
.thumbnail:hover:not(.selected) .inner-card::after {
  border-color: var(--roster-card-border-hover);
}

.thumbnail:hover .inner-card,
.thumbnail.selected .inner-card {
  box-shadow: var(--roster-card-shadow-hover);
}

.thumbnail.selected .inner-card {
  --roster-sketch-stroke: 4px;
  animation: none;
  transform: none;
  filter: none;
  box-shadow:
    0 1px 0 color-mix(in srgb, white 55%, transparent) inset,
    0 0 12px color-mix(in srgb, var(--roster-graphite-deep) 14%, transparent),
    0 12px 26px rgba(26, 24, 20, 0.14);
}

.thumbnail.selected:hover .inner-card {
  animation: none;
  transform: none;
  filter: none;
}

.thumbnail.selected .inner-card::before,
.thumbnail.selected .inner-card::after {
  border-color: var(--roster-card-border-selected);
}

.thumbnail.selected .inner-card::after {
  inset: 2px;
  border-radius: 10px;
  border-width: 1.5px;
  opacity: 0.5;
}

.thumbnail:hover .card-poly,
.thumbnail.selected .card-poly {
  stroke: var(--roster-graphite);
  filter: drop-shadow(0 0 4px color-mix(in srgb, var(--roster-graphite) 35%, transparent));
}

.thumbnail.selected .card-poly {
  stroke: var(--roster-graphite-deep);
}

.thumbnail:hover .card-overlay,
.thumbnail.selected .card-overlay {
  opacity: 0;
}

.thumbnail:hover .thumbnail-label,
.thumbnail.selected .thumbnail-label,
.thumbnail:hover .thumbnail-client,
.thumbnail.selected .thumbnail-client {
  color: var(--roster-card-text);
  text-shadow: 0 1px 6px color-mix(in srgb, var(--roster-card-surface-deep) 65%, transparent);
}

.thumbnail.pressed {
  animation: none;
  transform: scale(0.85);
}
.thumbnail.pressed .inner-card {
  filter: url(#paper-crumple);
}

.thumbnail.selected.pressed {
  transform: scale(1.05);
}

.thumbnail.selected.pressed .inner-card {
  filter: none;
}

.thumbnail.selected {
  z-index: 50;
  animation: none;
  transform: scale(1.05);
}

.thumbnail:hover,
.thumbnail.pressed {
  z-index: 60;
}

@keyframes crunchAndPop {
  0% { transform: scale(1); }
  25% { transform: scale(0.85); }
  100% { transform: scale(1.1); }
}

@keyframes settleBack {
  0% { transform: scale(1.1); z-index: 60; }
  100% { transform: scale(1); z-index: 1; }
}

@keyframes cardSway {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(4deg); }
  75% { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .inner-card::before,
  .inner-card::after {
    filter: none;
  }
}

/* Positions WebGL flame canvas from `projectFlameSingleton` when hover flame is enabled */
/*
:deep(#flame-wrapper) {
  position: absolute;
  z-index: 5;
  width: 400%;
  height: 350%;
  bottom: -10%;
  left: -2%;
  transform: translateX(-50%);
  pointer-events: none;
}
:deep(#flame-wrapper canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
  filter: drop-shadow(0px 0px 8px color-mix(in srgb, var(--color-accent) 28%, transparent));
}
*/
</style>
