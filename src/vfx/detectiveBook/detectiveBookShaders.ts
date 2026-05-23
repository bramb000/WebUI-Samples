/** Page bend — still updated per frame while turning. */
export const DETECTIVE_BOOK_VERTEX = /* glsl */ `
  varying vec2 vUv;
  uniform float uBendIntensity;
  uniform float uPageWidth;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float PI = 3.14159265359;
    float normalizedX = pos.x / uPageWidth;
    float bend = sin(normalizedX * PI) * 60.0 * uBendIntensity;
    pos.z -= bend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

/** Baked parchment + typography sampled from canvas (no live rim shader). */
export const DETECTIVE_BOOK_PAGE_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D tPage;

  void main() {
    vec4 col = texture2D(tPage, vUv);
    if (col.a < 0.08) discard;
    gl_FragColor = col;
  }
`

/**
 * Frozen chisel parchment — baked once to canvas, not used per-frame.
 * All u_time terms removed (equivalent to t = 0).
 */
export const DETECTIVE_BOOK_PARCHMENT_BAKE_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;
  uniform float u_aspect;
  uniform vec3 u_parchmentRgb;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(in vec2 p) {
    const float K1 = 0.366025404;
    const float K2 = 0.211324865;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    float m = step(a.y, a.x);
    vec2 o = vec2(m, 1.0 - m);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  float fbm(vec2 p) {
    float f = 0.0;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    float amp = 0.5;
    for (int i = 0; i < 4; ++i) {
      f += amp * noise(p);
      p = rot * p * 2.0;
      amp *= 0.5;
    }
    return f;
  }

  float angularCuts(vec2 p, float density, float chaos) {
    vec2 q = p * density;
    float wave1 = abs(fract(q.x * 0.8 + q.y * 1.2 + chaos * 0.5) - 0.5);
    float wave2 = abs(fract(q.x * -1.5 + q.y * 0.7 - chaos * 0.3) - 0.5);
    float wave3 = abs(fract(q.x * 1.1 - q.y * 1.9 + chaos * 0.8) - 0.5);
    float shards = (wave1 * wave2 * 4.0) + (wave3 * 0.5);
    float mask = smoothstep(0.1, 0.4, noise(p * 3.0));
    return shards * mask;
  }

  float sdBox(in vec2 p, in vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= u_aspect;

    vec2 u_innerHalf = vec2(u_aspect * 0.95, 0.95);
    float u_borderWidth = 0.04;
    float u_outerOrganicAmp = 0.06;

    float dBox = sdBox(p, u_innerHalf);
    float rim = abs(dBox) - u_borderWidth;
    float dOut = max(0.0, dBox);

    float outerBand = smoothstep(u_borderWidth * 0.15, u_borderWidth * 2.8, dOut);
    float outerFall = 1.0 - smoothstep(u_borderWidth * 3.2, u_borderWidth * 10.0, dOut);
    float outerMask = outerBand * outerFall;

    float organic = fbm(p * 4.8 + fbm(p * 1.35)) * u_outerOrganicAmp;
    organic += fbm(p * 11.3) * (u_outerOrganicAmp * 0.42) * outerMask;
    float baseDist = rim - organic * outerMask;

    float cuts = angularCuts(p, 8.0, 1.0) * 0.02 * (1.0 - outerMask * 0.88);
    float micro = fbm(p * 4.0) * 0.01 * (1.0 - outerMask * 0.75);
    float dFinal = baseDist + cuts + micro;

    vec3 finalColor = u_parchmentRgb;
    float grain = fbm(p * 9.5) * 0.035;
    finalColor *= 1.0 - grain;

    float borderAlpha = 1.0 - smoothstep(0.0, 0.01, dFinal);
    float fillAlpha = 1.0 - smoothstep(0.0, 0.01, dBox);
    float pageAlpha = max(fillAlpha, borderAlpha);

    gl_FragColor = vec4(finalColor, pageAlpha);
  }
`

export const PARCHMENT_BAKE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
