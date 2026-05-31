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
    <div class="type-hero-stack detective-hero-intro__headline">
      <h1 class="type-display-hero detective-hero-intro__title">
        <span class="type-display-hero-name text-accent">Bramha</span>
      </h1>
      <h2 class="type-hero-role text-accent detective-hero-intro__role">
        {{ roleLabel }}
      </h2>
    </div>
    <p class="type-hero-tagline detective-hero-intro__tagline">
      <span class="detective-hero-intro__tagline-line">7 years of experience in</span>
      <span class="detective-hero-intro__tagline-line detective-hero-intro__tagline-line--sub">
        turning
        <span class="detective-hero-intro__cycle">
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
  width: 100%;
  min-height: var(--home-hero-min-height, calc(100vh - 72px));
  height: var(--home-hero-min-height, calc(100vh - 72px));
  box-sizing: border-box;
}

.detective-hero-intro__headline {
  position: absolute;
  inset-inline: 0;
  top: var(--hero-thirds-first-line);
  transform: translateY(-50%);
  margin: 0;
}

.detective-hero-intro__title {
  margin: 0;
  text-shadow: 0 0 40px color-mix(in srgb, var(--color-accent) 12%, transparent);
}

.detective-hero-intro__headline .type-display-hero-name {
  margin-block-end: calc(-1 * var(--hero-name-role-overlap));
}

.detective-hero-intro__role {
  margin: 0;
  text-shadow: 0 0 24px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.detective-hero-intro__tagline {
  position: absolute;
  inset-inline: 0;
  top: var(--hero-thirds-second-line);
  transform: translateY(-50%);
  margin: 0;
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
  margin-inline-start: 0.28em;
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

@media (max-width: 768px) {
  .detective-hero-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--grid-4);
    min-height: auto;
    height: auto;
    padding-block: 24px 16px;
    text-align: center;
  }

  .detective-hero-intro__headline,
  .detective-hero-intro__tagline {
    position: static;
    transform: none;
  }

  .detective-hero-intro__tagline-line--sub {
    white-space: normal;
  }

  .detective-hero-intro__cycle-ghost,
  .detective-hero-intro__cycle-active {
    white-space: normal;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detective-hero-intro__cursor {
    animation: none;
  }
}
</style>
