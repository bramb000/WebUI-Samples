precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_isActive;
uniform vec3 u_color;
uniform vec3 u_textColor;
uniform float u_borderWidth;
uniform float u_wobble;
uniform float u_chiselDepth;
uniform float u_chiselDensity;
uniform float u_chiselChaos;
uniform float u_densityVar;
uniform float u_depthEffect;
uniform float u_hoverFlameState;
uniform float u_organicAmp;
uniform sampler2D u_textMask;

/* ——— Below: hash / noise / fbm / angularCuts / flame — identical to `src/vfx/chiselFrameOverlay.ts` CHISEL_FRAGMENT ——— */

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
  float mask = smoothstep(0.1, 0.4, noise(p * 3.0 + u_time * 0.05));
  return shards * mask;
}

/* ——— Bookmark geometry (TOC layout only; not in card shader) ——— */

float sdBookmarkHorizontal(vec2 p, vec2 b, float cutDepth) {
  vec2 d = abs(p) - b;
  float dBox = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  float by = max(b.y, 1e-4);
  float cutX = -b.x + cutDepth * (1.0 - abs(p.y) / by);
  float dCut = cutX - p.x;
  float slope = cutDepth / by;
  float len = sqrt(1.0 + slope * slope);
  dCut /= len;
  return max(dBox, dCut);
}

/*
 * Same displacement stack as chiselFrameOverlay `getBorderDistance`, but the base SDF is a solid
 * horizontal bookmark instead of `rim = abs(sdBox) - u_borderWidth`. We apply organic/cuts/micro
 * to `dBox` with the same outerMask / innerProtect / flame terms so chisel sliders match the card demo.
 */
float getBorderDistance(vec2 p, vec2 bookmarkHalf, float cutDepth) {
  float dBox = sdBookmarkHorizontal(p, bookmarkHalf, cutDepth);

  float dOut = max(0.0, dBox);
  float outerBand = smoothstep(u_borderWidth * 0.15, u_borderWidth * 2.8, dOut);
  float outerFall = 1.0 - smoothstep(u_borderWidth * 3.2, u_borderWidth * 10.0, dOut);
  float outerMask = outerBand * outerFall;

  float organic = fbm(p * 4.8 + u_time * 0.055 + fbm(p * 1.35 + u_time * 0.018)) * u_organicAmp;
  organic += fbm(p * 11.3 - vec2(0.0, u_time * 0.14)) * (u_organicAmp * 0.42) * outerMask;

  float baseDist = dBox - organic * outerMask;

  float innerProtect = 1.0 - outerMask * 0.88;
  float cuts = angularCuts(p, u_chiselDensity, u_chiselChaos) * u_chiselDepth * innerProtect;
  float micro = fbm(p * 4.0) * u_wobble * (1.0 - outerMask * 0.75);
  float chiseledDist = baseDist + cuts + micro;

  vec2 fireUV = p * 10.0;
  fireUV.y -= u_time * 4.0;
  float flameDistortion = fbm(fireUV) * 0.1 * u_hoverFlameState * (0.3 + outerMask * 0.7);
  float topBias = smoothstep(0.0, 0.8, p.y) * u_hoverFlameState;

  return chiseledDist - flameDistortion * topBias;
}

void main() {
  vec2 res = max(u_resolution, vec2(1.0));
  vec2 uv = gl_FragCoord.xy / res;

  vec2 p = uv * 2.0 - 1.0;
  p.x *= res.x / res.y;

  float aspect = res.x / max(res.y, 1.0);
  vec2 bookmarkHalf = vec2(aspect * 1.0, 1.0);
  float cutDepth = 0.15 * (bookmarkHalf.x / 0.7);

  float dFinal = getBorderDistance(p, bookmarkHalf, cutDepth);

  /* Paint pass: same as chiselFrameOverlay main() */
  float densityMap = fbm(p * 4.0);
  float paintThickness = smoothstep(-1.0, 1.0, densityMap);
  float alphaMult = mix(1.0, paintThickness + 0.3, u_densityVar);

  vec3 bgColor = u_color;
  vec3 flameColor = mix(u_color, vec3(1.0, 1.0, 1.0), 0.4);
  bgColor = mix(bgColor, flameColor, u_hoverFlameState * paintThickness);
  bgColor *= alphaMult;

  /*
   * Fixed-width smoothstep(0, 0.01, d) matches chiselFrameOverlay on large viewports, but on a short TOC
   * row (~40px) the same band spans fewer pixels and high-frequency chisel/FBM in dFinal aliases into
   * harsh single-pixel dither. Scale the silhouette ramp with fwidth(d) so AA tracks screen-space
   * gradient → rough but coherent edges like the reference.
   */
  float edgeW = max(1.35 * fwidth(dFinal), 1e-6);
  float bgAlpha = 1.0 - smoothstep(-edgeW, edgeW, dFinal);

  if (u_depthEffect > 0.0) {
    float edgeScale = 0.35 / max(bookmarkHalf.x, bookmarkHalf.y);
    float dLight = getBorderDistance(p + vec2(0.005, -0.005) * edgeScale, bookmarkHalf, cutDepth);
    float edgeDiff = (dFinal - dLight) * 20.0;
    float edgeMask = smoothstep(-0.03, 0.0, dFinal);
    float highlight = max(0.0, edgeDiff) * edgeMask;
    float selfShadow = max(0.0, -edgeDiff) * edgeMask;

    bgColor += vec3(0.6) * highlight * u_depthEffect * bgAlpha;
    bgColor -= vec3(0.6) * selfShadow * u_depthEffect * bgAlpha;

    float shadowDist = getBorderDistance(p - vec2(0.02, -0.02) * edgeScale, bookmarkHalf, cutDepth);
    float shadowW = max(fwidth(shadowDist), 1e-6);
    float dropShadow = 1.0 - smoothstep(-shadowW, 0.15 + shadowW, shadowDist);
    if (bgAlpha < 0.1) {
      bgColor = vec3(0.0);
      bgAlpha = dropShadow * 0.6 * u_depthEffect;
    }
  }

  float textMask = texture(u_textMask, vec2(uv.x, 1.0 - uv.y)).a;

  float activeAlpha = bgAlpha * (1.0 - textMask);
  vec3 activeColor = bgColor;

  float inactiveAlpha = textMask;
  vec3 inactiveColor = u_textColor;

  float finalAlpha = mix(inactiveAlpha, activeAlpha, u_isActive);
  vec3 finalColor = mix(inactiveColor, activeColor, u_isActive);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
