<template>
  <div :class="['login-card', theme === 'dark' ? 'login-card--dark' : 'login-card--light']">
    
    <!-- Avatar Animation Container -->
    <!-- Responsive size: Scale down on mobile, max fixed size on desktop -->
    <div 
      ref="lottieContainer" 
      class="login-card__avatar"
    ></div>

    <!-- Title -->
    <h1 class="login-card__title">Log In</h1>

    <!-- Login Form -->
    <form class="login-card__form" @submit.prevent="handleLogin">
      
      <!-- Email Input -->
      <div class="login-card__input-group">
        <label for="email" class="login-card__label">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="login-card__input"
          placeholder="avatar@example.com"
          @focus="handleEmailFocus"
          @blur="handleBlur"
          @input="handleEmailInput"
        />
      </div>

      <!-- Password Input -->
      <div class="login-card__input-group">
        <label for="password" class="login-card__label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="login-card__input"
          placeholder="Your password"
          @focus="handlePasswordFocus"
          @blur="handleBlur"
        />
      </div>

      <!-- Button -->
      <button
        type="submit"
        class="login-card__button"
      >
        Log In
      </button>

      <!-- Forgot Password -->
      <a href="#" class="login-card__link">
          I forgot my password
      </a>

    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import lottie, { AnimationItem } from 'lottie-web';
import avatarAnimation from '../assets/Avatar.json';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
withDefaults(
  defineProps<{
    /** Colour theme for the card. */
    theme?: 'light' | 'dark';
  }>(),
  { theme: 'light' },
);

// ---------------------------------------------------------------------------
// Frame Mapping from Avatar.json analysis
// ---------------------------------------------------------------------------
// IP=0, OP=120
// Idle: 0-1 (approx)
// Look Left-Right range: 3-9 (User defined: 3=Left, 6=Center, 9=Right)
// Close Eyes: 11-12, Squint (eyes squeezed): 13
// Note: playSegments end is exclusive, so we use 14 to include frame 13
const FRAME_IDLE = 0;
const FRAME_LOOK_START = 3;
const FRAME_LOOK_END = 9;
const FRAME_CLOSE_EYES_START = 11;
const FRAME_SQUINT = 14; // End frame for playSegments (exclusive) to land on frame 13

const lottieContainer = ref<HTMLElement | null>(null);
const email = ref('');
const password = ref('');
let anim: AnimationItem | null = null;
let currentSegment = 'IDLE';

const initLottie = () => {
  if (!lottieContainer.value) return;

  anim = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'canvas', // Using canvas to ensure correct layer/mask rendering
    loop: false, 
    autoplay: false,
    animationData: avatarAnimation,
  });

  // Start at Idle
  anim.goToAndStop(FRAME_IDLE, true);
};

// --- Email Logic (Tracking) ---

const handleEmailFocus = () => {
  if (!anim) return;
  currentSegment = 'EMAIL';
  updateHeadPosition(email.value.length);
};

const handleEmailInput = () => {
  if (currentSegment === 'EMAIL') {
    updateHeadPosition(email.value.length);
  }
};

const updateHeadPosition = (currentVal: number) => {
  if (!anim) return;
  // Max Value updated to 44 to match the approx character width of the new 448px input
  const maxVal = 44; 
  
  // Map input length (0-maxVal) to frame range [3, 9]
  const progress = Math.min(currentVal / maxVal, 1);
  const frame = FRAME_LOOK_START + (FRAME_LOOK_END - FRAME_LOOK_START) * progress;
  
  anim.stop();
  anim.resetSegments(true); 
  anim.goToAndStop(frame, true);
};

// --- Password Logic (Close Eyes + Squint) ---

const handlePasswordFocus = () => {
  if (!anim) return;
  currentSegment = 'PASSWORD';
  // Play transition from 11 to 13 (Open -> Squint)
  // End frame is 14 (exclusive) so it plays through and stops on frame 13
  anim.playSegments([FRAME_CLOSE_EYES_START, FRAME_SQUINT], true);
};

// --- Blur Logic (Return to Idle) ---

const handleBlur = () => {
  setTimeout(() => {
    const activeInfo = document.activeElement;
    
    // If focus moved to another input, do nothing (let that input handle it)
    if (activeInfo?.tagName === 'INPUT' || activeInfo?.tagName === 'TEXTAREA') {
        return;
    }
    
    // Otherwise return to idle
    if (anim) {
      if (currentSegment === 'PASSWORD') {
          // If coming from password, animate EYES OPEN properly (13 -> 11)
          anim.playSegments([FRAME_SQUINT, FRAME_CLOSE_EYES_START], true);
      } else {
          // Normal return to Idle
          currentSegment = 'IDLE';
          anim.goToAndStop(FRAME_IDLE, true); 
      }
      currentSegment = 'IDLE'; 
    }
  }, 50);
};

const handleLogin = () => {
  console.log('Login attempt');
};

onMounted(() => {
  initLottie();
});

onUnmounted(() => {
  if (anim) {
    anim.destroy();
  }
});
</script>

<style scoped>
/* ========================================================================
   LOGIN CARD — Light & Dark theme tokens
   ======================================================================== */

/* --- Light theme (default) -------------------------------------------- */
.login-card--light {
  --card-bg: #ffffff;
  --card-text: #3b3b3b;
  --card-label: #6b6b6b;
  --card-placeholder: rgba(107, 107, 107, 0.5);
  --card-input-bg: #ffffff;
  --card-input-border: #595858;
  --card-link: #3b3b3b;
  --card-link-hover: #000000;
}

/* --- Dark theme ------------------------------------------------------- */
.login-card--dark {
  --card-bg: #1e1e2e;
  --card-text: #e4e4e7;
  --card-label: #a1a1aa;
  --card-placeholder: rgba(161, 161, 170, 0.55);
  --card-input-bg: #2a2a3c;
  --card-input-border: #52525b;
  --card-link: #a1a1aa;
  --card-link-hover: #e4e4e7;
}

/* ========================================================================
   Component styles (consume tokens)
   ======================================================================== */

.login-card {
  width: 100%;
  max-width: 800px;
  min-height: 600px;
  background: var(--card-bg);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  padding: 1.5rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--card-text);
  transition: background 0.3s ease, color 0.3s ease;
}

.login-card__avatar {
  width: 100%;
  max-width: 512px;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -1.5rem;
}

@media (min-width: 640px) {
  .login-card__avatar {
    margin-top: -2.5rem;
  }
}

.login-card__title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
  color: var(--card-text);
}

@media (min-width: 640px) {
  .login-card__title {
    font-size: 36px;
  }
}

.login-card__form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.login-card__input-group {
  width: 100%;
  max-width: 448px;
  height: 60px;
  border: 1px solid var(--card-input-border);
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  background: var(--card-input-bg);
  transition: background 0.3s ease, border-color 0.3s ease,
              box-shadow 0.15s ease;
}

.login-card__input-group:focus-within {
  box-shadow: 0 0 0 2px #2cd203;
  border-color: transparent;
}

.login-card__label {
  font-size: 12px;
  color: var(--card-label);
  line-height: 1;
  cursor: text;
}

.login-card__input {
  font-size: 16px;
  font-weight: 300;
  color: var(--card-text);
  outline: none;
  background: transparent;
  width: 100%;
  border: none;
}

.login-card__input::placeholder {
  font-style: italic;
  color: var(--card-placeholder);
}

.login-card__button {
  width: 100%;
  max-width: 448px;
  height: 60px;
  background: #2cd203;
  color: #ffffff;
  font-size: 24px;
  font-weight: 400;
  border: none;
  border-radius: 60px;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-card__button:hover {
  background: #26b803;
}

.login-card__button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 4px rgba(44, 210, 3, 0.4);
}

@media (min-width: 640px) {
  .login-card__button {
    font-size: 32px;
  }
}

.login-card__link {
  font-size: 14px;
  color: var(--card-link);
  text-decoration: underline;
  margin-top: 0.5rem;
  text-align: center;
  transition: color 0.2s ease;
}

.login-card__link:hover {
  color: var(--card-link-hover);
}

.login-card__link:focus-visible {
  outline: 2px solid #2cd203;
  outline-offset: 2px;
  border-radius: 2px;
}

@media (min-width: 640px) {
  .login-card__link {
    font-size: 16px;
  }
}
</style>
