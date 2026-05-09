<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { flameState } from '../composables/flameState';

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

// Flame shader in screen-space, mapped to hovered card rect.
// Key differences from the "ugly" version:
// - Stable pixel scale (uses u_resolution + u_size).
// - Card occluder: we cut a rectangle out so flame reads as "behind" the card.
const fragmentShader = `
  precision highp float;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_position;
  uniform vec2 u_size;
  uniform float u_hover;
  uniform float u_seed;
  uniform vec2 u_anchorOffsetPx;

  uniform vec3 u_color;
  uniform float u_speed;

  uniform float u_baseX;
  uniform float u_baseY;
  uniform float u_curveBend;

  uniform float u_bulge;
  uniform float u_taper;
  uniform float u_maskFeather;

  uniform float u_threshold;
  uniform float u_coreFeather;

  uniform float u_wisp_amount;
  uniform float u_wispEdge;
  uniform float u_wispCurve;

  uniform float u_glowSpread;
  uniform float u_glowIntensity;

  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
      mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 4; i++) {
      f += amp * noise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return f;
  }

  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  void main() {
    if (u_hover < 0.01) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Pixel coords in screen space
    vec2 px = vUv * u_resolution;

    // Hovered card rect in screen space (top-left origin from DOM)
    // Convert to shader space where y=0 is bottom
    vec2 cardPos = vec2(u_position.x, u_resolution.y - (u_position.y + u_size.y));
    // Anchor near the card's bottom-center, slightly below the card
    // (matches demo "flame rises from beneath paper").
    // cardPos is bottom-left.
    vec2 anchor = cardPos + vec2(u_size.x * 0.55, -u_size.y * 0.18) + u_anchorOffsetPx;

    // Local coordinates relative to anchor
    vec2 local = px - anchor;

    // Virtual canvas around the card (demo: huge wrapper, lots of bleed)
    float vW = u_size.x * 4.0;
    float vH = u_size.y * 3.5;
    vec2 uv = (local / vec2(vW, vH)) + vec2(0.5);

    // Flame parameters in local UV space
    float localY = clamp(uv.y - u_baseY, 0.0, 1.0);
    float curveOffset = u_curveBend * 4.0 * localY * (1.0 - localY);
    vec2 warpedUv = vec2(uv.x - u_baseX - curveOffset, uv.y - u_baseY);

    // Aspect-correct x distance (divide, not multiply)
    float aspect = vW / vH;
    float xDist = abs(warpedUv.x - 0.5) * 2.0;
    xDist /= max(aspect, 0.001);

    float shapeWidth = sin(localY * 3.14159) * (u_bulge - localY * u_taper);
    float masterMask = smoothstep(shapeWidth, shapeWidth - u_maskFeather, xDist);

    float topFade = clamp(1.2 - localY, 0.0, 1.0);
    float bottomCutoff = smoothstep(-0.05, 0.03, warpedUv.y);
    masterMask *= topFade * bottomCutoff;

    vec2 scrolledUv = warpedUv + vec2(0.0, -u_time * u_speed);
    float n = fbm(scrolledUv * 5.0 + u_seed);
    float coreShape = n * masterMask;
    float coreAlpha = smoothstep(u_threshold, u_threshold + u_coreFeather, coreShape);

    vec2 wispUv = warpedUv + vec2(0.0, -u_time * (u_speed * 1.5));
    float wispNoise = fbm(wispUv * 9.0 + (u_seed * 0.7));
    float wispLifecycle = pow(sin(localY * 3.14159), u_wispCurve);
    float wispMask = smoothstep(shapeWidth + 0.15, shapeWidth + 0.15 - u_maskFeather, xDist) * bottomCutoff;
    float wispShape = (wispNoise * wispLifecycle) * wispMask;
    float wispAlpha = smoothstep(u_threshold + u_wisp_amount, u_threshold + u_wisp_amount + u_wispEdge, wispShape);

    float hardAlpha = max(coreAlpha, wispAlpha);

    float coreGlow = smoothstep(u_threshold - u_glowSpread, u_threshold, coreShape);
    float wGlow = smoothstep(u_threshold + u_wisp_amount - u_glowSpread, u_threshold + u_wisp_amount, wispShape);
    float auraAlpha = max(coreGlow, wGlow) * u_glowIntensity;

    float finalAlpha = clamp(hardAlpha + auraAlpha, 0.0, 1.0) * u_hover;

    float innerHeat = smoothstep(u_threshold + 0.05, u_threshold + 0.2, coreShape);
    vec3 hotColor = mix(u_color, vec3(1.0), innerHeat * 0.6);
    vec3 finalColor = mix(u_color, hotColor, hardAlpha);

    // Occluder cutout: remove pixels inside the hovered card rect (so flame reads "behind")
    vec2 cardCenter = cardPos + u_size * 0.5;
    vec2 localToCardCenter = px - cardCenter;
    vec2 cardHalf = u_size * 0.5;
    float d = sdBox(localToCardCenter, cardHalf);
    float cut = smoothstep(0.0, 8.0, d); // feathered edge (in pixels)
    finalAlpha *= cut;

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
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));

  const updateSize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    material.uniforms.u_resolution.value.set(w, h);
  };

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_position: { value: new THREE.Vector2(0, 0) },
      u_size: { value: new THREE.Vector2(0, 0) },
      u_hover: { value: 0.0 },
      u_seed: { value: 0.0 },
      // Fine-tune ignition point around the card lower-mid anchor (pixels in shader space)
      // -x = left, +y = up
      u_anchorOffsetPx: { value: new THREE.Vector2(-12, 6) },

      u_color: { value: new THREE.Color('#20ffb0') },
      u_speed: { value: 0.067 },

      u_baseX: { value: 0.0 },
      u_baseY: { value: 0.0 },
      u_curveBend: { value: 0.33 },

      u_bulge: { value: 0.9 },
      u_taper: { value: 1.22 },
      u_maskFeather: { value: 0.32 },

      u_threshold: { value: 0.26 },
      u_coreFeather: { value: 0.02 },

      u_wisp_amount: { value: 0.2 },
      u_wispCurve: { value: 3.0 },
      u_wispEdge: { value: 0.026 },

      u_glowSpread: { value: 0.18 },
      u_glowIntensity: { value: 0.45 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(plane);

  updateSize();
  window.addEventListener('resize', updateSize);

  let hoverSmoothed = 0;

  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);
    const wallSec = performance.now() / 1000;
    material.uniforms.u_time.value =
      flameState.hoverIntensity > 0 && flameState.hoveredElement
        ? wallSec - flameState.timeBase
        : 0;

    // Update hovered rect
    if (flameState.hoverIntensity > 0 && flameState.hoveredElement) {
      // Re-sample every frame so it stays local while scrolling/layout changes.
      const rect = flameState.hoveredElement.getBoundingClientRect();
      material.uniforms.u_position.value.set(rect.left, rect.top);
      material.uniforms.u_size.value.set(rect.width, rect.height);
      material.uniforms.u_seed.value = flameState.seed;
    }

    hoverSmoothed += (flameState.hoverIntensity - hoverSmoothed) * 0.15;
    material.uniforms.u_hover.value = hoverSmoothed;

    renderer.render(scene, camera);
  };

  animate();

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', updateSize);
    renderer.dispose();
    material.dispose();
  });
});
</script>

<template>
  <canvas ref="canvasRef" class="flame-canvas" />
</template>

<style scoped>
.flame-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9; /* demo: behind the hovered card */
  mix-blend-mode: screen;
  filter: drop-shadow(0px 0px 8px rgba(32, 255, 176, 0.4));
}
</style>

