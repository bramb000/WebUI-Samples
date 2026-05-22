<script setup lang="ts">
import cosplayImage from '../assets/images/about/about-1.webp';
import speakingImage from '../assets/images/about/about-2.webp';
import PrimaryButton from '../components/PrimaryButton.vue';
</script>

<template>
  <div class="page-about flex flex-col gap-16 pt-12 pb-24 text-[var(--color-text)]">

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

    <!-- ── Process ── -->
    <section class="process-section">
      <div class="section-header border-b border-[var(--color-border)] pb-3 mb-7">
        <h2 class="type-section-title">My Process</h2>
      </div>

      <div class="process-grid grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Step 1 -->
        <div class="process-card panel-recessed noise-overlay">
          <div class="bg-step-num">1</div>
          <div class="process-card-inner">
            <div class="step-badge btn-extruded step-badge-static">01</div>
            <h3 class="type-case-subsection">Research</h3>
            <p class="type-body">Obsessing over understanding the user and the core problem before jumping into pixels.</p>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="process-card process-card--mid panel-recessed noise-overlay">
          <div class="bg-step-num">2</div>
          <div class="process-card-inner">
            <div class="step-badge btn-extruded step-badge-static">02</div>
            <h3 class="type-case-subsection">Validate</h3>
            <p class="type-body">Testing solutions rapidly and aligning cross-functional teams with high-fidelity prototypes.</p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="process-card process-card--low panel-recessed noise-overlay">
          <div class="bg-step-num">3</div>
          <div class="process-card-inner">
            <div class="step-badge btn-extruded step-badge-static">03</div>
            <h3 class="type-case-subsection">Execute</h3>
            <p class="type-body">Deriving execution speed by building empathy—understanding them, talking to them, and becoming a power user myself.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Testimonial ── -->
    <section class="testimonial-block p-10 md:p-14 overflow-hidden border-l-[3px] border-[var(--color-accent)] panel-recessed noise-overlay relative">
      <!-- Decorative quote mark -->
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
    <section class="cta-section flex flex-col items-start gap-5">
      <p class="type-body">If you've reached here, why not read a few case studies?</p>
      <PrimaryButton to="/work" class="cta-btn">View Case Studies</PrimaryButton>
    </section>

  </div>
</template>

<style scoped>
.page-about .type-hero-title {
  text-shadow: 0 0 30px color-mix(in srgb, var(--color-accent) 8%, transparent);
}
.page-about .type-body-lg {
  margin: 0;
}
.page-about .type-section-title {
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

.process-card {
  position: relative;
  padding: 28px;
  overflow: hidden;
  cursor: default;
  transition:
    box-shadow  250ms var(--ease-mechanical-spring),
    transform   250ms var(--ease-mechanical-spring),
    border-color 150ms var(--ease-te-snap);
}
.process-card--mid { transform: translateY(0); }
.process-card--low { transform: translateY(0); }

@media (min-width: 768px) {
  .process-card--mid { transform: translateY(16px); }
  .process-card--low { transform: translateY(32px); }
  .process-card--mid:hover { transform: translateY(12px); }
  .process-card--low:hover { transform: translateY(28px); }
}

.process-card:hover {
  border-color: var(--color-border-hi) !important;
  transform: translateY(-6px);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.7),
    0 16px 40px rgba(0, 0, 0, 0.8),
    var(--dl-glow-global);
}

.bg-step-num {
  position: absolute;
  right: -8px;
  bottom: -20px;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 100px;
  color: var(--color-accent);
  opacity: 0.04;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  transition: opacity 250ms;
}
.process-card:hover .bg-step-num { opacity: 0.09; }

.process-card-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 14px;
}

.step-badge-static {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  font-family: var(--font-sans);
  font-size: 12px;
  cursor: default;
  pointer-events: none;
}

.process-card-inner .type-body {
  margin: 0;
}

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
.cta-btn { padding: 12px 28px; font-size: var(--text-body-sm); }
</style>
