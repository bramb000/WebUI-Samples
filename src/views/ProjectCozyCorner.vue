<script setup lang="ts">
import { ref } from 'vue';
import ProjectHero from '../components/ProjectHero.vue';
import CaseImage from '../components/CaseImage.vue';
import CaseLazyImage from '../components/CaseLazyImage.vue';
import CaseInsight from '../components/CaseInsight.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { cozyLazyMedia } from '../assets/case-studies/cozyLazyMedia';
import { useCaseStudySketchPanels } from '../composables/useCaseStudySketchPanels';
import loginScreen from '../assets/images/cozy-corner/login-screen.webp';
import pixelmoji from '../assets/images/cozy-corner/pixelmoji.webp';
import profile from '../assets/images/cozy-corner/profile.webp';
import chat from '../assets/images/cozy-corner/chat.webp';

const caseStudyRoot = ref<HTMLElement | null>(null);
useCaseStudySketchPanels(caseStudyRoot);
</script>

<template>
  <div ref="caseStudyRoot" class="animate-fade-in pb-24 relative">
    <div class="case-study-layout xl:grid xl:grid-cols-12 xl:gap-8 w-full max-w-7xl mx-auto px-6 xl:px-0">
      <div class="case-study-main xl:col-span-8 xl:col-start-1 min-w-0">

        <ProjectHero
          title="Cozy Corner, A Warm Third Space"
          description="A design-engineer exploration of real-time social presence: chat, voice, avatars, and a shared world wrapped in a tactile pixel UI."
          role="Design Engineer"
          timeline="3 Days"
          :tags="['Next.js', 'Pixel UI', 'LiveKit']"
        >
          <template #team>
            <p class="type-case-team">Solo</p>
          </template>
        </ProjectHero>

        <section class="panel-recessed--no-pencil-frame noise-overlay case-study-panel">
          <h2 class="type-case-section-accent">Summary</h2>
          <div class="case-study-panel__body type-case-body-lg space-y-4">
            <p>
              <strong>Cozy Corner</strong> is a small-group messaging app dressed like a cozy RPG village. Friends sign in, customise a pixel avatar, chat in a layered ocean scene, wander a shared top-down world, and drop into voice rooms together. The goal was not scale — it was to prove that social software can feel warm, tactile, and game-like without sacrificing real-time reliability.
            </p>
            <p>
              Every surface was designed and built end-to-end: design tokens, component library, sprite pipeline, presence model, and the realtime layers underneath.
            </p>
            <CaseImage
              :src="loginScreen"
              alt="Cozy Corner login screen: pixel-art sky with drifting clouds and grass horizon, wood-panel sign-in form with Google OAuth and email fields, and Bramha logo"
              caption="Login — animated sky scene, drifting clouds, and a wood-panel auth shell"
              img-class="w-full h-auto rounded-xl"
              priority
            />
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="type-case-section">Tech stack</h2>
          <p class="type-case-body-lg">
            A modern React stack with Supabase as the realtime backbone and LiveKit for voice.
          </p>
          <div class="case-insight-grid grid grid-cols-1 md:grid-cols-2">
            <CaseInsight stat="Frontend" statLabel="Next.js 16 · React 19 · TypeScript · CSS Modules" theme="after">
              <p class="type-case-body">App Router with client islands for canvas, chat, and voice. Global design tokens in <code>globals.css</code> — forest/moss/cream palette, 8pt grid, Press Start 2P + VT323 typography.</p>
            </CaseInsight>
            <CaseInsight stat="Backend" statLabel="Supabase · Postgres · Realtime · Storage" theme="after">
              <p class="type-case-body">Auth (Google OAuth + email), profiles, messages, world positions, and session presence. Postgres changes and broadcast channels drive live updates.</p>
            </CaseInsight>
            <CaseInsight stat="Voice" statLabel="LiveKit · livekit-server-sdk" theme="after">
              <p class="type-case-body">Server-minted JWT tokens via <code>/api/livekit-token</code>. Audio-only room with speaking-state visual feedback on avatar seats.</p>
            </CaseInsight>
            <CaseInsight stat="Motion" statLabel="Framer Motion · Canvas 2D" theme="after">
              <p class="type-case-body">Spring-based tactile buttons. Raw Canvas API for world rendering and procedural emoji pixelation — no game engine in the loop.</p>
            </CaseInsight>
          </div>
        </section>

        <section class="space-y-8">
          <h2 class="type-case-section">Design system</h2>
          <p class="type-case-lead">
            Cozy Corner’s design system is built around a single question: <strong>what if group chat felt like a shared hangout, not filing a ticket?</strong> The answer is <strong>“Cozy Pixel UI”</strong> — warm, tactile, and game-adjacent, but still a real web app underneath.
          </p>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Design philosophy</h3>
            <p class="type-case-body-lg">
              The philosophy is <strong>comfort over chrome</strong>. Social software often optimises for information density; this project optimises for emotional temperature — presence, playfulness, and the sense that a space is shared. Pixel art and wood-panel framing are not nostalgia for its own sake; they signal “third place,” the same way a café’s lighting signals “stay awhile.”
            </p>
            <p class="type-case-body-lg">
              Three principles run through every screen:
            </p>
            <ul class="list-disc pl-5 space-y-2 type-case-body">
              <li><strong>Tactile first</strong> — if you can click it, it should look pressable. Hover brightens, tap compresses, panels have inset depth. Feedback is physical, not abstract.</li>
              <li><strong>Restraint in motion</strong> — ambient layers (clouds, ocean sway, scene parallax) loop quietly in CSS; UI transitions stay short and springy. Motion supports mood without competing with readability.</li>
              <li><strong>One village, many rooms</strong> — auth, chat, profile, and voice are different features, but they share type, colour, border weight, and spacing so the app never breaks character when you navigate.</li>
            </ul>
            <p class="type-case-body">
              Typography reinforces the tone: <strong>Press Start 2P</strong> for display labels (titles, nav, panel headers), <strong>VT323</strong> for readable body and chat copy at a larger pixel scale. The split keeps headers unmistakably retro while messages stay scannable in long threads.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Traditional web layout + 9-slice pixel art</h3>
            <p class="type-case-body-lg">
              The system deliberately <strong>mixes two idioms</strong>: conventional responsive web structure on the inside, pixel-game surface treatment on the outside. The app shell is familiar web design — a <strong>2:8:2 column grid</strong> (sidebar · main · roster), flex stacks for auth forms, scrollable chat, accessible focus states, and standard input patterns. None of that is reinvented.
            </p>
            <p class="type-case-body-lg">
              What <em>is</em> reinvented is the skin. Panels, buttons, and cards borrow from game UI via <strong>9-slice-style borders</strong>: corner and edge slices from small PNG tiles, scaled with <code>border-image</code> so wood-grain frames and pixel outlines stretch to any panel width without distorting corners. <strong>PixelPanel</strong> ships wood and standard variants; <strong>PixelButton</strong> pairs with them on login and onboarding so the form reads as a carved sign, not a default HTML fieldset.
            </p>
            <p class="type-case-body">
              The hybrid shows up everywhere:
            </p>
            <ul class="list-disc pl-5 space-y-2 type-case-body">
              <li><strong>Layout</strong> — CSS Grid and flex for structure; pixel borders and hard drop shadows for character.</li>
              <li><strong>Imagery</strong> — chat backgrounds and avatars are layered PNG sprites with <code>image-rendering: pixelated</code>; the message list itself is still a normal scroll container with real text nodes.</li>
              <li><strong>Depth</strong> — <strong>PhysicalCard</strong> uses offset shadows (no blur) like inventory tiles; content inside is standard React markup.</li>
              <li><strong>Interaction</strong> — <strong>TactileButton</strong> wraps semantic <code>&lt;button&gt;</code> elements with Framer Motion scale/brightness; accessibility and keyboard behaviour stay web-native.</li>
            </ul>
            <p class="type-case-body">
              The goal is not to build a game engine UI — it is to let web UX patterns (roster, threading, mute toggles) carry the usability while pixel art carries the feeling. You get Discord’s clarity dressed in a cozy RPG village.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Semantic design tokens</h3>
            <p class="type-case-body-lg">
              All visual decisions flow through CSS custom properties in <code>globals.css</code>. Components never reference raw hex values in their modules — they reference <strong>semantic roles</strong>, so iteration happens in one place and every screen updates together.
            </p>
            <p class="type-case-body-lg">
              Tokens are organised in three layers:
            </p>
            <ol class="list-decimal pl-5 space-y-2 type-case-body">
              <li><strong>Primitives</strong> — base steps on an 8pt spacing scale, type sizes (<code>--text-xs</code> … <code>--text-2xl</code>), and raw palette anchors.</li>
              <li><strong>Semantics</strong> — role names that describe intent, not appearance: <code>--moss</code> (primary interactive fill), <code>--cream</code> (readable surface), <code>--forest</code> (deep backdrop), <code>--sky</code> (ambient highlight). Renaming “moss” from green to teal would not require hunting through component files.</li>
              <li><strong>Component aliases</strong> — composed tokens such as <code>--shadow-drop</code> (hard card elevation), inset shadow pairs for pressed inputs, and a shared <code>--border-pixel</code> weight for the 2px outline repeated on panels, swatches, and roster chips.</li>
            </ol>
            <p class="type-case-body-lg">
              Status and emphasis sit in scoped variants — danger for mute/disconnect, a leaf-toned online marker instead of a generic green dot — so functional colour never pollutes the neutral village palette. Chat scrims use a dedicated transparency token so parallax backgrounds stay visible while VT323 body text keeps contrast.
            </p>
            <p class="type-case-body">
              Layout primitives (<code>Stack</code>, <code>Box</code>, <code>PageContainer</code>) consume spacing tokens directly, which means new auth or settings screens inherit rhythm by default. <strong>RevealText</strong>, swatch grids, and voice seat rings all pull from the same semantic set — the system stays small (~a dozen composed components) because tokens do the heavy lifting.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Hand-drawn art</h3>
            <p class="type-case-body-lg">
              Every visual asset in the app is <strong>hand-drawn pixel art</strong> — character sprite sheets, chat backgrounds, 9-slice UI tiles, and scene layers. Some I drew myself; others were commissioned from pixel artists for specific sets. <strong>No AI-generated art</strong> was used anywhere in the project — the village’s warmth comes from human line work and deliberate colour choices, not generative fills.
            </p>
            <p class="type-case-body">
              That constraint shaped the pipeline: sprites ship as authored PNG sheets, backgrounds stack as layered parallax PNGs, and UI skins use repeatable hand-painted border slices — all tuned by eye, not upscaled from models.
            </p>
          </div>

          <CaseInsight theme="after">
            <p class="type-case-body-lg">
              Philosophy sets the mood, the web + 9-slice hybrid delivers usability without breaking immersion, and semantic tokens keep both aligned as features ship. Add a chat background, avatar layer, or voice seat and you extend the village — you do not redesign it.
            </p>
          </CaseInsight>
        </section>

        <section class="space-y-8">
          <h2 class="type-case-section" data-toc-label="Features">Features &amp; how they were built</h2>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Auth &amp; onboarding</h3>
            <p class="type-case-body-lg">
              Login sits on an animated sky scene — drifting cloud sprites, grass horizon, wood panel form. Supabase handles Google OAuth and email/password; new users land on onboarding where they must create a character before entering chat. An <code>AuthContext</code> wraps the app shell, fetches profiles, and runs a session heartbeat so the roster knows who is online.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Layered sprite avatar system</h3>
            <p class="type-case-body-lg">
              Character appearance is data-driven. A single <code>sprites.ts</code> registry maps hair, tops, bottoms, shoes, and headwear to authenticated sprite-sheet paths (~130 assets). <strong>CharacterSprite</strong> stacks layers with CSS background-position animation across a 12-frame walk cycle. <strong>CharacterAvatar</strong> adds variant-specific crops — roster (head only), chat (chest-up), panel, preview — so the same config reads correctly at every size.
            </p>
            <p class="type-case-body">
              Signed CDN URLs are prefetched once on mount via <code>SpriteUrlContext</code> (cached in sessionStorage) to avoid per-image server roundtrips. Fallback proxy routes serve sprites when CDN isn’t ready.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Profile customizer &amp; chat backgrounds</h3>
            <p class="type-case-body-lg">
              The profile page splits into a live preview (avatar on a parallax ocean scene) and a tabbed customizer — hair, top, bottom, shoes, hat with style + colour swatches. Eight selectable chat backgrounds persist to the profile; each scene is a stack of PNG layers (sky, swaying middle rocks, ground) rendered by <strong>ChatSceneBackground</strong> with CSS float animations.
            </p>
            <CaseImage
              :src="profile"
              alt="Profile customizer: live pixel avatar preview on a parallax ocean background, tabbed controls for hair top bottom shoes and hat, and a grid of selectable chat background swatches"
              caption="Profile customizer — live preview on a parallax ocean scene with tabbed outfit controls"
              img-class="w-full h-auto rounded-xl"
            />
            <CaseLazyImage
              :loader="cozyLazyMedia.profileDemo"
              alt="Screen recording of the profile customizer cycling through hair styles, outfit colours, and chat background options"
              caption="Swapping hair, outfit layers, and chat backgrounds in the customizer"
              img-class="w-full h-auto rounded-xl"
              video
            />
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Real-time chat</h3>
            <p class="type-case-body-lg">
              Messages live in Supabase Postgres; inserts stream in via Realtime subscriptions. The UI implements Discord-style <strong>message chaining</strong> — consecutive messages from the same user within 20 seconds collapse into one thread, showing the avatar only on chain start and hover timestamps on follow-ups.
            </p>
            <p class="type-case-body">
              Input is a <code>contentEditable</code> div with markdown-lite transforms (<code>**bold**</code>, <code>*italic*</code>) and keyboard shortcuts.
            </p>
            <CaseImage
              :src="chat"
              alt="Real-time chat screen: layered ocean background, left navigation sidebar, member roster with online indicators, chained message threads, and a message input bar"
              caption="Chat — layered ocean background, roster sidebar, and chained message threads"
              img-class="w-full h-auto rounded-xl"
            />
            <CaseLazyImage
              :loader="cozyLazyMedia.chatDemo"
              alt="Screen recording of real-time chat showing message sending, inline pixel emoji rendering, and live roster presence updates"
              caption="Sending messages, emoji pixelation, and live roster updates"
              img-class="w-full h-auto rounded-xl"
              video
            />
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Native emoji → pixel art pipeline</h3>
            <p class="type-case-body-lg">
              The chat renders stored HTML with <code>dangerouslySetInnerHTML</code>, but raw Unicode emojis would break the pixel aesthetic — they arrive as smooth, OS-specific colour glyphs. Instead, every emoji is converted at display time through a two-stage client-side pipeline: <strong>detect → rasterise → threshold → cache → scale.</strong>
            </p>
            <p class="type-case-body-lg">
              <strong>1. Detection.</strong> <code>parseEmojisToHtml()</code> runs the message body through the <code>emoji-regex</code> package, which matches standard Unicode emoji sequences (including ZWJ compounds like 👨‍👩‍👧). Each match is replaced with a small HTML fragment — not the raw character.
            </p>
            <p class="type-case-body-lg">
              <strong>2. Canvas rasterisation.</strong> For each match, <code>getPixelatedEmoji()</code> creates an off-screen 16×16 canvas. The native emoji is drawn with <code>fillText()</code> using the OS emoji font stack — <code>Apple Color Emoji</code>, <code>Segoe UI Emoji</code>, <code>Noto Color Emoji</code> — at 13px, centred on the canvas. Rendering at 16×16 first (rather than drawing large and downscaling) keeps the source resolution intentionally low, which is what gives the retro pixel look once scaled up.
            </p>
            <p class="type-case-body-lg">
              <strong>3. Alpha thresholding.</strong> Browser emoji rendering is anti-aliased by default — soft edges that look wrong at pixel scale. The pipeline reads back the canvas pixel data and hard-thresholds the alpha channel: any pixel below 50% opacity becomes fully transparent, anything above becomes fully opaque. That single pass removes fringe blur and produces crisp, game-like edges without hand-authoring sprite sheets for every emoji.
            </p>
            <p class="type-case-body-lg">
              <strong>4. Cache &amp; inject.</strong> The result is exported as a base64 PNG data URL and stored in an in-memory <code>Map</code> keyed by the Unicode string — the same emoji never hits the canvas twice in a session. The HTML output wraps it in a <code>pixel-emoji-wrapper</code> span with an <code>&lt;img&gt;</code> inside, preserving the original character in <code>alt</code> and <code>title</code> for accessibility.
            </p>
            <p class="type-case-body-lg">
              <strong>5. CSS upscaling.</strong> The image is displayed at <code>1em × 1em</code> with <code>image-rendering: pixelated</code>, which tells the browser to use nearest-neighbour interpolation instead of smoothing — so the 16×16 bitmap reads as chunky pixel art inline with body text. Vertical alignment is tuned (<code>vertical-align: -0.2em</code>) so emoji sit on the text baseline rather than floating above it.
            </p>
            <CaseImage
              :src="pixelmoji"
              alt="Close-up of chat messages showing pixelated emoji rendered inline with body text using nearest-neighbour upscaling instead of smooth OS emoji glyphs"
              caption="Pixel emojis inline with body text — native Unicode glyphs rasterised to 16×16 and upscaled with nearest-neighbour"
              img-class="w-full h-auto rounded-xl"
            />
            <CaseInsight theme="after">
              <p class="type-case-body-lg">
                The pipeline runs client-side only — during SSR or if canvas fails, it falls back to the native Unicode character. No emoji sprite atlas to maintain; any emoji a user types on any OS automatically inherits the Cozy Pixel look.
              </p>
            </CaseInsight>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Shared world (Canvas)</h3>
            <p class="type-case-body-lg">
              “The World” is a 40×30 tile map drawn entirely with the Canvas 2D API — grass, paths, trees, pond, subtle grid. Players move with WASD/arrows; characters are drawn procedurally from the same config colours used in chat (hair styles, outfit, hat emoji, direction-aware eyes).
            </p>
            <p class="type-case-body">
              Movement uses a <strong>hybrid sync strategy</strong>: WebSocket broadcast every 100ms for smooth peer updates, throttled Postgres upserts every 5s as backup, and a debounced final save when movement stops — keeping disk I/O low while movement feels instant.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Voice room</h3>
            <p class="type-case-body-lg">
              Voice uses LiveKit audio-only. Twenty-five seat slots ring the room in polar coordinates — each participant hashes to a fixed seat; when they speak, their layered sprite animates. Mute/unmute toggles the local mic; leaving tears down the room cleanly.
            </p>
            <CaseLazyImage
              :loader="cozyLazyMedia.voiceRoom"
              alt="Screen recording of the voice room with pixel avatars seated in a circle, showing speaking-state sprite animation"
              caption="Voice room — avatar seats ring the space; speaking state animates layered sprites"
              img-class="w-full h-auto rounded-xl"
              video
            />
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Presence &amp; member roster</h3>
            <p class="type-case-body-lg">
              A three-column app shell — sidebar nav, main content, roster directory. The roster lists all profiles split online/offline, driven by a <code>sessions</code> table with Realtime subscriptions. Online users get a leaf marker (✿) instead of a generic green dot, keeping the nature theme consistent.
            </p>
          </div>
        </section>

        <section class="space-y-6">
          <h2 class="type-case-section">Build &amp; deploy pipeline</h2>
          <p class="type-case-body-lg">
            The app ships as a standard Next.js production build — no custom CI config in-repo, but a deliberate asset and auth pipeline around it.
          </p>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Local dev → production build</h3>
            <p class="type-case-body-lg">
              Four npm scripts cover the loop: <code>next dev</code> for local work, <code>next build</code> + <code>next start</code> for production, and <code>eslint</code> via <code>eslint-config-next</code>. TypeScript is strict end-to-end. <code>next.config.ts</code> whitelists Supabase image hosts, marks <code>livekit-server-sdk</code> as a server external package, and keeps dev indicators off.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Deploy target</h3>
            <p class="type-case-body-lg">
              Built for Vercel — the default Next.js host. Environment variables (<code>NEXT_PUBLIC_SUPABASE_*</code>, <code>SUPABASE_SERVICE_ROLE_KEY</code>, <code>LIVEKIT_*</code>) are injected at deploy time; no secrets live in the repo.
            </p>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Sprite asset pipeline</h3>
            <p class="type-case-body-lg">
              Character art never ships from <code>/public</code>. The flow is:
            </p>
            <ol class="list-decimal pl-5 space-y-2 type-case-body">
              <li><strong>Local source</strong> — PNG sheets live in <code>assets/sprites/</code> during development; <code>/api/sprites</code> serves them from disk.</li>
              <li><strong>Upload script</strong> — <code>node scripts/upload-sprites.mjs</code> recursively pushes every PNG to a private Supabase Storage bucket (upsert-safe, re-runnable).</li>
              <li><strong>Production serve</strong> — the same API route falls back to Storage downloads when local files aren’t present.</li>
              <li><strong>Batch signing</strong> — on app mount, <code>GET /api/sprite-urls</code> batch-signs ~130 URLs (2h TTL); the client caches the map in sessionStorage and preloads images so the customizer stays instant.</li>
            </ol>
          </div>

          <div class="space-y-3">
            <h3 class="type-case-subsection">Auth middleware &amp; database</h3>
            <p class="type-case-body-lg">
              A Next.js middleware proxy runs on every non-static route, refreshing Supabase session cookies via <code>getSession()</code> (cookie-only, no network round-trip — avoids Vercel edge timeouts). Unauthenticated users redirect to <code>/login</code>; authenticated users skip it. Schema changes ship as Supabase SQL migrations (e.g. <code>chat_background</code> column on profiles).
            </p>
          </div>
        </section>

        <section class="space-y-4">
          <h2 class="type-case-section">Architecture notes</h2>
          <ul class="list-disc pl-5 space-y-2 type-case-body">
            <li><strong>Single source of truth for sprites</strong> — add one entry to <code>sprites.ts</code>, customizer and renderer pick it up automatically.</li>
            <li><strong>Protected assets</strong> — character art never ships from <code>/public</code>; an authenticated <code>/api/sprites</code> proxy gates access.</li>
            <li><strong>Realtime-first, DB-second</strong> — chat and world prioritise Supabase channels; Postgres is persistence, not the hot path.</li>
            <li><strong>Design-engineer loop</strong> — optical centering debug hooks on the profile preview, variant maps for avatar crops, and CSS token-driven layout ratios (2:8:2 sidebar grid).</li>
          </ul>
        </section>
      </div>

      <!-- ToC Sidebar Container -->
      <div class="toc-sidebar-column hidden xl:block xl:col-span-3 xl:col-start-10 relative">
        <div class="toc-sidebar-sticky">
          <TableOfContents />
        </div>
      </div>
    </div>
  </div>
</template>
