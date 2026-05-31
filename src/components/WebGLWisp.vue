<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { captureVfxRenderStatus } from '../analytics';
import { wispState } from '../composables/wispState';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let material: THREE.ShaderMaterial;
let plane: THREE.Mesh;
let animationFrameId: number;
let onVisibilityChange: (() => void) | null = null;
let updateSize: (() => void) | null = null;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_position;
      uniform vec2 u_size;
      uniform float u_hoverIntensity;
      uniform float u_clickIntensity;
      uniform float u_seed;

      // Comic Flame Parameters
      uniform float u_sharpness;
      uniform float u_outline;
      uniform float u_taper;
      uniform float u_complexity;
      uniform float u_distortion;
      uniform float u_speed;
      
      uniform vec2 u_offset;
      uniform vec2 u_qbc_p1;
      uniform vec2 u_qbc_p2;
      uniform vec3 u_outline_color;

      varying vec2 vUv;

      float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      float noise(in vec2 x) {
          vec2 i = floor(x);
          vec2 f = fract(x);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          float frequency = u_complexity;
          for (int i = 0; i < 4; i++) {
              value += amplitude * noise(p * frequency);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void main() {
          if (u_hoverIntensity < 0.01) {
              gl_FragColor = vec4(0.0);
              return;
          }

          // 1. COORDINATE SYSTEM MAPPING
          vec2 pixelCoords = vUv * u_resolution;
          vec2 centerScreen = vec2(u_position.x + u_size.x * 0.5, (u_resolution.y - u_position.y) - u_size.y * 0.5);
          vec2 offset = pixelCoords - centerScreen;
          
          // CRITICAL FIX: Absolute Noise Scale + Proportional Mask
          // To ensure the "parameters" (complexity, chunkiness, thresholds) look identical to the codepen,
          // the noise coordinates (st) MUST map to absolute pixels, not relative UVs.
          // If st scales with the button, smaller buttons get "zoomed out" high-frequency noise that 
          // gets completely eaten by the u_sharpness threshold, leaving only a tiny puddle!
          
          // 1. Calculate a virtual canvas that is strictly proportional to the button size.
          // By removing the forced 2.4 Aspect Ratio, we ensure the mask gradients (the taper, the belly) 
          // map to the exact same relative positions on EVERY button, making the flame shape perfectly consistent.
          // Wide buttons won't get a massive vertical belly, and narrow buttons won't get squished.
          float vWidth = u_size.x * 1.8;
          float vHeight = u_size.y * 2.5;
          vec2 virtualSize = vec2(vWidth, vHeight);
          
          // 2. Base relative coordinates
          vec2 uv = (offset / virtualSize) + vec2(0.5);
          
          // 3. Apply QBC Flow Warping to the UV coordinates
          float t = uv.x;
          vec2 qbc_bend = 2.0 * (1.0 - t) * t * u_qbc_p1 + (t * t) * u_qbc_p2;
          
          vec2 warpedUv = uv - u_offset - qbc_bend;
          vec2 warpedCentered = warpedUv - vec2(0.5);
          
          // 4. Uniform Proportional Noise Scaling
          // To ensure the flame has the identical level of detail (chunkiness) on small buttons without squishing:
          // We lock the vertical noise to exactly 2.0 cycles across the virtual height.
          // We then scale the horizontal noise proportionally to maintain the codepen's exact 1.2 noise aspect ratio.
          vec2 st = vec2(
              (warpedCentered.x * vWidth) / (vHeight * 0.6) + 2.0,
              (warpedCentered.y * 2.0) + 1.0
          );
          
          vec2 scroll = vec2(u_time * u_speed, 0.0);
          
          // Organic distortion
          float distNoise = fbm(st + scroll * 0.5);
          vec2 distortedSt = st - scroll + vec2(distNoise * u_distortion);
          
          float n = fbm(distortedSt);
          
          // Exact taper logic
          float maskY = smoothstep(0.4, 0.0, abs(warpedCentered.y + 0.05)); 
          float maskX = smoothstep(-0.4, -0.2, warpedCentered.x) * smoothstep(0.5, 0.5 - u_taper, warpedCentered.x);
          float mask = maskY * maskX;
          
          // Map component uniform
          float u_hover = u_hoverIntensity;
          
          float flame = n * mask * (u_hover * 2.5);
          
          // Sparks logic
          float sparkNoise = fbm((st - scroll * 1.2) * 2.0);
          float sparks = sparkNoise * mask * (u_hover * 1.8);
          
          // Outer edge for black outline
          float outerEdge = step(u_sharpness - u_outline, max(flame, sparks));
          
          // Inner edge for green fill
          float innerEdge = step(u_sharpness, max(flame, sparks));
          
          vec3 fillColor = vec3(0.3, 0.85, 0.52);     
          
          vec3 finalColor = mix(u_outline_color, fillColor, innerEdge);
          float alpha = outerEdge * smoothstep(0.0, 0.1, u_hover);

          gl_FragColor = vec4(finalColor, alpha);
      }
    `;

onMounted(() => {
  if (!canvasRef.value) return;

  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvasRef.value, 
    alpha: true,
    premultipliedAlpha: false,
    antialias: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
  
  updateSize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    if (material) {
      material.uniforms.u_resolution.value.set(width, height);
    }
  };
  
  window.addEventListener('resize', updateSize);
  
  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_position: { value: new THREE.Vector2(0, 0) },
      u_size: { value: new THREE.Vector2(0, 0) },
      u_hoverIntensity: { value: 0.0 },
      u_clickIntensity: { value: 0.0 },
      u_seed: { value: 0.0 },
      // Comic Flame Parameters (User provided values)
      u_sharpness: { value: 0.45 },
      u_outline: { value: 0.11 },
      u_taper: { value: 0.81 },
      u_complexity: { value: 2.40 },
      u_distortion: { value: 0.60 },
      u_speed: { value: 0.90 },
      u_offset: { value: new THREE.Vector2(0.08, 0.06) },
      u_qbc_p1: { value: new THREE.Vector2(0.08, -0.09) },
      u_qbc_p2: { value: new THREE.Vector2(0.06, 0.14) },
      u_outline_color: { value: new THREE.Color('#18251c') }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  updateSize();

  const clock = new THREE.Clock();
  let lastHoveredId: string | null = null;
  let steppedTime = 0;
  let lastTime = 0;

  const animate = () => {
    if (document.hidden)
      return;
    animationFrameId = requestAnimationFrame(animate);

    // 24 FPS discrete time stepping for comic aesthetic
    const now = clock.getElapsedTime();
    if (now - lastTime > 1.0 / 24.0) {
      steppedTime += (1.0 / 24.0);
      lastTime = now;
    }
    
    material.uniforms.u_time.value = steppedTime;
    
    // Determine a unique ID for the current hovered element
    const currentHoverId = wispState.hoveredElement ? (wispState.hoveredElement as any).href || wispState.hoveredElement.innerText : null;
    
    // If we changed to a NEW button, instantly reset the visual opacity to 0
    if (currentHoverId !== lastHoveredId && wispState.hoverIntensity > 0) {
      material.uniforms.u_hoverIntensity.value = 0;
      lastHoveredId = currentHoverId;
    }
    
    if (wispState.hoverIntensity === 0 && !wispState.hoveredElement) {
       lastHoveredId = null;
    }
    
    if (wispState.hoverIntensity > 0) {
      // Snap instantly to the new button position so it spawns rather than translates
      material.uniforms.u_position.value.x = wispState.rect.x;
      material.uniforms.u_position.value.y = wispState.rect.y;
      material.uniforms.u_size.value.x = wispState.rect.width;
      material.uniforms.u_size.value.y = wispState.rect.height;
    }
    
    material.uniforms.u_hoverIntensity.value += (wispState.hoverIntensity - material.uniforms.u_hoverIntensity.value) * 0.15;
    material.uniforms.u_clickIntensity.value += (wispState.clickIntensity - material.uniforms.u_clickIntensity.value) * 0.2;
    wispState.clickIntensity *= 0.9;
    material.uniforms.u_seed.value = wispState.seed;

    renderer.render(scene, camera);
  };

  onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    }
    else if (!animationFrameId) {
      animate();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  animate();
  captureVfxRenderStatus('nav_wisp', { mode: 'webgl' });
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  if (onVisibilityChange)
    document.removeEventListener('visibilitychange', onVisibilityChange);
  if (updateSize)
    window.removeEventListener('resize', updateSize);
  plane?.geometry?.dispose();
  renderer.dispose();
  material.dispose();
});
</script>

<template>
  <Teleport to="body">
    <canvas ref="canvasRef" class="wisp-canvas" aria-hidden="true"></canvas>
  </Teleport>
</template>

<style scoped>
.wisp-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  /* Between nav ledge bg (40) and nav content (50). */
  z-index: 45;
}
</style>
