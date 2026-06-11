<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { Play } from 'lucide-vue-next'
import { HERO_COMPANY_LOGOS } from '../assets/images/clients/clientLogos'
import { useCampaignRole } from '../composables/useCampaignRole'
import { getCachedPencilFrameImage, PENCIL_FRAME_BLEED_PX, quantizePencilBakeDimensions } from '../vfx/pencilFrameBake'
import { resolveCssColorToHex } from '../vfx/resolveCssColorToHex'

/** Flip to `true` when the intro video asset is ready. */
const INTRO_VIDEO_ENABLED = false

interface Props {
  videoSrc?: string
  videoPoster?: string
}

const props = defineProps<Props>()

const { roleLabel } = useCampaignRole()
const videoRef = ref<HTMLVideoElement | null>(null)
const videoStageRef = ref<HTMLElement | null>(null)
const isPlaying = ref(false)

const hasVideo = computed(() => Boolean(props.videoSrc))

type PencilRingLayer = {
  key: string
  url: string
  sizePx: number
}

const pencilRings = ref<PencilRingLayer[]>([])

/** Disc diameter as a fraction of the square stage. */
const VIDEO_DISC_RATIO = 0.76

const RING_LAYER_CONFIG = [
  { padPx: 6, seed: 71 },
  { padPx: 18, seed: 137 },
] as const

let resizeObserver: ResizeObserver | null = null
let rebakeTimer = 0

function toggleVideo() {
  if (!props.videoSrc || !videoRef.value) return
  if (videoRef.value.paused) {
    void videoRef.value.play()
    isPlaying.value = true
  } else {
    videoRef.value.pause()
    isPlaying.value = false
  }
}

function onVideoEnded() {
  isPlaying.value = false
}

function rebakePencilRings(attempt = 0) {
  const el = videoStageRef.value
  if (!el) return

  const stage = el.getBoundingClientRect().width
  if (stage < 32) {
    if (attempt < 32)
      requestAnimationFrame(() => rebakePencilRings(attempt + 1))
    return
  }

  const stroke = resolveCssColorToHex(el, 'var(--color-accent)', '#2f3339')
  const disc = stage * VIDEO_DISC_RATIO
  const nextRings: PencilRingLayer[] = []

  for (const layer of RING_LAYER_CONFIG) {
    const size = disc + layer.padPx * 2
    const { widthCss, heightCss } = quantizePencilBakeDimensions(size, size, 'frame')
    const bakeKey = `intro-ring|${widthCss}|${heightCss}|${stroke}|${layer.seed}`

    const url = getCachedPencilFrameImage({
      widthCss,
      heightCss,
      strokeColorHex: stroke,
      fillColorHex: '#000000',
      variant: 'frame',
      frameShape: 'ellipse',
      frameStyle: 'sketch',
      strokeOnly: true,
      bleedPx: PENCIL_FRAME_BLEED_PX,
      seed: layer.seed,
    })

    if (!url) continue

    nextRings.push({
      key: bakeKey,
      url,
      sizePx: size,
    })
  }

  if (!nextRings.length && attempt < 32) {
    requestAnimationFrame(() => rebakePencilRings(attempt + 1))
    return
  }

  const unchanged = nextRings.length === pencilRings.value.length
    && nextRings.every((ring, index) => ring.key === pencilRings.value[index]?.key)
  if (!unchanged)
    pencilRings.value = nextRings
}

function scheduleRebake() {
  if (rebakeTimer)
    window.clearTimeout(rebakeTimer)
  rebakeTimer = window.setTimeout(() => {
    rebakeTimer = 0
    rebakePencilRings()
  }, 100)
}

onMounted(async () => {
  if (!INTRO_VIDEO_ENABLED)
    return

  await nextTick()
  rebakePencilRings()
  if (!videoStageRef.value || resizeObserver)
    return
  resizeObserver = new ResizeObserver(scheduleRebake)
  resizeObserver.observe(videoStageRef.value)
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (rebakeTimer) {
    window.clearTimeout(rebakeTimer)
    rebakeTimer = 0
  }
})
</script>

<template>
  <header class="intro-hero">
    <div
      class="intro-hero__grid"
      :class="{ 'intro-hero__grid--with-video': INTRO_VIDEO_ENABLED }"
    >
      <div class="intro-hero__copy">
        <div class="type-hero-stack intro-hero__headline">
          <h1 class="type-hero-name text-accent intro-hero__title">
            Bramha
          </h1>
          <p class="type-hero-role">
            {{ roleLabel }}
          </p>
        </div>

        <ul class="intro-hero__logos" aria-label="Companies">
          <li
            v-for="company in HERO_COMPANY_LOGOS"
            :key="company.name"
            class="intro-hero__logo-item"
          >
            <img
              class="intro-hero__client-logo"
              :src="company.logo"
              :alt="`${company.name} logo`"
              width="18"
              height="18"
            />
            <span class="intro-hero__logo-label">{{ company.name }}</span>
          </li>
        </ul>

        <p class="type-body-lg intro-hero__bio">
          Hello there! My name is Bramha and I'm a
          <span class="text-accent">{{ roleLabel }}</span>,
          living in Sydney. I grew up on the internet and love computers and software.
          In my 7 years of experience I have built products and designed experiences,
          planned, supported, and implemented features and roadmaps, and led cross-functional
          teams at companies like Immutable, Reliance Games, and Ubisoft.
        </p>
      </div>

      <!-- Intro video — set INTRO_VIDEO_ENABLED when asset is ready -->
      <div v-if="INTRO_VIDEO_ENABLED" class="intro-hero__media">
        <p class="type-hero-tagline intro-hero__media-label">
          Let me introduce myself
        </p>

        <div ref="videoStageRef" class="intro-hero__video-stage">
          <span
            v-for="ring in pencilRings"
            :key="ring.key"
            class="intro-hero__pencil-ring"
            aria-hidden="true"
            :style="{
              width: `${ring.sizePx}px`,
              height: `${ring.sizePx}px`,
              backgroundImage: `url('${ring.url}')`,
            }"
          />

          <div class="intro-hero__video-disc">
            <video
              v-if="hasVideo"
              ref="videoRef"
              class="intro-hero__video"
              :src="videoSrc"
              :poster="videoPoster"
              playsinline
              @ended="onVideoEnded"
            />
            <div v-else class="intro-hero__video-placeholder" aria-hidden="true" />

            <button
              type="button"
              class="intro-hero__play"
              :class="{ 'intro-hero__play--hidden': hasVideo && isPlaying }"
              :disabled="!hasVideo"
              :aria-label="hasVideo ? 'Play introduction video' : 'Introduction video coming soon'"
              @click="toggleVideo"
            >
              <Play class="intro-hero__play-icon" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p v-if="!hasVideo" class="type-body-sm intro-hero__video-note">
          Video coming soon
        </p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.intro-hero {
  position: relative;
  width: 100%;
}

.intro-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 38rem);
  justify-content: center;
  align-items: center;
  gap: clamp(var(--grid-5), 5vw, var(--grid-7));
  width: 100%;
  min-height: var(--home-hero-min-height, calc(100vh - 72px));
  padding-block: var(--grid-6) var(--grid-7);
  box-sizing: border-box;
}

.intro-hero__grid--with-video {
  grid-template-columns: minmax(0, 38rem) minmax(15rem, 20rem);
}

.intro-hero__copy {
  display: flex;
  flex-direction: column;
  gap: var(--grid-4);
  min-width: 0;
}

.intro-hero__headline {
  margin: 0;
}

.intro-hero__title {
  margin: 0;
  text-shadow: 0 0 32px color-mix(in srgb, var(--color-accent) 14%, transparent);
}

.intro-hero__logos {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--grid-2) var(--grid-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.intro-hero__logo-item {
  display: inline-flex;
  align-items: center;
  gap: var(--grid-1);
  min-width: 0;
}

.intro-hero__client-logo {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.intro-hero__logo-label {
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  font-weight: 500;
  letter-spacing: var(--tracking-heading-tight);
  color: var(--color-text-muted);
  white-space: nowrap;
}

.intro-hero__bio {
  margin: 0;
}

.intro-hero__media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--grid-2);
  width: 100%;
  min-width: 0;
}

.intro-hero__media-label {
  margin: 0;
  width: 100%;
  text-align: center;
}

.intro-hero__video-stage {
  --intro-disc-ratio: 0.76;
  position: relative;
  width: 100%;
  max-width: 20rem;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
}

.intro-hero__video-stage::before {
  content: '';
  position: absolute;
  width: calc(var(--intro-disc-ratio) * 100% + var(--grid-3));
  aspect-ratio: 1;
  border-radius: 50%;
  border: 1.5px solid color-mix(in srgb, var(--color-accent) 55%, transparent);
  pointer-events: none;
  opacity: 0.45;
}

.intro-hero__video-stage:has(.intro-hero__pencil-ring)::before {
  opacity: 0;
}

.intro-hero__pencil-ring {
  position: absolute;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  pointer-events: none;
  z-index: 0;
}

.intro-hero__video-disc {
  position: relative;
  z-index: 1;
  width: calc(var(--intro-disc-ratio) * 100%);
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--dl-glow-global);
}

.intro-hero__video,
.intro-hero__video-placeholder {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.intro-hero__video-placeholder {
  background:
    radial-gradient(
      circle at 50% 35%,
      color-mix(in srgb, var(--color-accent) 8%, transparent),
      transparent 52%
    ),
    linear-gradient(
      180deg,
      var(--color-elevated) 0%,
      var(--color-surface) 100%
    );
}

.intro-hero__play {
  position: absolute;
  right: 10%;
  bottom: 8%;
  width: calc(var(--grid-unit) * 6);
  height: calc(var(--grid-unit) * 6);
  display: grid;
  place-items: center;
  padding: 0;
  border: var(--dl-border-width) solid var(--color-border-hi);
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-bg);
  cursor: pointer;
  transition: transform 180ms var(--ease-mechanical-spring);
}

.intro-hero__play:disabled {
  cursor: default;
  opacity: 0.72;
}

.intro-hero__play:not(:disabled):hover {
  transform: scale(1.05);
}

.intro-hero__play--hidden {
  opacity: 0;
  pointer-events: none;
}

.intro-hero__play-icon {
  width: calc(var(--grid-unit) * 2.75);
  height: calc(var(--grid-unit) * 2.75);
  margin-left: 2px;
}

.intro-hero__video-note {
  margin: 0;
  text-align: center;
}

@media (max-width: 960px) {
  .intro-hero__grid {
    min-height: auto;
    padding-block: var(--grid-3) var(--grid-2);
    gap: var(--grid-5);
  }

  .intro-hero__grid--with-video {
    grid-template-columns: minmax(0, 38rem);
  }

  .intro-hero__media {
    order: -1;
    max-width: 18rem;
    margin-inline: auto;
  }
}

@media (max-width: 767px) {
  .intro-hero__grid {
    text-align: center;
  }

  .intro-hero__headline {
    align-items: center;
    width: 100%;
  }

  .intro-hero__logos {
    justify-content: center;
  }
}
</style>
