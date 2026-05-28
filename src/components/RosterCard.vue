<script setup lang="ts">
import type { RosterDiscipline } from '../constants/rosterDiscipline'

export type RosterCardVariant = 'default' | 'case-study'

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
  roster: RosterCardRoster
  plateGrain?: string
  variant?: RosterCardVariant
  clientName?: string
  selected?: boolean
  pressed?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  selected: false,
  pressed: false,
})
</script>

<template>
  <div
    class="thumbnail"
    :class="[
      `thumbnail--${discipline}`,
      {
        'thumbnail--case-study': variant === 'case-study',
        selected,
        pressed,
      },
    ]"
    :data-roster-discipline="discipline"
    :id="`proj-${id}`"
    role="option"
    :aria-selected="selected"
  >
    <div class="inner-card" :class="{ 'inner-card--case-study': variant === 'case-study' }">
      <div class="card-art">
        <img
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
        <span class="thumbnail-label">{{ title }}</span>
        <span v-if="variant === 'case-study' && clientName" class="thumbnail-client">
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
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: #0a0a0d;
}

.card-art::after {
  content: '';
  position: absolute;
  inset: auto 0 0 0;
  z-index: 1;
  height: 28%;
  pointer-events: none;
  background: linear-gradient(to top, rgba(8, 8, 10, 0.9), transparent);
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
  font-family: var(--font-sans);
  font-size: clamp(11px, 3.4cqi, 14px);
  font-weight: 700;
  color: #f5f3ef;
  letter-spacing: 0.02em;
  transition: color 0.15s, text-shadow 0.15s;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-wrap: balance;
}

.inner-card--case-study .thumbnail-label {
  margin-block: auto 0;
}

.thumbnail-client {
  font-family: var(--font-sans);
  font-size: clamp(9px, 2.8cqi, 11px);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, #f5f3ef 72%, var(--roster-discipline-accent));
  line-height: 1.1;
  margin-top: auto;
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
