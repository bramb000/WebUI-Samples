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
  thumb: string
  /** WebP/PNG poster while a `.webm` thumb decodes */
  thumbPoster?: string
  roster: RosterCardRoster
  plateGrain?: string
  variant?: RosterCardVariant
  plateTypography?: RosterCardPlateTypography
  clientName?: string
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
})

const isThumbVideo = computed(() => /\.webm($|\?)/i.test(props.thumb))
</script>

<template>
  <div
    class="thumbnail"
    :class="[
      `thumbnail--${discipline}`,
      {
        'thumbnail--case-study': variant === 'case-study',
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
      }"
    >
      <div class="card-art">
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
          for {{ clientName }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thumbnail {
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
  border: 1px solid rgba(0, 0, 0, 0.72);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 10px 24px rgba(0, 0, 0, 0.58);
  background: #0e0e11;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}

.inner-card--case-study {
  grid-template-rows: 58fr 42fr;
}

.card-art {
  grid-area: art;
  position: relative;
  z-index: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #0a0a0d;
}

.card-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}

.thumbnail--product-design,
.thumbnail--ui-design {
  --roster-plate-base: color-mix(in srgb, var(--roster-discipline-accent) 34%, #121016);
  --roster-grain-fallback: color-mix(in srgb, var(--roster-discipline-accent) 58%, #1a181e);
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
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
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
  opacity: 0.82;
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
  opacity: 0.42;
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

.inner-card--case-study .thumbnail-content {
  justify-content: flex-end;
}

.thumbnail-label {
  color: #f5f3ef;
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
  color: color-mix(in srgb, #f5f3ef 72%, var(--roster-discipline-accent));
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
  animation: settleBack 0.125s ease-out forwards;
}

.thumbnail:not(:hover):not(.selected):not(.pressed) .inner-card {
  transition: transform 0.125s ease-out;
}

.thumbnail:hover .inner-card {
  animation: cardSway 4.1s ease-in-out infinite;
  filter: url(#paper-crumple);
}

.thumbnail:hover .inner-card,
.thumbnail.selected .inner-card {
  border-color: color-mix(in srgb, var(--roster-discipline-accent) 65%, transparent);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.05) inset,
    0 0 0 1px color-mix(in srgb, var(--roster-discipline-accent) 45%, transparent),
    0 0 14px color-mix(in srgb, var(--roster-discipline-accent) 32%, transparent),
    0 12px 26px rgba(0, 0, 0, 0.65);
}

.thumbnail.selected .inner-card {
  --selected-gold: #f5c453;
  --selected-gold-soft: rgba(245, 196, 83, 0.28);
  --selected-gold-ring: rgba(245, 196, 83, 0.55);
  border-color: color-mix(in srgb, var(--selected-gold) 92%, transparent);
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.06) inset,
    0 0 0 1px var(--selected-gold-ring),
    0 0 18px var(--selected-gold-soft),
    0 12px 26px rgba(0, 0, 0, 0.65);
}

.thumbnail.selected .inner-card::after {
  content: '';
  position: absolute;
  inset: -32%;
  border-radius: inherit;
  pointer-events: none;
  z-index: 12;
  background-image: linear-gradient(
    90deg,
    transparent 0,
    transparent calc(50% - 6px),
    rgba(255, 255, 255, 0.18) calc(50% - 6px),
    rgba(255, 255, 255, 0.98) calc(50% - 4px),
    rgba(255, 255, 255, 0.98) calc(50% + 4px),
    rgba(255, 255, 255, 0.18) calc(50% + 6px),
    transparent calc(50% + 6px),
    transparent calc(50% + 8px),
    rgba(255, 255, 255, 0.92) calc(50% + 8px),
    rgba(255, 255, 255, 0.92) calc(50% + 10px),
    transparent calc(50% + 10px),
    transparent 100%
  );
  opacity: 0.78;
  mix-blend-mode: normal;
  animation: selectedGoldSweep 7s cubic-bezier(0.2, 0.9, 0.2, 1) infinite;
  transform: translate3d(-55%, 0, 0) rotate(45deg);
  will-change: transform, opacity;
  backface-visibility: hidden;
  contain: paint;
}

.thumbnail:hover .card-poly,
.thumbnail.selected .card-poly {
  stroke: #20ffb0;
  filter: drop-shadow(0 0 4px rgba(32, 255, 176, 0.6));
}

.thumbnail:hover .card-overlay,
.thumbnail.selected .card-overlay {
  opacity: 0;
}

.thumbnail:hover .thumbnail-label,
.thumbnail.selected .thumbnail-label,
.thumbnail:hover .thumbnail-client,
.thumbnail.selected .thumbnail-client {
  color: #ffffff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.85);
}

.thumbnail.pressed {
  animation: none;
  transform: scale(0.85);
}
.thumbnail.pressed .inner-card {
  filter: url(#paper-crumple);
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

@keyframes selectedGoldSweep {
  0% { transform: translate3d(-55%, 0, 0) rotate(45deg); opacity: 0; }
  6% { opacity: 0.78; }
  14% { transform: translate3d(55%, 0, 0) rotate(45deg); opacity: 0; }
  100% { transform: translate3d(55%, 0, 0) rotate(45deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .thumbnail.selected .inner-card::after {
    animation: none;
    opacity: 0;
  }
}

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
  filter: drop-shadow(0px 0px 8px rgba(32, 255, 176, 0.4));
}
</style>
