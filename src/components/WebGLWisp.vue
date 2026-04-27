<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { wispState } from '../composables/wispState';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let renderer: THREE.WebGLRenderer;
let material: THREE.ShaderMaterial;
let plane: THREE.Mesh;
let animationFrameId: number;

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

      varying vec2 vUv;

      float getT() { return floor(u_time * 12.0) / 12.0; }
      
      float hash(vec2 p) { 
          p = fract(p * vec2(123.34, 456.21)); 
          p += dot(p, p + 45.32); 
          return fract(p.x * p.y); 
      }
      
      float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          float a = hash(i); float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0)); float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      
      float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 4; i++) { 
              v += a * noise(p); 
              p *= 2.2; 
              a *= 0.5; 
          }
          return v;
      }
      
      float sdLine(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a, ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
      }

      void main() {
          if (u_hoverIntensity < 0.01) {
              gl_FragColor = vec4(0.0);
              return;
          }

          // 1. COORDINATE SYSTEM
          // We have a full-screen canvas. We need to map coordinates so they match the reference's local canvas behavior.
          vec2 pixelCoords = vUv * u_resolution;
          vec2 centerScreen = vec2(u_position.x + u_size.x * 0.5, (u_resolution.y - u_position.y) - u_size.y * 0.5);
          vec2 offset = pixelCoords - centerScreen;
          
          // In the reference, the canvas was button size + 200px padding.
          float virtualCanvasHeight = u_size.y + 200.0;
          
          // Normalize so that 1.0 = half the virtual canvas height (matches uv = vUv * 2.0 - 1.0)
          vec2 uv = offset / (virtualCanvasHeight * 0.5);
          
          float t = getT();

          // 2. THE EXTENSION LOGIC (Adapted from reference)
          // Calculate base button diagonal in UV units
          vec2 bSize = u_size / virtualCanvasHeight; 
          
          // Pushing the anchor points 25% further than the actual corners, animating on hover
          float extension = 1.25 * mix(0.5, 1.0, u_hoverIntensity); 
          vec2 pA = vec2(-bSize.x * 0.5, -bSize.y * 0.5) * extension;
          vec2 pB = vec2(bSize.x * 0.5, bSize.y * 0.5) * extension;

          vec2 pa = uv - pA, ba = pB - pA;
          float progress = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);

          // Warp increases as it moves toward the 'trail' (top-right)
          float warpScale = mix(0.3, 1.4, progress) * u_hoverIntensity; 
          vec2 warp = vec2(
              fbm(uv * 1.1 + vec2(t * 0.8, t * 0.2 + u_seed)),
              fbm(uv * 1.4 - vec2(t * 0.4, t * 0.6 - u_seed))
          );
          
          vec2 distortedUv = uv + (warp - 0.5) * warpScale;
          float d = sdLine(distortedUv, pA, pB);

          // 3. FRESH GREEN COLOR (From reference)
          vec3 freshSpectral = vec3(0.3, 1.0, 0.6); 
          
          // Sharpened edge without the wide smoky halo
          float core = 1.0 - smoothstep(0.12, 0.15, d);

          // Blend alpha and color
          float finalAlpha = core * u_hoverIntensity;
          vec3 finalColor = mix(freshSpectral * 0.8, freshSpectral * 1.5, progress);
          
          gl_FragColor = vec4(finalColor, finalAlpha);
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
  renderer.setPixelRatio(window.devicePixelRatio);
  
  const updateSize = () => {
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
      u_seed: { value: 0.0 }
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

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    
    material.uniforms.u_time.value = clock.getElapsedTime();
    
    // Determine a unique ID for the current hovered element (using href or just identity)
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

  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', () => {});
  renderer.dispose();
  material.dispose();
});
</script>

<template>
  <canvas ref="canvasRef" class="wisp-canvas"></canvas>
</template>

<style scoped>
.wisp-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 45; /* Below Nav ledge (50) but above page content */
}
</style>
