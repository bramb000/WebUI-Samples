<script setup lang="ts">
import cosplayImage from '../assets/images/about/about-1.webp';
import speakingImage from '../assets/images/about/about-2.webp';
import PrimaryButton from '../components/PrimaryButton.vue';
import DetectiveBookStage from '../components/detective/DetectiveBookStage.vue';
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
            <img :src="cosplayImage" alt="Cosplay photo" fetchpriority="high" class="photo-img" />
          </div>
          <div class="photo-frame photo-front">
            <img :src="speakingImage" alt="Bramha speaking on stage" fetchpriority="high" class="photo-img" />
          </div>
        </div>
      </section>
    </div>

    <DetectiveBookStage />

    <div class="page-about__container flex flex-col gap-16 pb-24 pt-16">
      <!-- ── Testimonial ── -->
      <section class="testimonial-block p-10 md:p-14 overflow-hidden border-l-[3px] border-[var(--color-accent)] panel-recessed noise-overlay relative">
        <div class="quote-mark" aria-hidden="true">"</div>

        <div class="testimonial-inner">
          <blockquote class="type-body-lg italic">
            "If there was a challenge that needed solving, Bramha was always willing to step in and try to solve it with curiosity, grit, and determination. If you're looking for someone who will challenge the status quo, ask the right questions, and search for the best answers, Bramha is someone I'd recommend."
          </blockquote>

          <div class="quote-attribution">
            <div class="attribution-rule"></div>
            <div>
              <p class="type-case-testimonial-name">Chris Clay</p>
              <p class="type-case-testimonial-role">VP of Design, Immutable</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── CTA ── -->
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

.quote-mark {
  position: absolute;
  top: -32px;
  left: -8px;
  font-family: var(--font-display);
  font-size: 140px;
  font-weight: 900;
  line-height: 1;
  color: var(--color-accent);
  opacity: 0.06;
  user-select: none;
  pointer-events: none;
}

.testimonial-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.testimonial-inner .type-body-lg {
  margin: 0;
}

.quote-attribution {
  display: flex;
  align-items: center;
  gap: 16px;
}
.attribution-rule {
  width: 32px;
  height: 2px;
  background: var(--color-accent);
  box-shadow: 0 0 8px var(--color-accent);
  border-radius: 1px;
  transition: width 400ms var(--ease-mechanical-spring);
  flex-shrink: 0;
}
.testimonial-block:hover .attribution-rule { width: 64px; }
.quote-attribution .type-case-testimonial-name {
  color: var(--color-border-hi);
  margin: 0;
}
.quote-attribution .type-case-testimonial-role {
  margin: 0;
}

.cta-section .type-body {
  margin: 0;
}
</style>
