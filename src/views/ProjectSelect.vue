<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AngularWipe from '../components/wipes/AngularWipe.vue'
import PanelChiselBackground from '../components/PanelChiselBackground.vue'
import { startCrumple } from '../composables/paperCrumple'
import { attachProjectFlameToThumbnail, detachProjectFlame, tickProjectFlame } from '../vfx/projectFlameSingleton'
import { workPanelEmbeddedCaseStudyId } from '../composables/workPanelCaseTheme'

type TechIcon = 'code' | 'cube' | 'layers' | 'spark'

type Project = {
  id: string
  title: string
  subtitle: string
  tags: [string, string, string]
  tagColors: [string, string, string]
  thumb: string
  splash: string
  tech: [TechIcon, TechIcon, TechIcon, TechIcon]
  roster: {
    points: string
    color1: string
    color2: string
    label: string
  }
}

import guildHero from '../assets/images/guild/guild-hero.jpg'
import rocksmithOutdoors from '../assets/images/rocksmith/research/007_rocksmith-outdoors.png'

const procedural = (seed: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0b0b0d"/>
          <stop offset="0.45" stop-color="#111114"/>
          <stop offset="1" stop-color="#0b0b0d"/>
        </linearGradient>
        <radialGradient id="r" cx="70%" cy="25%" r="80%">
          <stop offset="0" stop-color="rgba(57,255,20,0.18)"/>
          <stop offset="0.45" stop-color="rgba(70,240,209,0.10)"/>
          <stop offset="1" stop-color="rgba(0,0,0,0)"/>
        </radialGradient>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${seed}"/>
          <feColorMatrix type="matrix" values="
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 0 0
            0 0 0 .25 0"/>
        </filter>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <rect width="1200" height="800" fill="url(#r)"/>
      <rect width="1200" height="800" filter="url(#n)" opacity="0.55"/>
    </svg>`,
  )}`

function generateTornPaperPolygon() {
  const points: string[] = []
  const segX = 8
  const segY = 12
  const varX = 2
  const varY = 2

  for (let i = 0; i <= segX; i++) {
    let x = (i / segX) * 100
    let y = Math.random() * varY
    if (i === 0) x = 0
    if (i === segX) x = 100
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  for (let i = 1; i <= segY; i++) {
    const x = 100 - Math.random() * varX
    let y = (i / segY) * 140
    if (i === segY) y = 140
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  for (let i = 1; i <= segX; i++) {
    let x = 100 - (i / segX) * 100
    const y = 140 - Math.random() * varY
    if (i === segX) x = 0
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  for (let i = 1; i < segY; i++) {
    const x = Math.random() * varX
    const y = 140 - (i / segY) * 140
    points.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }

  return points.join(' ')
}

function randomPalette() {
  const h1 = Math.floor(Math.random() * 360)
  const color1 = `hsl(${h1}, 40%, 30%)`
  const color2 = `hsl(${(h1 + 40) % 360}, 40%, 15%)`
  return { color1, color2 }
}

function rosterMeta(title: string) {
  const { color1, color2 } = randomPalette()
  const points = generateTornPaperPolygon()
  const label = title.split(' ')[0] ?? title
  return { points, color1, color2, label }
}

const projects = ref<Project[]>([
  {
    id: 'guild',
    title: 'Guild of Guardians',
    subtitle: 'Retention & Live-Ops Systems',
    tags: ['MOBILE', 'UX', 'DATA'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: guildHero,
    splash: guildHero,
    tech: ['layers', 'cube', 'code', 'spark'],
    roster: rosterMeta('Guild of Guardians'),
  },
  {
    id: 'rocksmith',
    title: 'Rocksmith+',
    subtitle: 'Cross-Platform UI System',
    tags: ['SYSTEMS', 'ACCESS', 'SHIPPED'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: rocksmithOutdoors,
    splash: rocksmithOutdoors,
    tech: ['code', 'layers', 'spark', 'cube'],
    roster: rosterMeta('Rocksmith+'),
  },
  {
    id: 'login',
    title: 'Login Micro-Interaction',
    subtitle: 'Lottie-driven input tracking avatar',
    tags: ['PROTOTYPE', 'MOTION', 'UI'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(23),
    splash: procedural(23),
    tech: ['spark', 'code', 'layers', 'cube'],
    roster: rosterMeta('Login Micro-Interaction'),
  },
  {
    id: 'helldivers',
    title: 'UI come to life (Helldivers-inspired)',
    subtitle: 'Responsive 2D component with 3D assets',
    tags: ['GAME', 'JUICE', 'UI'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(29),
    splash: procedural(29),
    tech: ['cube', 'spark', 'layers', 'code'],
    roster: rosterMeta('UI come to life'),
  },
  {
    id: 'account-tray',
    title: 'Analogue Usage Dashboard',
    subtitle: 'Brutalist tray with mechanical motion',
    tags: ['HUD', 'MOTION', 'DENSE'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(31),
    splash: procedural(31),
    tech: ['layers', 'spark', 'code', 'cube'],
    roster: rosterMeta('Analogue Usage Dashboard'),
  },
  {
    id: 'sales-modal',
    title: 'Component-Driven Sales Modal',
    subtitle: 'Contextual pricing + banners',
    tags: ['UX', 'MODULAR', 'POLISH'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(37),
    splash: procedural(37),
    tech: ['code', 'layers', 'cube', 'spark'],
    roster: rosterMeta('Component-Driven Sales Modal'),
  },
  {
    id: 'voice-chat',
    title: 'AI Voice Chat Simulation',
    subtitle: 'Visual communication + conversation',
    tags: ['AUDIO', 'UX', 'SYSTEMS'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(41),
    splash: procedural(41),
    tech: ['spark', 'code', 'layers', 'cube'],
    roster: rosterMeta('AI Voice Chat Simulation'),
  },
  {
    id: 'node-graph',
    title: 'Node Graph Visual Scripting',
    subtitle: 'Dense tool UI + help',
    tags: ['TOOLS', 'DENSE', 'UI'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(43),
    splash: procedural(43),
    tech: ['cube', 'layers', 'code', 'spark'],
    roster: rosterMeta('Node Graph Visual Scripting'),
  },
  {
    id: 'patapon',
    title: 'Rhythm-Combat (Patapon)',
    subtitle: 'Interaction breakdown & recreation',
    tags: ['GAME', 'SYSTEMS', 'FEEL'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(47),
    splash: procedural(47),
    tech: ['layers', 'cube', 'code', 'spark'],
    roster: rosterMeta('Rhythm-Combat'),
  },
  {
    id: 'jedi',
    title: 'Feel like a Jedi',
    subtitle: 'Combat design + interaction',
    tags: ['GAME', 'JUICE', 'UNITY'],
    tagColors: ['#e5e5e5', '#e5e5e5', '#e5e5e5'],
    thumb: procedural(53),
    splash: procedural(53),
    tech: ['cube', 'spark', 'layers', 'code'],
    roster: rosterMeta('Feel like a Jedi'),
  },
])

const activeId = ref(projects.value[0]?.id ?? '')
const displayedId = ref(activeId.value)

const wipeActive = ref(false)
const wipeTrigger = ref(0)
const pendingId = ref<string | null>(null)

const activeProject = computed(() => projects.value.find(p => p.id === activeId.value) ?? projects.value[0])

type EmbeddedLoader = ReturnType<typeof defineAsyncComponent>

const embeddedProjectComponentById: Record<Project['id'], EmbeddedLoader> = {
  guild: defineAsyncComponent(() => import('./ProjectGuild.vue')),
  rocksmith: defineAsyncComponent(() => import('./ProjectRocksmith.vue')),
  login: defineAsyncComponent(() => import('./LoginInteraction.vue')),
  helldivers: defineAsyncComponent(() => import('./ExperimentHelldivers.vue')),
  'account-tray': defineAsyncComponent(() => import('./AccountTrayView.vue')),
  'sales-modal': defineAsyncComponent(() => import('./SalesModalView.vue')),
  'voice-chat': defineAsyncComponent(() => import('./VoiceChatSimulation.vue')),
  'node-graph': defineAsyncComponent(() => import('./NodeGraphView.vue')),
  patapon: defineAsyncComponent(() => import('./ExperimentPatapon.vue')),
  jedi: defineAsyncComponent(() => import('./ExperimentJedi.vue')),
}

const displayedEmbeddedComponent = computed(
  () => embeddedProjectComponentById[displayedId.value] ?? null,
)
const isCaseStudyEmbedded = computed(() => displayedId.value === 'guild' || displayedId.value === 'rocksmith')

watch(
  displayedId,
  (id) => {
    workPanelEmbeddedCaseStudyId.value = id === 'guild' || id === 'rocksmith' ? id : null
  },
  { immediate: true },
)

const pressedId = ref<string | null>(null)
const hoveredId = ref<string | null>(null)
let hoverDetachTimeout: number | null = null

function onThumbEnter(e: PointerEvent, id: string) {
  hoveredId.value = id
  if (hoverDetachTimeout != null) {
    window.clearTimeout(hoverDetachTimeout)
    hoverDetachTimeout = null
  }

  const thumb = e.currentTarget as HTMLElement
  const innerCard = thumb.querySelector('.inner-card') as HTMLElement | null
  if (innerCard) attachProjectFlameToThumbnail(thumb, innerCard)
  startCrumple()
}
function onThumbLeave(id: string) {
  if (hoveredId.value === id) hoveredId.value = null
  pressedId.value = null

  if (hoverDetachTimeout != null) window.clearTimeout(hoverDetachTimeout)
  hoverDetachTimeout = window.setTimeout(() => {
    if (hoveredId.value == null && pressedId.value == null) {
      detachProjectFlame()
    }
    hoverDetachTimeout = null
  }, 70)
}
function onThumbMove() {}

function onThumbDown(e: PointerEvent, id: string) {
  pressedId.value = id
  hoveredId.value = id
  if (hoverDetachTimeout != null) {
    window.clearTimeout(hoverDetachTimeout)
    hoverDetachTimeout = null
  }
  const thumb = e.currentTarget as HTMLElement
  const innerCard = thumb.querySelector('.inner-card') as HTMLElement | null
  if (innerCard) attachProjectFlameToThumbnail(thumb, innerCard)
  startCrumple()

  try {
    thumb.setPointerCapture(e.pointerId)
  } catch {}
}

function onThumbUp(id: string) {
  if (pressedId.value !== id) return
  pressedId.value = null
  if (hoveredId.value == null) detachProjectFlame()
  selectProject(id)
}

let raf = 0
onMounted(() => {
  const clockStart = performance.now()
  let lastFrame = clockStart
  const frameMs = 1000 / 24
  const loop = () => {
    const now = performance.now()
    if (now - lastFrame >= frameMs) {
      lastFrame = now - ((now - lastFrame) % frameMs)
      const t = (lastFrame - clockStart) / 1000
      tickProjectFlame(t)
    }
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  workPanelEmbeddedCaseStudyId.value = null
})

function selectProject(id: string) {
  if (id === activeId.value) return
  activeId.value = id
  pendingId.value = id
  wipeActive.value = true
  wipeTrigger.value++
}

function onCovered() {
  if (pendingId.value) displayedId.value = pendingId.value
}
function onDone() {
  pendingId.value = null
  wipeActive.value = false
}
</script>

<template>
  <div class="dl-app">
    <div class="dl-bg" />

    <div class="dl-shell">
      <div class="dl-grid">
        <aside id="roster-pane" aria-label="Project roster">
          <div class="roster-header">Select Project</div>

          <div class="grid-container" role="listbox" :aria-activedescendant="`proj-${activeProject.id}`">
            <div
              v-for="(p, idx) in projects"
              :key="p.id"
              class="thumbnail"
              :class="{
                selected: p.id === activeProject.id,
                pressed: p.id === pressedId,
              }"
              :id="`proj-${p.id}`"
              role="option"
              :aria-selected="p.id === activeProject.id"
              @pointerenter="(e) => onThumbEnter(e, p.id)"
              @pointerleave="() => onThumbLeave(p.id)"
              @pointermove="onThumbMove"
              @pointerdown="(e) => onThumbDown(e, p.id)"
              @pointerup="() => onThumbUp(p.id)"
              @pointercancel="() => (pressedId = null)"
            >
              <div class="inner-card">
                <svg class="paper-svg" viewBox="0 0 100 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient :id="`grad_${idx}`" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" :stop-color="p.roster.color1" />
                      <stop offset="100%" :stop-color="p.roster.color2" />
                    </linearGradient>
                  </defs>
                  <polygon
                    class="card-poly"
                    :points="p.roster.points"
                    :fill="`url(#grad_${idx})`"
                    stroke-width="2"
                    vector-effect="non-scaling-stroke"
                  />
                  <polygon class="card-overlay" :points="p.roster.points" fill="url(#dim_grad)" />
                </svg>

                <div class="thumbnail-content">
                  <span class="thumbnail-label">{{ p.roster.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section class="dl-detail" aria-label="Project detail">
          <PanelChiselBackground class="dl-detail__surface">
          <div
            v-if="displayedEmbeddedComponent"
            class="dl-embedded"
            :class="{ 'dl-embedded--case': isCaseStudyEmbedded }"
          >
            <component :is="displayedEmbeddedComponent" :key="displayedId" />
          </div>

          </PanelChiselBackground>

          <AngularWipe
            :active="wipeActive"
            :trigger="wipeTrigger"
            palette="crimson-teal"
            @covered="onCovered"
            @done="onDone"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dl-app {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  /* Clip decorative bleed (.dl-bg); WebGL rim is fixed-canvas, not DOM overflow */
  overflow: hidden;
  background: #111111;
  color: #eae7e2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Centered reading shell: limits horizontal sweep on 21:9, still fills 4:3 / 16:9 */
.dl-shell {
  flex: 1 1 auto;
  min-height: 0;
  width: min(100%, var(--dl-reading-max, 1520px));
  margin-inline: auto;
  padding-inline: clamp(12px, 2.8vw, 40px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

@media (min-aspect-ratio: 21/9) {
  .dl-shell {
    --dl-reading-max: 1420px;
  }
}

@media (max-aspect-ratio: 4/3) {
  .dl-shell {
    --dl-reading-max: 1280px;
  }
}

.dl-bg {
  position: absolute;
  /* Avoid negative inset — it enlarged scrollable overflow on html/body */
  inset: 0;
  background:
    radial-gradient(circle at 15% 15%, rgba(70,240,209,0.06) 0%, transparent 45%),
    radial-gradient(circle at 85% 25%, rgba(165,30,44,0.07) 0%, transparent 55%),
    radial-gradient(circle at 40% 85%, rgba(57,255,20,0.06) 0%, transparent 55%),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 80px);
  opacity: 0.6;
  filter: blur(0.2px);
  pointer-events: none;
}
.dl-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--noise-svg);
  opacity: 0.10;
  mix-blend-mode: overlay;
}

.dl-grid {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  min-height: 0;
  overflow: visible;
  display: grid;
  /* Fixed-width roster (3× larger cards) so the detail panel gets the rest */
  grid-template-columns: minmax(224px, 384px) minmax(0, 1fr);
  align-items: stretch;
}

#roster-pane {
  position: relative;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  min-width: 0;
  border-right: 1px solid #333;
  overflow-y: auto;
  overflow-x: clip;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(10px);
  padding: 24px 16px 32px;
  box-sizing: border-box;
  scroll-padding-bottom: 48px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
}

:deep(#roster-pane::-webkit-scrollbar) {
  width: 8px;
}
:deep(#roster-pane::-webkit-scrollbar-track) {
  background: transparent;
  border-radius: 999px;
}
:deep(#roster-pane::-webkit-scrollbar-button) {
  width: 0;
  height: 0;
  display: none;
}
:deep(#roster-pane::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  border: 2px solid rgba(0, 0, 0, 0);
  background-clip: padding-box;
}
:deep(#roster-pane::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 255, 255, 0.32);
  background-clip: padding-box;
}

.roster-header {
  font-size: 2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #7a8b99;
  margin: 0 0 24px;
  padding: 0 4px 8px;
  line-height: 1.1;
  font-weight: 900;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  /* Room for hover/selected scale(1.25), flame VFX, and scroll end */
  padding: 16px 16px 96px;
  box-sizing: border-box;
}

.thumbnail {
  aspect-ratio: 1 / 1.4;
  cursor: pointer;
  position: relative;
  z-index: 1;
  min-width: 0;
  isolation: isolate;
}

.inner-card {
  position: absolute;
  inset: 0;
  z-index: 10;
  transform-origin: center center;
  overflow: visible;
}

.paper-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
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
  position: absolute;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: flex-end;
  padding: 14px 12px 16px;
  pointer-events: none;
}

.thumbnail-label {
  font-size: 0.8125rem;
  font-weight: bold;
  color: #aaa;
  text-transform: uppercase;
  transition: color 0.15s;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.thumbnail:hover:not(.selected):not(.pressed) {
  animation: crunchAndPop 0.65s cubic-bezier(0.2, 0.9, 0.3, 1.2) forwards;
}

.thumbnail:not(:hover):not(.selected):not(.pressed) {
  animation: settleBack 0.25s ease-out forwards;
}

.thumbnail:hover .inner-card {
  animation: cardSway 4.1s ease-in-out infinite;
  filter: url(#paper-crumple);
}

.thumbnail:hover .card-poly,
.thumbnail.selected .card-poly {
  stroke: #20ffb0;
  filter: drop-shadow(0 0 4px rgba(32, 255, 176, 0.6));
}

.thumbnail:hover .paper-svg,
.thumbnail.selected .paper-svg {
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.9));
}

.thumbnail:hover .card-overlay,
.thumbnail.selected .card-overlay {
  opacity: 0;
}

.thumbnail:hover .thumbnail-label,
.thumbnail.selected .thumbnail-label {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
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
  transform: scale(1.25);
}

/* Hover/press = active focus: always above selected-only cards (same z-index used to tie on DOM order). */
.thumbnail:hover,
.thumbnail.pressed {
  z-index: 60;
}

@keyframes crunchAndPop {
  0% { transform: scale(1); }
  25% { transform: scale(0.85); }
  100% { transform: scale(1.25); }
}

@keyframes settleBack {
  0% { transform: scale(1.25); z-index: 60; }
  100% { transform: scale(1); z-index: 1; }
}

@keyframes cardSway {
  0% { transform: rotate(0deg); }
  25% { transform: rotate(4deg); }
  75% { transform: rotate(-4deg); }
  100% { transform: rotate(0deg); }
}

/* flame wrapper is dynamically inserted (no scope attr) */
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

.dl-detail {
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  overflow: visible;
  background: transparent;
}

.dl-detail__surface {
  position: relative;
  z-index: 1;
  height: 100%;
  min-height: 0;
  overflow: visible;
}

/**
 * TOC + in-panel scroll targeting use `closest('.dl-embedded')` as `scrollRootEl`.
 * `PanelChiselBackground` defaults to scrolling `.panel-chisel-bg__content`, which bypasses that —
 * observers + `scrollTo` on `.dl-embedded` looked broken. Clamp the inner chrome and scroll here.
 */
.dl-detail__surface :deep(.panel-chisel-bg__content) {
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: 0;
}

.dl-embedded {
  position: relative;
  /* `0%` flex-basis + `min-height: 0` is the reliable flex scrollport pattern */
  flex: 1 1 0%;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding: clamp(12px, 1.8vw, 20px) clamp(8px, 1.2vw, 16px) 48px;
  z-index: 1;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--paper-surface-rim) 55%, transparent) transparent;
}

.dl-embedded::-webkit-scrollbar {
  width: 8px;
}
.dl-embedded::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--paper-surface-rim) 50%, transparent);
  border-radius: 999px;
}
.dl-embedded--case :deep(.animate-fade-in) {
  padding-bottom: 120px;
  /* Parchment tokens (embedded case is not under `[data-surface="paper"]`) — matches `style.css` paper surface */
  --color-text: var(--paper-on-fill-text);
  --color-text-muted: var(--paper-on-fill-text-muted);
  --color-surface: var(--paper-surface-fill-deep);
  --color-elevated: #f2ece2;
  --color-border: var(--paper-surface-rim);
  --color-accent: #6b5a32;
  --color-accent-rim: #8b7347;
}
.dl-embedded--case :deep(.xl\:grid) {
  max-width: 100%;
}
.dl-embedded--case :deep(.xl\:grid.xl\:grid-cols-12) {
  padding-left: clamp(16px, 2.5vw, 36px);
  padding-right: clamp(16px, 2.5vw, 36px);
}
.dl-embedded--case :deep(.xl\:grid.xl\:grid-cols-12 .sticky) {
  top: clamp(20px, 2.5vw, 32px);
}
.dl-embedded:not(.dl-embedded--case) :deep(.max-w-4xl) {
  max-width: 100%;
}
.dl-embedded:not(.dl-embedded--case) :deep(.space-y-8) {
  padding-bottom: 2rem;
}
.dl-embedded:not(.dl-embedded--case) :deep(.space-y-8 > header) {
  flex-wrap: wrap;
  gap: 1rem;
}
/* Embedded case studies: panels pick up parchment via `.animate-fade-in` scope above */
.dl-embedded--case :deep(.panel-recessed) {
  --color-text: var(--paper-on-fill-text);
  --color-text-muted: var(--paper-on-fill-text-muted);
}

.dl-embedded--case :deep(.panel-recessed:not(.pencil-baked)) {
  background: color-mix(in srgb, var(--paper-surface-fill-deep) 88%, #1a1814 12%);
}

.dl-embedded--case :deep(.case-text-divider:not(.pencil-baked)) {
  background: color-mix(in srgb, var(--color-accent) 55%, transparent);
  opacity: 0.45;
  border-radius: 1px;
}

.dl-embedded--case :deep(.case-divider--vertical:not(.pencil-baked)) {
  background: color-mix(in srgb, var(--color-accent) 72%, transparent);
  opacity: 0.55;
}

.dl-embedded--case :deep(.hero-title),
.dl-embedded--case :deep(.hero-desc),
.dl-embedded:not(.dl-embedded--case) :deep(h1),
.dl-embedded:not(.dl-embedded--case) :deep(h2),
.dl-embedded:not(.dl-embedded--case) :deep(p) {
  color: var(--color-text);
}

.dl-embedded:not(.dl-embedded--case) :deep(.opacity-60),
.dl-embedded:not(.dl-embedded--case) :deep(.opacity-80) {
  color: var(--color-text-muted);
}
</style>

