<script setup lang="ts">
import { computed } from 'vue'
import {
  HERO_TAGLINE_LONGEST_TAIL,
  HERO_TAGLINE_PHRASES,
  HERO_TAGLINE_TAILS,
  parseHeroTaglineTailSegments,
} from '../../constants/heroTaglinePhrases'
import { useCampaignRole } from '../../composables/useCampaignRole'
import { useReducedMotion } from '../../composables/useReducedMotion'
import { useTypewriterCycle } from '../../composables/useTypewriterCycle'

const { roleLabel } = useCampaignRole()

const reducedMotion = useReducedMotion()
const { displayed: taglineTail, phraseIndex } = useTypewriterCycle(HERO_TAGLINE_TAILS, {
  reducedMotion,
})

const taglineSegments = computed(() =>
  parseHeroTaglineTailSegments(
    taglineTail.value,
    HERO_TAGLINE_PHRASES[phraseIndex.value]!,
  ),
)

const showCursor = computed(() => !reducedMotion.value)
</script>

<template>
  <header class="detective-hero-intro">
    <div class="detective-hero-intro__headline type-hero-stack">
      <h1 class="type-hero-name text-accent detective-hero-intro__title">
        Bramha
      </h1>
      <p class="type-hero-role detective-hero-intro__role">
        {{ roleLabel }}
      </p>
    </div>

    <p class="type-hero-tagline detective-hero-intro__tagline">
      <span class="detective-hero-intro__tagline-line">7 years of experience in</span>
      <span class="detective-hero-intro__tagline-line detective-hero-intro__tagline-line--sub">
        turning <span class="detective-hero-intro__cycle">
          <span class="detective-hero-intro__cycle-ghost" aria-hidden="true">
            {{ HERO_TAGLINE_LONGEST_TAIL }}
          </span>
          <span
            class="detective-hero-intro__cycle-active"
            aria-live="polite"
            aria-atomic="true"
          >
            <span
              v-for="segment in taglineSegments"
              :key="`${segment.accent ? 'a' : 'n'}-${segment.text}`"
              :class="{ 'text-accent': segment.accent }"
            >{{ segment.text }}</span>
            <span
              v-if="showCursor"
              class="detective-hero-intro__cursor"
              aria-hidden="true"
            >|</span>
          </span>
        </span>
      </span>
    </p>
  </header>
</template>

<style scoped>
.detective-hero-intro {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  max-width: 38rem;
  min-height: var(--home-hero-min-height, calc(100vh - 72px));
  height: var(--home-hero-min-height, calc(100vh - 72px));
  box-sizing: border-box;
  padding-block: var(--grid-6) var(--grid-7);
}

.detective-hero-intro__headline {
  margin: 0;
}

.detective-hero-intro__title {
  margin: 0;
  text-shadow: 0 0 32px color-mix(in srgb, var(--color-accent) 14%, transparent);
}

/* Override global h1/h2 display defaults inside the hero */
.detective-hero-intro__title {
  font-weight: var(--font-weight-hero-name);
  letter-spacing: var(--tracking-hero-name);
}

.detective-hero-intro__role {
  margin: 0;
}

.detective-hero-intro__tagline {
  margin: var(--hero-headline-tagline-gap) 0 0;
  max-width: 100%;
}

.detective-hero-intro__tagline-line {
  display: block;
}

.detective-hero-intro__tagline-line--sub {
  white-space: nowrap;
}

.detective-hero-intro__cycle {
  position: relative;
  display: inline-block;
  vertical-align: top;
  margin-inline-start: 0;
  /* Reserve width for the longest tail (Windows can collapse inline-block + absolute overlays to 0) */
  min-width: max-content;
}

.detective-hero-intro__cycle-ghost {
  visibility: hidden;
  user-select: none;
  pointer-events: none;
  white-space: nowrap;
}

.detective-hero-intro__cycle-active {
  position: absolute;
  inset: 0;
  white-space: nowrap;
}

.detective-hero-intro__cursor {
  display: inline-block;
  margin-inline-start: 1px;
  color: var(--color-accent);
  font-weight: 400;
  animation: hero-tagline-cursor-blink 1s step-end infinite;
}

@keyframes hero-tagline-cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@media (max-width: 767px) {
  .detective-hero-intro {
    align-items: center;
    max-width: none;
    min-height: auto;
    height: auto;
    padding-block: var(--grid-3) var(--grid-2);
    text-align: center;
  }

  .detective-hero-intro__headline {
    align-items: center;
    width: 100%;
  }

  .detective-hero-intro__tagline {
    margin-top: var(--grid-4);
    padding-inline: var(--grid-1);
  }

  .detective-hero-intro__tagline-line {
    line-height: var(--leading-snug);
  }

  .detective-hero-intro__tagline-line--sub {
    white-space: normal;
  }

  .detective-hero-intro__cycle {
    display: inline;
  }

  .detective-hero-intro__cycle-ghost {
    display: none;
  }

  .detective-hero-intro__cycle-active {
    position: static;
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detective-hero-intro__cursor {
    animation: none;
  }
}
</style>
