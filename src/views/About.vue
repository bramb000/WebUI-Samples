<script setup lang="ts">
import cosplayImage from '../assets/images/about/about-cosplay-convention.webp';
import speakingImage from '../assets/images/about/about-speaking-on-stage.webp';
import PrimaryButton from '../components/PrimaryButton.vue';
</script>

<template>
  <div class="page-about text-[var(--color-text)]">

    <div class="page-about__container flex flex-col gap-16 pt-12 pb-0">
      <!-- ── Intro ── -->
      <section class="intro-grid grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="intro-text">
          <h1 class="type-hero-title mb-5">More than just design.</h1>
          <p class="type-body-lg text-muted">
            I enjoy cosplay, love Star Wars, and I'm passionate about people. I find joy when products that I build are enjoyed by customers or when I see my team members are growing and having a good time building them.
          </p>
        </div>

        <!-- Photo Gallery Stack -->
        <div class="photo-stack">
          <div class="photo-frame photo-back">
            <img :src="cosplayImage" alt="Bramha Dalvi in cosplay at a fan convention" fetchpriority="high" class="photo-img" />
          </div>
          <div class="photo-frame photo-front">
            <img :src="speakingImage" alt="Bramha Dalvi speaking on stage at a conference" fetchpriority="high" class="photo-img" />
          </div>
        </div>
      </section>
    </div>

    <div class="page-about__container flex flex-col gap-16 pb-24 pt-16">
      <section id="about-cta" class="cta-section flex flex-col items-start gap-5">
        <p class="type-body">If you've reached here, why not read a few case studies?</p>
        <PrimaryButton to="/work">View Case Studies</PrimaryButton>
      </section>
    </div>
  </div>
</template>

<style scoped>
.page-about__container {
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  padding-inline: clamp(1.5rem, 4vw, 3rem);
}

.page-about .type-hero-title {
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.page-about .type-body-lg {
  margin: 0;
}

/* ── Photo Stack — occult etched frames ── */
.photo-stack {
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  min-height: 320px;
  pointer-events: none;
}
.photo-frame {
  position: absolute;
  overflow: hidden;
  border: 2px solid var(--color-border);
  border-radius: 3px;
  box-shadow:
    0 12px 36px rgba(0, 0, 0, 0.7),
    var(--dl-glow-global);
  pointer-events: auto;
  transition: transform 500ms var(--ease-mechanical-spring), border-color 300ms ease;
}
.photo-frame:hover {
  border-color: var(--color-border-hi);
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.9),
    0 0 20px var(--color-accent);
}
.photo-back {
  width: 60%;
  right: 5%;
  top: 5%;
  transform: rotate(6deg);
  z-index: 1;
}
.photo-back:hover { transform: rotate(2deg) scale(1.04); z-index: 3; }
.photo-front {
  width: 70%;
  left: 5%;
  bottom: 5%;
  transform: rotate(-3deg);
  z-index: 2;
}
.photo-front:hover { transform: rotate(-1deg) scale(1.04); z-index: 3; }
.photo-img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 4/3; }

.cta-section .type-body {
  margin: 0;
}
</style>
