# Performance audit — bramha-personal-portfolio

Last updated from a full pass over WebGL/VFX, routing, and `src/assets` (~117MB on disk).

## Executive summary

| Tier | Issue | Est. impact |
|------|--------|-------------|
| **P0** | Guild + Rocksmith GIFs/PNGs (4–7MB each) bundled via static imports | **~90MB** network on case-study load |
| **P0** | Book pages preload all images at once | **~6MB** on Home first paint |
| **P1** | Steady RAF: Home book + Nav wisp + `/work` chisel overlay + flame tick | GPU/CPU while tab visible |
| **P1** | WebGL bake singletons never released on route leave | Extra GPU contexts |
| **P2** | Global SVG filter animations in `App.vue` | Minor CPU all routes |
| **P2** | Dead code: `WebGLFlame.vue`, `FlameHoverCard.vue`, `tocBookmarkRimBake.ts` | Maintenance only |

**Biggest wins:** re-encode media, lazy-load case-study sections, staged book preload (implemented), pause hidden tabs (partially implemented).

---

## Asset inventory

Run anytime:

```bash
npm run assets:inventory
```

### By folder (approx.)

| Path | Size | Loaded when |
|------|------|-------------|
| `src/assets/images/guild` | ~53MB | `/work/guild-of-guardians` |
| `src/assets/images/rocksmith` | ~46MB | `/work/rocksmith` |
| `src/assets/images/roster-cards` | ~11MB | `/work` |
| `src/assets/images/book` | ~6MB | `/` (detective book) |
| `src/shaders/IMG_0558.PNG` | ~3.4MB | `/work` (roster grain mask) |

### Worst offenders (format / size)

- **GIFs** from video converters: 4–7MB each (guild `tldr/`, rocksmith `solution/`).
- **PNGs** at full camera resolution: book `cover.png` etc. (~2.1MB), `019_other-games-ui-overlap.png` (7.2MB).
- **“Thumbnail” WebPs** that are still 1.9–2.4MB (resize to display width).

### Recommended formats

| Source | Replace with | Notes |
|--------|----------------|-------|
| Animated GIF (UI demo) | **WebM** or **MP4** (`muted autoplay loop playsinline`) | 10–50× smaller; use `CaseLoopVideo.vue` |
| Short loop, alpha needed | **Animated WebP** or **APNG** | Only if video mask is unacceptable |
| Photo / UI still | **WebP** or **AVIF** @ 1×–2× display width | Target &lt;200KB for inline, &lt;500KB hero |
| Roster / book art | WebP @ max 1200–1600px edge | Keeps WebGL uploads smaller |

---

## Media pipeline (scripts)

```bash
# Report files over 400KB (no writes)
npm run assets:inventory

# Dry-run conversions (needs ffmpeg for GIF→WebM)
npm run assets:optimize

# Write optimized siblings (*.webp / *.webm) next to sources
npm run assets:optimize -- --write
```

Requirements:

- **sharp** (devDependency) — PNG/JPEG → WebP
- **ffmpeg** on PATH — GIF → WebM

After generating `.webm` / `.webp`, update imports in `ProjectGuild.vue` / `ProjectRocksmith.vue` and swap `<CaseImage>` for `<CaseLoopVideo>` where appropriate.

---

## Runtime — WebGL & RAF

### Always-on (typical session)

| System | Route | FPS | Gating |
|--------|-------|-----|--------|
| `WebGLWisp` | Most pages (Nav) | 24 | `useLowPowerMode`, tab hidden |
| Detective book | `/` | ~60 | `useReducedMotion` → static UI; tab hidden pause |
| `chiselFrameOverlay` | `/work` detail panel | ~60 | Unregisters when panel unmounts |
| `projectFlameSingleton` tick | `/work` | 24 | Renders only on thumb hover; disposed on leave |
| Roster/card **bakes** | `/work`, case studies | burst | ResizeObserver / DOM scan |

### Implemented mitigations

- Staged book preload: `cover` + `understand` first, rest in `requestIdleCallback`.
- Tab visibility: wisp, detective book, `/work` flame tick pause when `document.hidden`.
- `disposeProjectFlameSingleton()` on `/work` unmount.
- WebGL wisp resize listener leak fixed.

### Still recommended

1. **Pause chisel overlay** when detail panel off-screen or tab hidden (`chiselFrameOverlay.ts`).
2. **Route-level bake disposal** — call `disposePencilFrameBakeGl` / similar when leaving `/work` (modules: `pencilFrameBake`, `rosterCardPaintBake`, `chiselRimBake`).
3. **Remove or gate** global SVG `<animate>` in `App.vue` with `prefers-reduced-motion` or route meta.
4. **Delete dead VFX** — `WebGLFlame.vue`, `FlameHoverCard.vue`, unused `tocBookmarkRimBake.ts`.

---

## Loading & code splitting

### What works today

- Vue Router: all views `() => import(...)`.
- Manual chunks: `three`, `posthog-js`, `lottie-web` in `vite.config.ts`.
- `/work` embedded case studies: `defineAsyncComponent` per project id.
- Nav hover prefetch of `ProjectSelect.vue`.
- PostHog: dynamic import after idle.
- `CaseImage`: `loading="lazy"` unless `priority`.

### Gaps

- **Heaviest case-study clips are code-split** via `CaseLazyImage` + dynamic `import()`; above-fold stills remain eager.
- **Book glob** splits files, but preload used to fetch all at once (now staged).
- **No service worker** — fine for static portfolio; rely on hashed filenames + CDN cache.

### Recommended patterns

1. **Section-level dynamic imports**

   ```ts
   const loadGuildTldr = () => import('../assets/images/guild/tldr/index.ts')
   ```

   Export a map of lazy loaders per section; mount when `IntersectionObserver` hits the section.

2. **`import.meta.glob` with eager: false** for case-study folders (mirror `bookPageImages.ts`).

3. **Move rarely used giants to `public/`** only if you need URLs without bundling — prefer glob + lazy import so Vite still hashes in production.

4. **`<link rel="preload">`** for Home LCP only (`cover` book image) — add in `Home.vue` or `index.html` after measuring.

---

## Caching

| Layer | Status | Action |
|-------|--------|--------|
| Browser HTTP | Hashed assets after `vite build` | Set long `Cache-Control` on deploy (GitHub Pages / CDN) |
| In-memory | Book images, parchment bake, roster grain | Cleared on book dispose; consider cap for case-study |
| Service worker | None | Optional for repeat visits — low priority |
| PostHog / fonts | Deferred / CDN | Keep |

---

## Build & Vite

- `assetsInlineLimit`: default 4KB — large files stay separate (good).
- Consider `vite-plugin-image-optimizer` or prebuild `npm run assets:optimize` in CI before `build`.
- Optional: split guild/rocksmith into manual chunks only after lazy media imports exist.

---

## Deploy (GitHub Pages)

Add cache headers for `build/assets/*` (immutable hashed names), e.g. via `static/_headers` (Cloudflare/Netlify) or a small deploy script. Short cache for `index.html`.

---

## Checklist (prioritized)

- [x] `npm run assets:optimize:write` — 51+ files; WebP siblings (~89MB smaller)
- [x] `npm run assets:migrate-webp` — case studies, roster, Home
- [x] Lazy-load heaviest clips — `CaseLazyImage`, `rocksmithLazyMedia.ts`, `guildLazyMedia.ts`
- [x] Roster + `IMG_0558` mask → WebP; book prefers `.webp`
- [ ] `brew install ffmpeg` then re-run optimizer for GIF→WebM (optional; animated WebP already in use)
- [ ] Remove duplicate PNG/GIF sources after visual QA (`assets:optimize:write --replace`)
- [ ] Lazy-load remaining stills by section
- [ ] Gate or remove global SVG filter animations
- [ ] Dispose bake GL on `/work` leave
- [ ] Pause `chiselFrameOverlay` when tab hidden
- [ ] Remove dead `WebGLFlame` / `FlameHoverCard`
- [ ] Measure LCP/INP with Lighthouse on Home and `/work`

---

## Measuring

```bash
npm run build && npm run preview
# Lighthouse (mobile + desktop) on / and /work
# Chrome Performance → record scroll on Home book + /work roster hover
```

Watch **GPU memory** (Chrome → More tools → Performance monitor) when navigating Home → Work → back.
