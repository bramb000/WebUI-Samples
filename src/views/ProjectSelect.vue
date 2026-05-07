<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { CodeXml, Cuboid, Layers, Sparkles } from 'lucide-vue-next'
import AngularWipe from '../components/wipes/AngularWipe.vue'
import { startCrumple } from '../composables/paperCrumple'
import { attachProjectFlameToThumbnail, detachProjectFlame, tickProjectFlame } from '../vfx/projectFlameSingleton'

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
const displayedProject = computed(() => projects.value.find(p => p.id === displayedId.value) ?? projects.value[0])

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
onBeforeUnmount(() => cancelAnimationFrame(raf))

function selectProject(id: string) {
  if (id === activeId.value) return
  activeId.value = id
  pendingId.value = id
  wipeActive.value = true
  wipeTrigger.value++
}

function iconFor(t: TechIcon) {
  switch (t) {
    case 'code':
      return CodeXml
    case 'cube':
      return Cuboid
    case 'layers':
      return Layers
    case 'spark':
      return Sparkles
  }
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
        <div class="dl-detail__chrome" />
        <div class="dl-splash" :style="{ backgroundImage: `url('${displayedProject.splash}')` }" />

        <div class="dl-detail__content">
          <h1 class="dl-title">{{ displayedProject.title }}</h1>
          <div class="dl-subtitle">{{ displayedProject.subtitle }}</div>

          <div class="dl-tags" aria-label="Archetype tags">
            <span
              v-for="(t, idx) in displayedProject.tags"
              :key="t"
              class="dl-tag"
              :style="{ background: displayedProject.tagColors[idx] }"
            >
              {{ t }}
            </span>
          </div>
        </div>

        <div class="dl-tech" aria-label="Core technologies">
          <div v-for="(t, idx) in displayedProject.tech" :key="`${displayedProject.id}-${idx}`" class="dl-tech__orb">
            <component :is="iconFor(t)" :size="18" />
          </div>
        </div>

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
</template>

<style scoped>
.dl-app {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #111111;
  color: #eae7e2;
}

.dl-bg {
  position: absolute;
  inset: -10%;
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
  height: 100%;
  display: grid;
  grid-template-columns: 40% 60%;
}

#roster-pane {
  position: relative;
  height: 100vh;
  border-right: 1px solid #333;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(10px);
  padding: 40px;
}

.roster-header {
  font-size: 2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #7a8b99;
  margin-bottom: 24px;
  font-weight: 900;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 4px;
  padding-bottom: 80px;
}

.thumbnail {
  aspect-ratio: 1 / 1.4;
  cursor: pointer;
  position: relative;
  z-index: 1;
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
  padding: 8px;
  pointer-events: none;
}

.thumbnail-label {
  font-size: 0.65rem;
  font-weight: bold;
  color: #aaa;
  text-transform: uppercase;
  transition: color 0.15s;
}

.thumbnail:hover:not(.selected):not(.pressed) {
  z-index: 50;
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
  z-index: 50;
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

@keyframes crunchAndPop {
  0% { transform: scale(1); }
  25% { transform: scale(0.85); }
  100% { transform: scale(1.25); }
}

@keyframes settleBack {
  0% { transform: scale(1.25); z-index: 50; }
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
  overflow: hidden;
  background: radial-gradient(circle at 60% 20%, rgba(70,240,209,0.08) 0%, transparent 40%),
    linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.68) 100%);
}
.dl-detail__chrome {
  position: absolute;
  inset: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  clip-path: polygon(0 0, 96% 0, 100% 10%, 100% 100%, 4% 100%, 0 90%);
  pointer-events: none;
  opacity: 0.65;
}
.dl-splash {
  position: absolute;
  inset: -8%;
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  filter: grayscale(0.2) contrast(1.08) saturate(0.85);
  transform: rotate(-1.2deg) scale(1.06);
  mask-image: radial-gradient(circle at 55% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
  -webkit-mask-image: radial-gradient(circle at 55% 35%, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
}
.dl-detail__content {
  position: relative;
  padding: 60px 56px;
  max-width: 920px;
}
.dl-title {
  font-family: var(--font-display);
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: clamp(40px, 4.6vw, 78px);
  line-height: 0.92;
  margin: 0;
  text-shadow: 0 0 30px rgba(0,0,0,0.75);
}
.dl-subtitle {
  margin-top: 14px;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 12px;
  color: rgba(235,230,224,0.70);
}
.dl-tags {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
.dl-tag {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 999px;
  font-family: var(--font-sans);
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(0,0,0,0.92);
  box-shadow: 0 10px 24px rgba(0,0,0,0.35);
}
.dl-tech {
  position: absolute;
  right: 28px;
  bottom: 26px;
  display: flex;
  gap: 12px;
  z-index: 10;
}
.dl-tech__orb {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.10);
  color: rgba(235,230,224,0.85);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.7), 0 12px 28px rgba(0,0,0,0.5);
}
</style>

