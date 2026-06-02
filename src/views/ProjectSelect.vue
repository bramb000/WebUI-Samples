<script setup lang="ts">
import { computed, defineAsyncComponent, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NAV_SCROLL_REFRESH_KEY } from '../composables/useNavAutoHide'
import SoftDrillWipe from '../components/wipes/SoftDrillWipe.vue'
import PanelChiselBackground from '../components/PanelChiselBackground.vue'
import RosterCard from '../components/RosterCard.vue'
import { startCrumple } from '../composables/paperCrumple'
/* Hover flame (WebGL comic fire under roster card art) — disabled; see `projectFlameSingleton.ts`
import { attachProjectFlameToThumbnail, detachProjectFlame, tickProjectFlame } from '../vfx/projectFlameSingleton'
*/
import { useIsMobile } from '../composables/useIsMobile'
import { useRosterCardPaint } from '../composables/useRosterCardPaint'
import { PROJECT_ROUTE_BY_ID } from '../constants/projectRoutes'
import { rosterCardPaletteFromTokens } from '../constants/rosterCardPalette'
import type { RosterDiscipline } from '../constants/rosterDiscipline'

type TechIcon = 'code' | 'cube' | 'layers' | 'spark'

type Project = {
  id: string
  discipline: RosterDiscipline
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
  clientName?: string
  clientPrefix?: boolean
}

import { rosterCardImage } from '../assets/images/roster-cards/rosterCardImages'

const procedural = (seed: number) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f3efe6"/>
          <stop offset="0.45" stop-color="#f5f2eb"/>
          <stop offset="1" stop-color="#f3efe6"/>
        </linearGradient>
        <radialGradient id="r" cx="70%" cy="25%" r="80%">
          <stop offset="0" stop-color="rgba(235,228,214,0.55)"/>
          <stop offset="0.45" stop-color="rgba(47,51,57,0.1)"/>
          <stop offset="1" stop-color="rgba(255,255,255,0)"/>
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

function rosterMeta(title: string) {
  const { color1, color2 } = rosterCardPaletteFromTokens()
  const points = generateTornPaperPolygon()
  const label = title.split(' ')[0] ?? title
  return { points, color1, color2, label }
}

function projectArt(id: string, proceduralSeed: number): string {
  return rosterCardImage(id) ?? procedural(proceduralSeed)
}

const projects = ref<Project[]>([
  {
    id: 'guild',
    discipline: 'product-design',
    title: 'Repairing stickiness to increase revenue',
    subtitle: 'Retention & Live-Ops Systems',
    tags: ['MOBILE', 'UX', 'DATA'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('guild', 17),
    splash: projectArt('guild', 17),
    tech: ['layers', 'cube', 'code', 'spark'],
    roster: rosterMeta('Guild of Guardians'),
    clientName: 'Immutable',
  },
  {
    id: 'rocksmith',
    discipline: 'product-design',
    title: 'Making guitar accessible to 1M+ users',
    subtitle: 'Cross-Platform UI System',
    tags: ['SYSTEMS', 'ACCESS', 'SHIPPED'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('rocksmith', 19),
    splash: projectArt('rocksmith', 19),
    tech: ['code', 'layers', 'spark', 'cube'],
    roster: rosterMeta('Rocksmith+'),
    clientName: 'Ubisoft',
  },
  {
    id: 'cozy-corner',
    discipline: 'product-design',
    title: 'Cozy Corner, A Warm Third Space',
    subtitle: 'Realtime chat, voice & shared world',
    tags: ['PIXEL', 'REALTIME', 'SOLO'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('cozy-corner', 59),
    splash: projectArt('cozy-corner', 59),
    tech: ['layers', 'code', 'spark', 'cube'],
    roster: rosterMeta('Cozy Corner'),
    clientName: 'client work',
    clientPrefix: false,
  },
  {
    id: 'login',
    discipline: 'ui-design',
    title: 'Login Micro-Interaction',
    subtitle: 'Lottie-driven input tracking avatar',
    tags: ['PROTOTYPE', 'MOTION', 'UI'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('login', 23),
    splash: projectArt('login', 23),
    tech: ['spark', 'code', 'layers', 'cube'],
    roster: rosterMeta('Login Micro-Interaction'),
  },
  {
    id: 'helldivers',
    discipline: 'ui-design',
    title: 'Bringing UI to life',
    subtitle: 'Responsive 2D component with 3D assets',
    tags: ['GAME', 'JUICE', 'UI'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('helldivers', 29),
    splash: projectArt('helldivers', 29),
    tech: ['cube', 'spark', 'layers', 'code'],
    roster: rosterMeta('UI come to life'),
  },
  {
    id: 'account-tray',
    discipline: 'ui-design',
    title: 'Analogue Usage Dashboard',
    subtitle: 'Brutalist tray with mechanical motion',
    tags: ['HUD', 'MOTION', 'DENSE'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('account-tray', 31),
    splash: projectArt('account-tray', 31),
    tech: ['layers', 'spark', 'code', 'cube'],
    roster: rosterMeta('Analogue Usage Dashboard'),
  },
  {
    id: 'sales-modal',
    discipline: 'ui-design',
    title: 'Component-Driven Sales Modal',
    subtitle: 'Contextual pricing + banners',
    tags: ['UX', 'MODULAR', 'POLISH'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('sales-modal', 37),
    splash: projectArt('sales-modal', 37),
    tech: ['code', 'layers', 'cube', 'spark'],
    roster: rosterMeta('Component-Driven Sales Modal'),
  },
  {
    id: 'voice-chat',
    discipline: 'ui-design',
    title: 'AI Voice Chat Simulation',
    subtitle: 'Visual communication + conversation',
    tags: ['AUDIO', 'UX', 'SYSTEMS'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('voice-chat', 41),
    splash: projectArt('voice-chat', 41),
    tech: ['spark', 'code', 'layers', 'cube'],
    roster: rosterMeta('AI Voice Chat Simulation'),
  },
  {
    id: 'node-graph',
    discipline: 'ui-design',
    title: 'Node Graph Visual Scripting',
    subtitle: 'Dense tool UI + help',
    tags: ['TOOLS', 'DENSE', 'UI'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('node-graph', 43),
    splash: projectArt('node-graph', 43),
    tech: ['cube', 'layers', 'code', 'spark'],
    roster: rosterMeta('Node Graph Visual Scripting'),
  },
  {
    id: 'patapon',
    discipline: 'ui-design',
    title: 'Feel the rhythm through interaction',
    subtitle: 'Interaction breakdown & recreation',
    tags: ['GAME', 'SYSTEMS', 'FEEL'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('patapon', 47),
    splash: projectArt('patapon', 47),
    tech: ['layers', 'cube', 'code', 'spark'],
    roster: rosterMeta('Rhythm-Combat'),
  },
  {
    id: 'jedi',
    discipline: 'ui-design',
    title: 'Feel like a Jedi',
    subtitle: 'Combat design + interaction',
    tags: ['GAME', 'JUICE', 'UNITY'],
    tagColors: ['#5c564c', '#5c564c', '#5c564c'],
    thumb: projectArt('jedi', 53),
    splash: projectArt('jedi', 53),
    tech: ['cube', 'spark', 'layers', 'code'],
    roster: rosterMeta('Feel like a Jedi'),
  },
])

const ROSTER_HIDDEN_IDS = new Set<Project['id']>(['sales-modal', 'node-graph'])

const visibleProjects = computed(() =>
  projects.value.filter((p) => !ROSTER_HIDDEN_IDS.has(p.id)),
)

const caseStudyProjects = computed(() =>
  visibleProjects.value.filter((p) => p.discipline === 'product-design'),
)

const microProjects = computed(() =>
  visibleProjects.value.filter((p) => p.discipline === 'ui-design'),
)

const rosterSections = computed(() => [
  { label: 'Case Studies', projects: caseStudyProjects.value, spaced: false },
  { label: 'Personal Projects', projects: microProjects.value, spaced: true },
])

const router = useRouter()
const isMobile = useIsMobile()

const activeId = ref(projects.value[0]?.id ?? '')
const displayedId = ref(activeId.value)

const wipeTrigger = ref(0)
const wipePhase = ref<'idle' | 'exit' | 'loading' | 'enter'>('idle')
const pendingId = ref<string | null>(null)

let transitionToken = 0
let pendingLoad: Promise<unknown> | null = null

const activeProject = computed(() => projects.value.find(p => p.id === activeId.value) ?? projects.value[0])

type EmbeddedLoader = ReturnType<typeof defineAsyncComponent>

type EmbeddedImporter = () => Promise<{ default: any }>

const embeddedProjectImportById: Record<Project['id'], EmbeddedImporter> = {
  guild: () => import('./ProjectGuild.vue'),
  rocksmith: () => import('./ProjectRocksmith.vue'),
  'cozy-corner': () => import('./ProjectCozyCorner.vue'),
  login: () => import('./LoginInteraction.vue'),
  helldivers: () => import('./ExperimentHelldivers.vue'),
  'account-tray': () => import('./AccountTrayView.vue'),
  'sales-modal': () => import('./SalesModalView.vue'),
  'voice-chat': () => import('./VoiceChatSimulation.vue'),
  'node-graph': () => import('./NodeGraphView.vue'),
  patapon: () => import('./ExperimentPatapon.vue'),
  jedi: () => import('./ExperimentJedi.vue'),
}

const embeddedProjectComponentById: Record<Project['id'], EmbeddedLoader> = {
  guild: defineAsyncComponent(embeddedProjectImportById.guild),
  rocksmith: defineAsyncComponent(embeddedProjectImportById.rocksmith),
  'cozy-corner': defineAsyncComponent(embeddedProjectImportById['cozy-corner']),
  login: defineAsyncComponent(embeddedProjectImportById.login),
  helldivers: defineAsyncComponent(embeddedProjectImportById.helldivers),
  'account-tray': defineAsyncComponent(embeddedProjectImportById['account-tray']),
  'sales-modal': defineAsyncComponent(embeddedProjectImportById['sales-modal']),
  'voice-chat': defineAsyncComponent(embeddedProjectImportById['voice-chat']),
  'node-graph': defineAsyncComponent(embeddedProjectImportById['node-graph']),
  patapon: defineAsyncComponent(embeddedProjectImportById.patapon),
  jedi: defineAsyncComponent(embeddedProjectImportById.jedi),
}

const refreshNavScroll = inject<(() => void) | undefined>(NAV_SCROLL_REFRESH_KEY, undefined)

const displayedEmbeddedComponent = computed(
  () => embeddedProjectComponentById[displayedId.value] ?? null,
)
const isCaseStudyEmbedded = computed(() =>
  displayedId.value === 'guild' || displayedId.value === 'rocksmith' || displayedId.value === 'cozy-corner',
)

const pressedId = ref<string | null>(null)
const hoveredId = ref<string | null>(null)
let hoverDetachTimeout: number | null = null

const gridContainerRef = ref<HTMLElement | null>(null)
const {
  plateGrainBakes,
  setThumbRef,
  observeGrid,
  scheduleRebake,
  rosterPaintMaskUrl,
} = useRosterCardPaint()

function onThumbEnter(_e: PointerEvent, id: string) {
  if (isMobile.value) return
  hoveredId.value = id
  if (hoverDetachTimeout != null) {
    window.clearTimeout(hoverDetachTimeout)
    hoverDetachTimeout = null
  }

  // Flame: attachProjectFlameToThumbnail(e.currentTarget, innerCard)
  startCrumple()

  // Prefetch next detail chunk for a shorter blank hold.
  embeddedProjectImportById[id]?.().catch(() => {})
}
function onThumbLeave(id: string) {
  if (hoveredId.value === id) hoveredId.value = null
  pressedId.value = null

  if (hoverDetachTimeout != null) window.clearTimeout(hoverDetachTimeout)
  hoverDetachTimeout = window.setTimeout(() => {
    if (hoveredId.value == null && pressedId.value == null) {
      // detachProjectFlame()
    }
    hoverDetachTimeout = null
  }, 70)
}
function onThumbMove() {}

function onThumbDown(e: PointerEvent, id: string) {
  if (isMobile.value) {
    pressedId.value = id
    return
  }
  pressedId.value = id
  hoveredId.value = id
  if (hoverDetachTimeout != null) {
    window.clearTimeout(hoverDetachTimeout)
    hoverDetachTimeout = null
  }
  const thumb = e.currentTarget as HTMLElement
  // Flame: attachProjectFlameToThumbnail(thumb, innerCard)
  startCrumple()

  try {
    thumb.setPointerCapture(e.pointerId)
  } catch {}
}

function onThumbUp(id: string) {
  if (pressedId.value !== id) return
  pressedId.value = null
  if (isMobile.value) {
    const path = PROJECT_ROUTE_BY_ID[id]
    if (path) void router.push(path)
    return
  }
  // if (hoveredId.value == null) detachProjectFlame()
  selectProject(id)
}

function syncNavScrollListeners() {
  nextTick(() => refreshNavScroll?.())
}

watch(displayedEmbeddedComponent, syncNavScrollListeners)

onMounted(() => {
  observeGrid(gridContainerRef.value)
  scheduleRebake()
  syncNavScrollListeners()
  /* 24fps flame render loop — re-enable with attach/detach above
  if (isMobile.value) return
  const clockStart = performance.now()
  let lastFrame = clockStart
  const frameMs = 1000 / 24
  let raf = 0
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
  */
})
function selectProject(id: string) {
  if (id === activeId.value) return
  transitionToken++
  const token = transitionToken
  activeId.value = id
  pendingId.value = id
  pendingLoad = embeddedProjectImportById[id]?.() ?? Promise.resolve()
  wipePhase.value = 'exit'
  wipeTrigger.value++

  // If a previous transition was mid-flight, this keeps the overlay authoritative.
  void token
}

async function onCleared(trigger: number) {
  if (trigger !== wipeTrigger.value) return
  const token = transitionToken
  const id = pendingId.value
  if (!id) return

  wipePhase.value = 'loading'

  try {
    await (pendingLoad ?? Promise.resolve())
  } catch {}

  if (token !== transitionToken) return

  displayedId.value = id
  await nextTick()
  if (token !== transitionToken) return

  // One more frame so the new subtree has a chance to mount before reveal begins.
  await new Promise<void>((r) => requestAnimationFrame(() => r()))
  if (token !== transitionToken) return

  wipePhase.value = 'enter'
}

function onDone(trigger: number) {
  if (trigger !== wipeTrigger.value) return
  pendingId.value = null
  pendingLoad = null
  wipePhase.value = 'idle'
}
</script>

<template>
  <div class="dl-app">
    <div class="dl-shell">
      <div class="dl-grid">
        <aside class="roster-pane-shell" aria-label="Project roster">
          <div class="roster-pane__bg" aria-hidden="true" />
          <div id="roster-pane" class="roster-pane__scroll">
          <div class="roster-header">Select Project</div>

          <div
            ref="gridContainerRef"
            class="grid-container roster-card-grid"
            role="listbox"
            :aria-activedescendant="`proj-${activeProject.id}`"
            :style="{ '--roster-paint-mask': `url(${rosterPaintMaskUrl})` }"
          >
            <template v-for="section in rosterSections" :key="section.label">
              <div
                class="roster-section-header section-header"
                :class="{ 'roster-section-header--spaced': section.spaced }"
              >
                <h3 class="type-eyebrow">{{ section.label }}</h3>
              </div>
              <RosterCard
                v-for="p in section.projects"
                :key="p.id"
                :ref="(el) => setThumbRef(p.id, el)"
                :id="p.id"
                :discipline="p.discipline"
                :title="p.title"
                :thumb="p.thumb"
                :roster="p.roster"
                :plate-grain="plateGrainBakes[p.id]"
                :variant="p.clientName ? 'case-study' : 'default'"
                :client-name="p.clientName"
                :client-prefix="p.clientPrefix"
                :selected="!isMobile && p.id === activeProject.id"
                :pressed="p.id === pressedId"
                @pointerenter="(e) => onThumbEnter(e, p.id)"
                @pointerleave="() => onThumbLeave(p.id)"
                @pointermove="onThumbMove"
                @pointerdown="(e) => onThumbDown(e, p.id)"
                @pointerup="() => onThumbUp(p.id)"
                @pointercancel="() => (pressedId = null)"
              />
            </template>
          </div>
          </div>
        </aside>

        <section v-if="!isMobile" class="dl-detail" aria-label="Project detail">
          <PanelChiselBackground class="dl-detail__surface" work-stage-inset>
            <div
              v-if="displayedEmbeddedComponent"
              class="dl-embedded"
              :class="{ 'dl-embedded--case': isCaseStudyEmbedded }"
            >
              <component :is="displayedEmbeddedComponent" :key="displayedId" />
            </div>
          </PanelChiselBackground>

          <SoftDrillWipe
            :phase="wipePhase"
            :trigger="wipeTrigger"
            @cleared="onCleared"
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
  /* Clip horizontal bleed; allow deckled panel rim above the grid */
  overflow-x: clip;
  overflow-y: visible;
  background: var(--color-bg);
  color: var(--color-text);
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

/* Roster column only — detail pane uses flat `--color-bg` (matches site canvas) */
.roster-pane__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(circle at 15% 15%, rgba(47, 51, 57, 0.05) 0%, transparent 45%),
    radial-gradient(circle at 85% 25%, rgba(74, 80, 88, 0.03) 0%, transparent 55%),
    repeating-linear-gradient(90deg, rgba(26, 24, 20, 0.025) 0 1px, transparent 1px 80px),
    repeating-linear-gradient(0deg, rgba(26, 24, 20, 0.015) 0 1px, transparent 1px 80px);
  opacity: 0.45;
  filter: blur(0.2px);
  pointer-events: none;
}
.roster-pane__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--noise-svg);
  opacity: 0.06;
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

.roster-pane-shell {
  position: relative;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: var(--color-bg);
}

.roster-pane__scroll {
  position: relative;
  z-index: 1;
  height: 100%;
  max-height: 100%;
  min-height: 0;
  overflow-y: scroll;
  overflow-x: clip;
  padding: 24px 16px 32px;
  box-sizing: border-box;
  scroll-padding-bottom: 48px;
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--color-accent) 42%, transparent)
    color-mix(in srgb, var(--color-accent) 10%, var(--color-bg));
}

:deep(.roster-pane__scroll::-webkit-scrollbar) {
  width: 10px;
  -webkit-appearance: none;
}
:deep(.roster-pane__scroll::-webkit-scrollbar-track) {
  background: color-mix(in srgb, var(--color-accent) 10%, var(--color-bg));
  border-radius: 999px;
}
:deep(.roster-pane__scroll::-webkit-scrollbar-button) {
  width: 0;
  height: 0;
  display: none;
}
:deep(.roster-pane__scroll::-webkit-scrollbar-thumb) {
  background: color-mix(in srgb, var(--color-accent) 38%, transparent);
  border-radius: 999px;
  border: 2px solid color-mix(in srgb, var(--color-accent) 10%, var(--color-bg));
  background-clip: padding-box;
  min-height: 40px;
}
:deep(.roster-pane__scroll::-webkit-scrollbar-thumb:hover) {
  background: color-mix(in srgb, var(--color-accent) 52%, transparent);
  background-clip: padding-box;
}

.roster-header {
  font-family: var(--font-sans);
  font-size: var(--text-heading-accent);
  letter-spacing: var(--tracking-heading-tight);
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin: 0 0 24px;
  padding: 0 4px 8px;
  line-height: var(--leading-tight);
  font-weight: 900;
}

.roster-section-header {
  grid-column: 1 / -1;
  margin: 0;
  padding: 0 4px 8px;
}

.roster-section-header .type-eyebrow {
  margin: 0;
}

.roster-section-header--spaced {
  margin-top: 8px;
  padding-top: 20px;
}

.dl-detail {
  position: relative;
  min-width: 0;
  min-height: 0;
  height: 100%;
  max-height: 100%;
  overflow: visible;
  /* Same canvas as the rest of the site — no `.dl-bg` overlay in this column */
  background: var(--color-bg);
  /* 16px — matches bottom; deckle bleed sits in panel block padding below */
  padding-block: var(--work-detail-gutter, var(--grid-2));
  padding-inline: 0;
  box-sizing: border-box;
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
  overscroll-behavior: auto;
  padding: var(--grid-3) var(--grid-2) var(--grid-6);
  z-index: 1;
  box-sizing: border-box;
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
}
.dl-embedded--case :deep(.case-study-layout) {
  max-width: 100%;
}
.dl-embedded--case :deep(.toc-sidebar-column) {
  overflow: visible;
}

.dl-embedded--case :deep(.toc-sidebar-sticky) {
  top: clamp(20px, 2.5vw, 32px);
  overflow: visible;
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

.dl-embedded--case :deep(.type-hero-title),
.dl-embedded--case :deep(.hero-desc),
.dl-embedded:not(.dl-embedded--case) :deep(h1),
.dl-embedded:not(.dl-embedded--case) :deep(h2),
.dl-embedded:not(.dl-embedded--case) :deep(h3),
.dl-embedded:not(.dl-embedded--case) :deep(h4),
.dl-embedded:not(.dl-embedded--case) :deep(p) {
  color: var(--color-text);
}

.dl-embedded:not(.dl-embedded--case) :deep(h1),
.dl-embedded:not(.dl-embedded--case) :deep(h2),
.dl-embedded:not(.dl-embedded--case) :deep(h3),
.dl-embedded:not(.dl-embedded--case) :deep(h4) {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: var(--tracking-display);
}

.dl-embedded:not(.dl-embedded--case) :deep(.text-muted),
.dl-embedded:not(.dl-embedded--case) :deep(.type-case-body),
.dl-embedded:not(.dl-embedded--case) :deep(.type-case-caption) {
  color: var(--color-text-muted);
}

@media (max-width: 767px) {
  .dl-app {
    height: auto;
    min-height: 100%;
    overflow: visible;
  }

  .dl-shell {
    padding-inline: 12px;
  }

  .dl-grid {
    grid-template-columns: 1fr;
  }

  .roster-pane-shell {
    height: auto;
    max-height: none;
  }

  .roster-pane__scroll {
    height: auto;
    max-height: none;
    overflow-y: visible;
    padding-inline: 8px;
  }

}
</style>

