precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_color;
uniform float u_wobble;
uniform float u_chiselDepth;
uniform float u_chiselDensity;
uniform float u_chiselChaos;
uniform float u_densityVar;
uniform float u_depthEffect;
uniform float u_hoverFlameState;
uniform float u_shapeZoom;
uniform sampler2D u_textMask;

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

float sdBookmarkHorizontal(vec2 p, vec2 b, float cutDepth) {
    vec2 d = abs(p) - b;
    float dBox = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    float cutX = -b.x + cutDepth * (1.0 - abs(p.y) / b.y);
    float dCut = cutX - p.x;
    float slope = cutDepth / b.y;
    float len = sqrt(1.0 + slope * slope);
    dCut /= len;
    return max(dBox, dCut);
}

float getBorderDistance(vec2 p) {
    vec2 bookmarkDimensions = vec2(0.7, 0.25);
    float cutDepth = 0.15;
    float dBase = sdBookmarkHorizontal(p, bookmarkDimensions, cutDepth);
    float wobble = fbm(p * 4.0) * u_wobble;
    float baseDist = dBase - wobble;
    float cuts = angularCuts(p, u_chiselDensity, u_chiselChaos) * u_chiselDepth;
    float chiseledDist = baseDist + cuts;
    vec2 fireUV = p * 10.0;
    fireUV.y -= u_time * 4.0;
    float flameDistortion = fbm(fireUV) * 0.1 * u_hoverFlameState;
    float topBias = smoothstep(0.0, 0.8, p.y) * u_hoverFlameState;
    return chiseledDist - flameDistortion * topBias;
}

void main() {
    vec2 res = max(u_resolution, vec2(1.0));
    vec2 frag = gl_FragCoord.xy;
    vec2 uv = frag / res;

    // Fullscreen demo used p from UV with p.x *= W/H — on a short, wide TOC row
    // that over-stretches X and the bookmark collapses to a ribbon. For UI strips,
    // normalize by height so the SDF sees a stable field (like a tall viewport).
    vec2 p = vec2(
        (frag.x - 0.5 * res.x) / res.y,
        (frag.y - 0.5 * res.y) / res.y
    );
    p *= u_shapeZoom;

    float dFinal = getBorderDistance(p);
    float densityMap = fbm(p * 4.0);
    float paintThickness = smoothstep(-1.0, 1.0, densityMap);
    float alphaMult = mix(1.0, paintThickness + 0.3, u_densityVar);

    vec3 finalColor = u_color;
    vec3 flameColor = mix(u_color, vec3(1.0, 1.0, 1.0), 0.4);
    finalColor = mix(finalColor, flameColor, u_hoverFlameState * paintThickness);
    finalColor *= alphaMult;

    float alpha = 1.0 - smoothstep(0.0, 0.01, dFinal);

    if (u_depthEffect > 0.0) {
        float dLight = getBorderDistance(p + vec2(0.005, -0.005));
        float edgeDiff = (dFinal - dLight) * 20.0;
        float edgeMask = smoothstep(-0.03, 0.0, dFinal);
        float highlight = max(0.0, edgeDiff) * edgeMask;
        float selfShadow = max(0.0, -edgeDiff) * edgeMask;

        finalColor += vec3(0.6) * highlight * u_depthEffect * alpha;
        finalColor -= vec3(0.6) * selfShadow * u_depthEffect * alpha;

        float shadowDist = getBorderDistance(p - vec2(0.02, -0.02));
        float dropShadow = 1.0 - smoothstep(0.0, 0.15, shadowDist);
        if (alpha < 0.1) {
            finalColor = vec3(0.0);
            alpha = dropShadow * 0.6 * u_depthEffect;
        }
    }

    // gl_FragCoord.y is bottom-up; 2D canvas mask is top-down — flip V for alignment.
    float textMask = texture(u_textMask, vec2(uv.x, 1.0 - uv.y)).a;
    alpha *= (1.0 - textMask);

    gl_FragColor = vec4(finalColor, alpha);
}
