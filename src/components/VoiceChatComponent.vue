<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

type ChatState = 'idle' | 'idle_hint' | 'listening' | 'processing' | 'speaking' | 'navigating' | 'cooking' | 'booking' | 'confused'

const props = defineProps<{
    forceState?: ChatState
}>()

const currentState = ref<ChatState>('idle')
const displayState = computed(() => props.forceState || currentState.value)

const isSpeaking = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isHovering = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const isMobile = ref(false)
const isTyping = ref(false)
const manualInputText = ref("")
let animationFrameId: number
let idleHintTimeout: ReturnType<typeof setTimeout> | null = null

const resetIdleHintTimer = () => {
    if (idleHintTimeout) clearTimeout(idleHintTimeout)
    
    // Only set the hint timer if we're actually in idle
    if (currentState.value === 'idle') {
        idleHintTimeout = setTimeout(() => {
            // Trigger the pointer animation
            currentState.value = 'idle_hint'
            
            // Revert back to idle after 2.5 seconds
            setTimeout(() => {
                if (currentState.value === 'idle_hint') {
                    currentState.value = 'idle'
                    resetIdleHintTimer() // start counting again
                }
            }, 2500)
        }, 6000) // 6 seconds of inactivity
    }
}

// Mock the SpeechSynthesis API for the voice reply
// Store the dynamic reply text
const dynamicSpeechLine = ref("I am a simulated voice reply. There is no logic here.")

// Speech Recognition Reference
let recognition: any = null

const handleAction = () => {
  if (currentState.value === 'idle' || currentState.value === 'idle_hint') {
    startListening()
  } else if (isSpeaking.value) {
    // allow interrupt
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    currentState.value = 'idle'
    resetIdleHintTimer()
  }
}

const startListening = () => {
  // Check for browser support
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  
  if (!SpeechRecognition) {
      alert("Speech Recognition API is not supported in this browser. Please try Chrome, Edge, or Safari.")
      return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.interimResults = false // only wait for the final string
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
      currentState.value = 'listening'
      if (idleHintTimeout) clearTimeout(idleHintTimeout) // kill idle hint
  }

  recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase()
      currentState.value = 'processing'
      
      // Give a tiny beat for the "processing" swirl before answering
      setTimeout(() => {
          routeKeyword(transcript)
      }, 1500)
  }

  recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error)
      // On error (like mic blocked) fallback to idle
      currentState.value = 'idle'
  }

  recognition.onend = () => {
      // If we stopped listening but aren't processing a result, go back to idle
      if (currentState.value === 'listening') {
          currentState.value = 'idle'
          resetIdleHintTimer()
      }
  }

  recognition.start()
}

const handleManualSubmit = () => {
    if (!manualInputText.value.trim()) {
        isTyping.value = false
        return
    }
    
    // Simulate processing phase
    currentState.value = 'processing'
    isTyping.value = false
    
    // Slight delay to feel natural before firing the keyword route
    setTimeout(() => {
        routeKeyword(manualInputText.value.toLowerCase())
        manualInputText.value = ""
    }, 1000)
}

const routeKeyword = (transcript: string) => {
    // We pass the intended shape to the speakLine so that when speech ends,
    // the system knows to go to 'idle' instead of leaving the shape
    if (transcript.includes('how do i get to') || transcript.includes('directions to')) {
        currentState.value = 'navigating'
        dynamicSpeechLine.value = "Go straight and turn right in 500 metres."
    } else if (transcript.includes('omelette') || transcript.includes('cook') || transcript.includes('recipe')) {
        currentState.value = 'cooking'
        dynamicSpeechLine.value = "Crack and whisk an egg, then add it to a pan for 2 minutes."
    } else if (transcript.includes('book me flights') || transcript.includes('book a flight')) {
        currentState.value = 'booking'
        dynamicSpeechLine.value = "Should I book you a flight on the Saturday, 7 p.m.?"
    } else {
        currentState.value = 'confused'
        dynamicSpeechLine.value = "I am sorry, I cannot understand that."
    }
    
    // Give the particles time to form the SVG shape, then speak
    setTimeout(() => {
        isSpeaking.value = true
        speakLine()
    }, 2000)
}

const speakLine = () => {
  const synth = window.speechSynthesis
  if (!synth) {
    // Fallback if not supported
    setTimeout(() => {
      currentState.value = 'idle'
    }, 4000)
    return
  }
  
  const utterance = new SpeechSynthesisUtterance(dynamicSpeechLine.value)
  
  // try to find a nice English voice
  const voices = synth.getVoices()
  
  // First, filter to ensure it's an English voice (prevents random French/foreign accents)
  const englishVoices = voices.filter(v => v.lang.startsWith('en-'))
  
  // Then prefer Google, Siri, or 'Female' labeled voices if available
  const preferredVoice = englishVoices.find(v => 
    v.name.includes('Google') || 
    v.name.includes('Siri') || 
    v.name.includes('Female')
  ) || englishVoices[0] // Fallback to the first available English voice

  if (preferredVoice) utterance.voice = preferredVoice
  
  utterance.onend = () => {
    isSpeaking.value = false
    currentState.value = 'idle'
    resetIdleHintTimer()
  }
  
  // Optional: when the voice ends, we could return to idle.
  // For now, let it return to idle after speech completes.
  synth.speak(utterance)
}

// SVG Path parsing
// A few example paths for different custom states (scaled around a 24x24 viewport, will be rescaled to canvas)
const SVG_PATHS = {
    car: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M15 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0', // Lucide Car
    question: 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01', // Lucide Circle Help (inner)
    chefHat: 'M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z M6 17h12', // Lucide Chef Hat
    plane: 'M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 9l8.1 4.5L6 18l-3-1-2 2 5 2 2 5 2-2-1-3 4.5-4.6 4.5 8.1c.3.5.8.5 1.2.3l2.2-1.2c.4-.2.6-.7.5-1.2z', // Lucide Plane
    pointer: 'M18.84 15.87l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13V7.5c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.04.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z' // Material Touch App (Hand only)
}
let svgPointsCache: Record<string, {x: number, y: number}[]> = {}

const getPointsFromPath = (pathString: string, count: number): {x: number, y: number}[] => {
    if (svgPointsCache[pathString] && svgPointsCache[pathString].length === count) {
        return svgPointsCache[pathString];
    }
    
    const svgNS = "http://www.w3.org/2000/svg"
    // Split the path into subpaths by 'M' or 'm' to ensure disconnected shapes (like dots or wheels)
    // are calculated separately, preventing them from being skipped by path length logic.
    const subpaths = pathString.match(/[Mm][^Mm]*/g) || [pathString]
    
    const pathsData = subpaths.map(chunk => {
        const el = document.createElementNS(svgNS, "path")
        el.setAttribute('d', chunk.trim())
        try {
            const realLength = el.getTotalLength()
            // Give 0-length subpaths (like period dots) an artificial length of 15 so they get particles allocated
            return { el, length: Math.max(realLength, 15), realLength }
        } catch(e) {
            return { el, length: 15, realLength: 0 }
        }
    })
    
    // Total aggregate length
    const totalLength = pathsData.reduce((sum, p) => sum + p.length, 0)
    const points: {x: number, y: number}[] = []
    
    pathsData.forEach(p => {
        // Distribute particle allowance based on relative subpath length
        const subCount = Math.floor((p.length / totalLength) * count)
        for(let i=0; i<subCount; i++) {
            // Space dots evenly across the exact pixel length
            const fraction = subCount > 1 ? (i / (subCount - 1)) : 0
            const pt = p.el.getPointAtLength(fraction * p.realLength)
            points.push({x: pt.x, y: pt.y})
        }
    })
    
    // Fill remaining caused by flooring fraction
    while(points.length < count) {
        points.push(points[points.length-1] || {x: 12, y: 12})
    }
    
    const finalPoints = points.slice(0, count)
    svgPointsCache[pathString] = finalPoints
    return finalPoints
}

// Particle System for "Ethereal Braille Marks"
class Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  angle: number
  speed: number
  offset: number
  distance: number
  color: string
  targetX: number
  targetY: number

  constructor(width: number, height: number) {
    this.x = Math.random() * width
    this.y = Math.random() * height
    this.baseX = this.x
    this.baseY = this.y
    this.targetX = this.x
    this.targetY = this.y
    this.size = Math.random() * 2 + 1 // "braille marks"
    this.angle = Math.random() * Math.PI * 2
    this.speed = Math.random() * 0.02 + 0.005
    this.offset = Math.random() * 100
    this.distance = Math.random() * 50 + 20
    this.color = 'rgba(255, 255, 255, 0.8)' // Will be overridden in render based on mode
  }

  update(state: ChatState, time: number, cx: number, cy: number, audioLevel: number) {
    // Determine target shape based on state and tighten constraints for SVG shapes
    const isStrictShape = state === 'navigating' || state === 'confused' || state === 'cooking' || state === 'booking' || state === 'idle_hint'
    // Crisp shapes get almost no wandering blur (1.5) compared to the default fluid blur (10)
    const wanderIntensity = isStrictShape ? 1.5 : 10
    
    // In all states, the particles are "alive" with some base noise/wandering
    const wanderX = Math.sin(time * 0.001 + this.offset) * wanderIntensity
    const wanderY = Math.cos(time * 0.001 + this.offset) * wanderIntensity
    
    // Determine target shape based on state
    if (state === 'idle') {
      // Gentle floating, drawn toward mouse if hovering
      const restX = this.baseX + Math.sin(time * 0.0005 + this.baseY * 0.01) * 30
      const restY = this.baseY + Math.cos(time * 0.0005 + this.baseX * 0.01) * 30
      
      if (isHovering.value) {
          // Gently pull towards mouse cursor (weak gravity)
          const dx = mouseX.value - restX
          const dy = mouseY.value - restY
          const dist = Math.sqrt(dx*dx + dy*dy)
          // The farther away, the weaker the pull (max pull radius ~250px)
          const pull = Math.max(0, 1 - dist/250) * 0.6 // Increased pull strength
          this.targetX = restX + dx * pull
          this.targetY = restY + dy * pull
      } else {
          this.targetX = restX
          this.targetY = restY
      }
      
    } else if (state === 'listening') {
      // Pull together to form a listening ring, reacting to simulated mic input (audioLevel)
      const radius = 80 + audioLevel * 20 + Math.sin(time*0.005 + this.offset)*5
      this.targetX = cx + Math.cos(this.angle) * radius
      this.targetY = cy + Math.sin(this.angle) * radius
      this.angle += this.speed * 2
      
    } else if (state === 'processing') {
      // Swirling infinity symbol / vortex
      const t = time * 0.001 + this.offset * 0.1
      const scale = 60
      // Lemniscate of Bernoulli
      this.targetX = cx + (scale * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)) * 1.5
      this.targetY = cy + (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) * Math.sin(t)) * 1.5
      
    } else if (state === 'speaking') {
      // Soundwaves / horizontal bands
      const bandY = cy + (Math.sin(this.angle) * 60)
      const waveAmplitude = audioLevel * 30 + 10
      this.targetX = cx + (this.baseX - cx) * 0.5 + Math.sin(time * 0.005 + bandY * 0.05) * waveAmplitude
      this.targetY = bandY
      this.angle += this.speed
      
    } else if (state === 'navigating' || state === 'confused' || state === 'cooking' || state === 'booking' || state === 'idle_hint') {
       // Grab the precomputed SVG points
       let pathStr = SVG_PATHS.question
       if (state === 'navigating') pathStr = SVG_PATHS.car
       if (state === 'cooking') pathStr = SVG_PATHS.chefHat
       if (state === 'booking') pathStr = SVG_PATHS.plane
       if (state === 'idle_hint') pathStr = SVG_PATHS.pointer
       
       // We'll use the particle's tracking offset (which we multiply to expand its range) mapped to the point count
       // so the stars distribute across the entire length of the path.
       const pts = getPointsFromPath(pathStr, 800) // Much higher resolution cache pool
       const idx = Math.floor(this.offset * 100) % pts.length
       let pt = pts[idx]
       
       // SVG is usually 24x24 box. We need to center and scale it up.
       let scale = 5
       
       // Add a "clicking" animation bounce if it's the idle hint
       let clickBounceY = 0
       let clickBounceX = 0
       if (state === 'idle_hint') {
           // Smooth tapping animation (Hand Pointer)
           const tapPhase = (time * 0.003) % (Math.PI * 2)
           if (tapPhase > Math.PI * 1.8) {
               // Subtly press down into the screen (simulating a tap)
               scale = 4.7
               clickBounceY = 2 
               clickBounceX = 0
           } else {
               // Hovering gracefully
               scale = 5
               clickBounceY = Math.sin(time * 0.006) * -4
           }
       }
       
       this.targetX = cx + (pt.x - 12) * scale + clickBounceX
       this.targetY = cy + (pt.y - 12) * scale + clickBounceY
    }

    // Add the wander noise to the target
    const finalTargetX = this.targetX + wanderX
    const finalTargetY = this.targetY + wanderY

    // Fluid ease towards target
    // Mouse hover uses a very slow ease so it feels "gentle", shapes use faster ease
    const ease = (state === 'idle' && isHovering.value) ? 0.015 : 0.05
    this.x += (finalTargetX - this.x) * ease
    this.y += (finalTargetY - this.y) * ease
  }

  draw(ctx: CanvasRenderingContext2D, audioLevel: number, state: ChatState, time: number) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size + (audioLevel * 0.1), 0, Math.PI * 2)
    
    // Choose color based on state and theme
    let r, g, b, a;
    
    // Twinkling effect: oscillate global opacity for this specific particle
    const twinkle = Math.sin(time * 0.005 + this.offset) * 0.3 + 0.7 // bounds 0.4 -> 1.0

    if (state === 'listening') {
       r = 0; g = 240; b = 255; a = (0.5 + audioLevel * 0.2) * twinkle;
    } else if (state === 'processing' || state === 'confused') {
       r = 180; g = 100; b = 255; a = (0.6 + audioLevel * 0.05) * twinkle;
    } else if (state === 'navigating') {
       r = 100; g = 255; b = 150; a = (0.8 + audioLevel * 0.05) * twinkle;
    } else if (state === 'cooking') {
       // Warm orange/yellow for cooking
       r = 255; g = 180; b = 0; a = (0.8 + audioLevel * 0.05) * twinkle;
    } else if (state === 'booking') {
       // Deep sky blue for flying
       r = 60; g = 120; b = 255; a = (0.8 + audioLevel * 0.05) * twinkle;
    } else if (state === 'idle_hint') {
       // A soft pulsing cyan for the hint
       const pulse = Math.sin(time * 0.005) * 0.2 + 0.8;
       r = 40; g = 200; b = 255; a = pulse * twinkle;
    } else {
       // Idle color - forced dark mode look
       r = 160; g = 170; b = 180; a = 0.4 * twinkle;
    }
    
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    // Add a skeumorphic shadow to each dot to make them feel extruded
    ctx.shadowColor = 'rgba(0,0,0,0.8)' // forced dark mode shadow
    ctx.shadowBlur = 2
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1
    ctx.fill()
    ctx.closePath()
    
    // Reset shadow so it doesn't build up
    ctx.shadowColor = 'transparent'
  }
}

let particles: Particle[] = []

const initParticles = (width: number, height: number) => {
  particles = []
  const count = window.innerWidth < 768 ? 400 : 800 // Crisp resolution bounds
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(width, height))
  }
}

const renderCanvas = (time: number) => {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // Clear with transparent so the CSS background shows through
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const cx = canvas.width / 2
  const cy = canvas.height / 2
  
  // Create a simulated audio level that bounces
  let audioLevel = 0
  if (displayState.value === 'listening' || isSpeaking.value) {
      // smooth random noise for audio level
      audioLevel = (Math.sin(time * 0.01) * 0.5 + 0.5) * (Math.random() * 0.5 + 0.5) * 20
  }

  particles.forEach(p => {
    p.update(displayState.value, time, cx, cy, audioLevel)
    p.draw(ctx, audioLevel, displayState.value, time)
  })

  animationFrameId = requestAnimationFrame(renderCanvas)
}

const resizeCanvas = () => {
    isMobile.value = window.innerWidth < 768
    if(!canvasRef.value) return
    const container = canvasRef.value.parentElement
    if(container) {
        // If the window is resized, the component might squash. 
        // We only want to ensure the canvas identically matches the orb boundaries.
        canvasRef.value.width = container.clientWidth
        canvasRef.value.height = container.clientHeight
        
        // Only re-init particles if we haven't already or the aspect ratio drastically changed 
        // to prevent constant resets on mobile scrollbars hiding/showing
        if (particles.length === 0) {
            initParticles(canvasRef.value.width, canvasRef.value.height)
        }
    }
}

const handleMouseMove = (e: MouseEvent) => {
    if(!canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()
    mouseX.value = e.clientX - rect.left
    mouseY.value = e.clientY - rect.top
    
    // reset hint 
    if (currentState.value === 'idle' || currentState.value === 'idle_hint') {
        if (currentState.value === 'idle_hint') currentState.value = 'idle'
        resetIdleHintTimer()
    }
}

const triggerNudge = (text: string) => {
    isTyping.value = true
    manualInputText.value = text
    resetIdleHintTimer()
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  resizeCanvas() // Initial size setup
  animationFrameId = requestAnimationFrame(renderCanvas)
  resetIdleHintTimer()
  
  // prime voices
  if(window.speechSynthesis) {
     window.speechSynthesis.getVoices()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  cancelAnimationFrame(animationFrameId)
  if(window.speechSynthesis) window.speechSynthesis.cancel()
  if(recognition) recognition.stop()
})
</script>

<template>
  <div class="voice-component-inner relative flex flex-col justify-between p-4 sm:p-6 w-full h-full min-h-[480px] overflow-y-auto no-scrollbar">
    
    <!-- Top Row: Suggested Nudges -->
    <div class="w-full flex justify-center gap-3 z-20 shrink-0 opacity-0 animate-[fadeIn_0.5s_ease_0.5s_forwards] pointer-events-auto">
      <button @click="triggerNudge('How do I make an omelette?')" class="neo-btn px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all hover:text-cyan-500">
        🍳 Omelette
      </button>
      <button @click="triggerNudge('Book flights')" class="neo-btn px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all hover:text-cyan-500">
        ✈️ Flights
      </button>
    </div>

    <!-- Center flex-1 Container to hold Orb -->
    <div class="flex-1 flex flex-col items-center justify-center w-full z-10 py-2 sm:py-4">
        <!-- The Neumorphic Central Container -->
        <div 
          class="neumorphic-orb relative rounded-full flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] shrink-0"
          :class="[
            displayState !== 'idle' ? 'active-inset scale-95' : 'idle-outset scale-100',
            'w-56 h-56 md:w-72 md:h-72'
          ]"
          @click="handleAction"
          @mouseenter="isHovering = true"
           @mouseleave="isHovering = false"
          @mousemove="handleMouseMove"
          role="button"
          :aria-label="(displayState === 'idle' || displayState === 'idle_hint') ? 'Start listening' : 'Stop interaction'"
        >
          <!-- Canvas for the floating braille marks -->
          <canvas 
            ref="canvasRef" 
            class="absolute inset-x-0 inset-y-0 w-full h-full rounded-full z-10 pointer-events-none"
          ></canvas>

          <!-- Inner glow for active states -->
          <div 
            class="absolute inset-x-0 inset-y-0 rounded-full transition-opacity duration-1000 mix-blend-screen"
            :class="{
                'opacity-0': displayState === 'idle' || displayState === 'idle_hint',
                'opacity-40 bg-cyan-400/20 blur-xl': displayState === 'listening',
                'opacity-50 bg-fuchsia-400/20 blur-xl': displayState === 'processing',
                'opacity-60 bg-cyan-300/30 blur-2xl': displayState === 'speaking'
            }"
          ></div>
        </div>
        
        <!-- Status Text -->
        <div class="mt-6 md:mt-8 h-8 text-center flex flex-col items-center justify-center">
            <p class="font-sans text-xs tracking-[0.2em] uppercase font-bold transition-all duration-500"
               :class="(displayState === 'idle' || displayState === 'idle_hint') ? 'opacity-30' : 'opacity-100 text-cyan-500 drop-shadow-md scale-105'">
                <span v-if="displayState === 'idle' || displayState === 'idle_hint'">
                    {{ isMobile ? 'Tap to awaken me' : 'Click to awaken me' }}
                </span>
                <span v-else>
                    {{ displayState }}
                </span>
            </p>
        </div>
    </div>

    <!-- Bottom Action Bar -->
    <div class="w-full flex items-center justify-between z-20 shrink-0 gap-4 pointer-events-auto pb-2">
        <!-- Left FAB (+) -->
        <button class="neo-btn shrink-0 w-12 h-12 rounded-full flex items-center justify-center group hover:text-cyan-500 transition-colors" aria-label="Add new">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-90"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
        
        <!-- Center Keyboard Fallback -->
        <div class="flex-1 max-w-[240px] flex justify-center min-h-[44px]">
            <transition name="fade" mode="out-in">
                <button 
                    v-if="(displayState === 'idle' || displayState === 'idle_hint') && !isTyping"
                    @click="isTyping = true; resetIdleHintTimer()"
                    class="neo-btn rounded-full px-6 py-2 text-[10px] font-sans uppercase tracking-[0.15em] font-semibold opacity-70 hover:opacity-100 transition-all w-full"
                >
                    Use text instead
                </button>
                
                <form v-else-if="isTyping" @submit.prevent="handleManualSubmit" class="flex items-center gap-2 w-full">
                    <input 
                        type="text" 
                        v-model="manualInputText"
                        placeholder="Type..."
                        class="neo-input flex-1 rounded-full px-4 py-2 text-sm font-sans focus:outline-none placeholder-gray-400 dark:placeholder-gray-500 transition-all focus:ring-2 focus:ring-cyan-500/20 w-full"
                        autofocus
                    />
                    <button 
                        type="submit" 
                        class="neo-btn shrink-0 rounded-full w-10 h-10 flex items-center justify-center transition-all group hover:text-cyan-500"
                        aria-label="Send text command"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="translate-x-[1px] group-hover:scale-110 transition-transform">
                            <path d="m22 2-7 20-4-9-9-4Z"/>
                            <path d="M22 2 11 13"/>
                        </svg>
                    </button>
                </form>
            </transition>
        </div>

        <!-- Right FAB (Settings) -->
        <button class="neo-btn shrink-0 w-12 h-12 rounded-full flex items-center justify-center group hover:text-cyan-500 transition-colors" aria-label="Settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:rotate-45"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
    </div>
  </div>
</template>

<style scoped>
.voice-component-inner {
    /* Ensure the component blends into the parent's neumorphic background */
    background: transparent;
}

.neumorphic-orb {
    /* Inherit the neumorphic background color from the root variables we defined in the wrapper */
    background-color: var(--neo-bg);
    cursor: pointer;
    /* Prevent highlight on mobile tap */
    -webkit-tap-highlight-color: transparent;
}

/* OUTSET SHADOW (Idle) */
.idle-outset {
    box-shadow: 
        -12px -12px 24px var(--neo-shadow-light),
        12px 12px 24px var(--neo-shadow-dark);
}

.idle-outset:hover {
    box-shadow: 
        -16px -16px 32px var(--neo-shadow-light),
        16px 16px 32px var(--neo-shadow-dark);
}

/* INSET SHADOW (Active/Listening/Processing/Speaking) */
.active-inset {
    box-shadow: 
        inset -8px -8px 16px var(--neo-shadow-light),
        inset 8px 8px 16px var(--neo-shadow-dark);
}

/* Form Input (Inset Neumorphic) */
.neo-input {
    background-color: var(--neo-bg);
    color: var(--neo-text);
    box-shadow: 
        inset -4px -4px 8px var(--neo-shadow-light),
        inset 4px 4px 8px var(--neo-shadow-dark);
    border: 1px solid transparent;
}

/* Secondary Button (Outset Neumorphic) */
.neo-btn {
    background-color: var(--neo-bg);
    color: var(--neo-text);
    box-shadow: 
        -4px -4px 10px var(--neo-shadow-light),
        4px 4px 10px var(--neo-shadow-dark);
}

.neo-btn:hover {
    box-shadow: 
        -6px -6px 14px var(--neo-shadow-light),
        6px 6px 14px var(--neo-shadow-dark);
}

.neo-btn:active {
    box-shadow: 
        inset -2px -2px 5px var(--neo-shadow-light),
        inset 2px 2px 5px var(--neo-shadow-dark);
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
