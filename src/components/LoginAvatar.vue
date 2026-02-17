<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-[800px] min-h-[600px] bg-white rounded-[20px] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden p-6 mx-4">
      
      <!-- Avatar Animation Container -->
      <!-- Responsive size: Scale down on mobile, max fixed size on desktop -->
      <div 
        ref="lottieContainer" 
        class="w-full max-w-[512px] h-auto aspect-[4/3] flex items-center justify-center -mt-6 sm:-mt-10"
      ></div>

      <!-- Title -->
      <h1 class="text-[28px] sm:text-[36px] font-semibold text-[#3b3b3b] mb-6 font-sans text-center">Log In</h1>

      <!-- Login Form -->
      <form class="flex flex-col items-center gap-4 w-full" @submit.prevent="handleLogin">
        
        <!-- Email Input -->
        <div class="w-full max-w-[448px] h-[60px] border border-[#595858] rounded-[4px] px-[12px] py-[8px] flex flex-col justify-center gap-[4px] bg-white transition-all focus-within:ring-2 focus-within:ring-[#2cd203] focus-within:border-transparent">
          <label for="email" class="text-[12px] text-[#6b6b6b] leading-none font-sans cursor-text">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="text-[16px] text-[#3b3b3b] font-light outline-none bg-transparent w-full placeholder:italic placeholder:text-[#6b6b6b]/50"
            placeholder="avatar@example.com"
            @focus="handleEmailFocus"
            @blur="handleBlur"
            @input="handleEmailInput"
          />
        </div>

        <!-- Password Input -->
        <div class="w-full max-w-[448px] h-[60px] border border-[#595858] rounded-[4px] px-[12px] py-[8px] flex flex-col justify-center gap-[4px] bg-white transition-all focus-within:ring-2 focus-within:ring-[#2cd203] focus-within:border-transparent">
          <label for="password" class="text-[12px] text-[#6b6b6b] leading-none font-sans cursor-text">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="text-[16px] text-[#3b3b3b] font-light outline-none bg-transparent w-full placeholder:italic placeholder:text-[#6b6b6b]/50"
            placeholder="Your password"
            @focus="handlePasswordFocus"
            @blur="handleBlur"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full max-w-[448px] h-[60px] bg-[#2cd203] text-white text-[24px] sm:text-[32px] font-normal rounded-[60px] mt-2 flex items-center justify-center hover:bg-[#26b803] transition-colors focus:outline-none focus:ring-4 focus:ring-[#2cd203]/40"
        >
          Log In
        </button>

        <!-- Forgot Password -->
        <a href="#" class="text-[14px] sm:text-[16px] text-[#3b3b3b] underline mt-2 hover:text-black transition-colors text-center">
            I forgot my password
        </a>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import lottie, { AnimationItem } from 'lottie-web';
import avatarAnimation from '../assets/Avatar.json';

// Frame Mapping from Avatar.json analysis:
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
/* Using Tailwind for everything primarily, ensuring Inter font is used if available */
body {
    font-family: 'Inter', sans-serif;
}
</style>
