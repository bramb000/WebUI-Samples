<script setup lang="ts">
import { ref } from 'vue'
import { ChevronUp, Settings, CreditCard, Bell } from 'lucide-vue-next'

const isOpen = ref(false)

const toggleTray = () => {
  isOpen.value = !isOpen.value
}

// Stats data for the SaaS odometer
const stats = [
  { label: 'Dashboards Created', value: '0012', icon: Settings },
  { label: 'Credits Consumed', value: '4890', icon: CreditCard },
  { label: 'Agents Deployed', value: '0034', icon: Bell },
]
</script>

<template>
  <div class="tray-container group relative w-[352px] mx-auto z-10" :class="{ 'is-open': isOpen }">
    <!-- Main interactive surface: Brutalist flat metal TP-7 styling -->
    <div 
      class="tray-surface relative overflow-hidden bg-[#d8d8d8] w-full flex flex-col items-stretch rounded-[12px] shadow-[0_24px_48px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_1px_rgba(0,0,0,0.15)] border border-[#a0a0a0] z-10"
    >
      <!-- Handle / Header moved below Accordion -->      <!-- Accordion Body (The Mechanical Housing) -->
      <!-- Accordion Body (The Mechanical Housing) -->
      <div 
        class="accordion-wrapper flex flex-col transition-all duration-[150ms] overflow-hidden" 
        :class="isOpen ? 'ease-te-slide duration-[150ms]' : 'ease-te-snap duration-[80ms]'"
        :style="{ height: isOpen ? '276px' : '0px' }"
      >
        <!-- The perfectly flat internal cavity of the mechanism -->
        <div class="tray-body flex-1 p-4 flex flex-col gap-2 bg-[#d2d2d2] relative border-b border-[#a0a0a0]">
          
          <!-- Inner mechanical texture overlay -->
          <div class="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.5%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');"></div>

          <!-- Items swiveling like odometer wheels -->
          <div 
            v-for="(item, index) in stats" 
            :key="index"
            class="menu-item-wrapper perspective-[1000px] relative z-10"
          >
            <!-- No shadow blocks needed for fully recessed panels -->

            <div 
              class="menu-item w-full h-12 transform-style-3d cursor-default group/item origin-center"
              :class="isOpen ? 'transition-all duration-[500ms] ease-mechanical-flip' : 'transition-none'"
              :style="{ transitionDelay: isOpen ? `${150 + index * 150}ms` : '0ms' }"
            >
              <!-- Left Axle/Watch Knob -->
              <div class="absolute left-[-2px] top-[14px] w-[2px] h-[20px] bg-[#b0b0b0] rounded-l-[1px] border border-[#888] border-r-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),-1px_2px_2px_rgba(0,0,0,0.2)] flex flex-col items-center justify-evenly py-0 z-0 transform -translate-x-full">
                <div class="w-full h-[1px] bg-[#888] opacity-50"></div>
                <div class="w-full h-[1px] bg-[#888] opacity-50"></div>
              </div>

              <!-- Right Axle/Watch Knob -->
              <div class="absolute right-[-2px] top-[14px] w-[2px] h-[20px] bg-[#b0b0b0] rounded-r-[1px] border border-[#888] border-l-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),1px_2px_2px_rgba(0,0,0,0.2)] flex flex-col items-center justify-evenly py-0 z-0 transform translate-x-full">
                <div class="w-full h-[1px] bg-[#888] opacity-50"></div>
                <div class="w-full h-[1px] bg-[#888] opacity-50"></div>
              </div>

              <!-- Front Face (Content of the odometer drum - RECESSED) -->
              <div class="menu-item-face menu-item-front absolute inset-0 rounded-[4px] flex items-center justify-between px-4 border border-[#a8a8a8] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,1)] bg-[#cfcfcf]">
                
                <!-- Stat Label -->
                <div class="flex items-center gap-3">
                  <div class="w-1.5 h-1.5 rounded-full bg-[#ff5722] shadow-[0_0_4px_rgba(255,87,34,0.6),inset_0_1px_1px_rgba(255,255,255,0.8)]"></div>
                  <span class="font-extrabold text-[#333] text-[11px] tracking-widest uppercase">{{ item.label }}</span>
                </div>

                <!-- TP-7 Inset LCD Screen for the Odometer -->
                <div class="lcd-screen w-16 h-8 bg-[#111] rounded-[2px] border border-[#000] shadow-[inset_0_2px_4px_rgba(0,0,0,1),0_1px_0_rgba(255,255,255,0.4)] flex items-center justify-center overflow-hidden relative">
                  <!-- Glare overlay -->
                  <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-10"></div>
                  
                  <!-- Rolling mechanism container -->
                  <div class="digit-roller flex font-sans text-[14px] font-bold tracking-widest text-[#fff] leading-none" :class="{ 'is-rolling': isOpen }">
                    <div class="flex space-x-[2px]">
                      <!-- Each digit container -->
                      <div v-for="(char, i) in item.value" :key="i" class="digit-col relative h-[14px] w-[9px] overflow-hidden bg-[#222]">
                        <div class="digit-strip absolute top-0 left-0 flex flex-col transition-transform"
                             :style="{ transitionDelay: isOpen ? `${150 + index * 150 + 200 + i * 100}ms` : '0ms', transitionDuration: isOpen ? '600ms' : '0ms', transform: isOpen ? `translateY(-${parseInt(char) * 14}px)` : 'translateY(0)' }">
                          <span v-for="n in 10" :key="n" class="h-[14px] flex items-center justify-center">{{ (n - 1) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Back Face (Empty metal plate - RECESSED) -->
              <div class="menu-item-face menu-item-back absolute inset-0 rounded-[4px] border border-[#b8b8b8] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] bg-[#c8c8c8]">
                <!-- Blank mechanical back panel detailing -->
                <div class="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#888] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.5)]"></div>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#888] shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>
          </div>
          
          <!-- Extruded Interactive Action Button -->
          <div class="mt-4 perspective-[1000px] relative z-10 w-full h-[40px] mb-2">
             <div 
               class="w-full h-full transform-style-3d origin-top"
               :class="isOpen ? 'transition-all duration-[500ms] ease-mechanical-flip' : 'transition-none'"
               :style="{ transitionDelay: isOpen ? `${150 + stats.length * 150}ms` : '0ms', transform: isOpen ? 'rotateX(0deg)' : 'rotateX(-90deg)', opacity: isOpen ? 1 : 0 }"
             >
               <button 
                 class="relative w-full h-full rounded-[4px] bg-[#ff5722] border-t-[1px] border-[#ff8a65] border-b-[1px] border-[#d84315] text-white font-extrabold text-[11px] tracking-wider uppercase cursor-pointer shadow-[0_4px_0_#bf360c,0_8px_16px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] active:translate-y-[4px] active:shadow-[0_0px_0_#bf360c,0_2px_4px_rgba(0,0,0,0.2),inset_0_3px_6px_rgba(0,0,0,0.3)] hover:brightness-110 active:brightness-95 transition-all duration-75 block focus:outline-none"
               >
                 <span style="text-shadow: 0 1px 1px rgba(0,0,0,0.3);">Manage Usage</span>
               </button>
             </div>
          </div>

        </div>
      </div>
      
      <!-- Handle / Header - Brutalist TP-7 Top Plate -->
      <button 
        @click="toggleTray"
        class="tray-header relative z-10 w-full flex items-center justify-between p-4 bg-[#d8d8d8] hover:bg-[#d0d0d0] active:bg-[#c8c8c8] cursor-pointer select-none ring-0 outline-none rounded-[12px] shadow-[0_-2px_4px_rgba(0,0,0,0.05)] border-t border-[#f0f0f0]"
        :class="isOpen ? 'border-b border-[#a0a0a0] z-20' : ''"
      >
        <div class="flex items-center gap-4 relative z-10">
          <div class="flex flex-col text-left">
            <span class="font-bold text-[#222] tracking-tight leading-tight uppercase text-sm">View Usage</span>
            <span class="text-[10px] text-[#666] font-sans font-bold tracking-[0.2em] uppercase mt-1">Status: Active</span>
          </div>
        </div>
        
        <div class="chevron relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#ff5722] shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-[#e64a19]">
          <ChevronUp :size="16" class="text-white stroke-[3px] transition-transform duration-[100ms] ease-te-snap" />
        </div>
      </button>

    </div>
  </div>
</template>

<style scoped>
/* Teenage Engineering Hard Slide: Fast and brutal stop */
.ease-te-slide {
  transition-timing-function: cubic-bezier(0.9, 0, 0, 1);
}

/* Teenage Engineering Snap: Completely instant, no smooth slow-in */
.ease-te-snap {
  transition-timing-function: cubic-bezier(1, 0, 0, 1);
}

/* Delightful mechanical spring flip: slower, highly perceivable, satisfying */
.ease-mechanical-flip {
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.transform-style-3d {
  transform-style: preserve-3d;
}

/* Base state for the header when closed */
.tray-header {
  transition: border-radius 0ms, background-color 200ms cubic-bezier(1, 0, 0, 1);
}

/* When opening, the header snaps into its flat mechanical shape */
.is-open .tray-header {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  background-color: #d8d8d8;
}

/* Chevron mechanical rotation */
.is-open .chevron svg {
  transform: rotate(-180deg);
}

/* Odometer Drum Setup */
.menu-item-face {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transition: transform 0ms, box-shadow 0ms, background-color 0ms, filter 0ms;
}

/* Set the transform origin in the center since we rotate on X */
.menu-item {
  transform-origin: 50% 50%;
  /* Start tucked away, showing the back side */
  transform: rotateX(180deg);
  opacity: 1;
}

/* When opening, the drums snap to face front */
.tray-container.is-open .menu-item {
  transform: rotateX(0deg);
}

.menu-item-back {
  /* This is the mechanical empty back of the chip */
  transform: rotateX(180deg);
}
</style>
