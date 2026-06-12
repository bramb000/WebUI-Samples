<script setup lang="ts">
import { ref } from 'vue';
import ProjectHero from '../components/ProjectHero.vue';
import CaseImage from '../components/CaseImage.vue';
import CaseLazyImage from '../components/CaseLazyImage.vue';
import CaseInsight from '../components/CaseInsight.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { useCaseStudySketchPanels } from '../composables/useCaseStudySketchPanels';

// Live captured screenshots and visual assets
import heroImg from '../assets/images/online-dice-simulator/screenshot_1.png';
import presetsImg from '../assets/images/online-dice-simulator/screenshot_3.png';
import desktopImg from '../assets/images/online-dice-simulator/desktop.png';
import crowdedTableImg from '../assets/images/online-dice-simulator/crowded_game_table.png';
import laptopsTableImg from '../assets/images/online-dice-simulator/laptops_game_table.png';
import touchHeatmapImg from '../assets/images/online-dice-simulator/thumb_touch_heatmap.png';

// Lazy loader functions for captured roll videos
const rollMobileLoader = () => import('../assets/images/online-dice-simulator/roll-mobile.webm');
const rollDesktopLoader = () => import('../assets/images/online-dice-simulator/roll-desktop.webm');

const caseStudyRoot = ref<HTMLElement | null>(null);
useCaseStudySketchPanels(caseStudyRoot);
</script>

<template>
  <div ref="caseStudyRoot" class="animate-fade-in pb-24 relative">
    <div class="case-study-layout xl:grid xl:grid-cols-12 xl:gap-8 w-full max-w-7xl mx-auto px-6 xl:px-0">
      
      <!-- Main Content Column -->
      <div class="case-study-main xl:col-span-8 xl:col-start-1 min-w-0">
        
        <!-- ─── HERO ─── -->
        <ProjectHero
          title="Solo vibe coding a 600 MAU webapp"
          description="A design-engineer case study on solving physical space constraints at game nights to grow a mobile-first rolling utility from a local board game club to 600 MAU."
          role="Creator (Solo Design & Engineering)"
          timeline="3 Days"
          :tags="['3D Physics', 'Mobile-First Design', 'React Three Fiber', 'Rapier3D']"
        >
          <template #team>
            <p class="type-case-team">Solo</p>
          </template>
        </ProjectHero>

        <!-- ─── USER EXPERIENCE ─── -->
        <section class="space-y-6">
          <h2 class="type-case-section">User Experience</h2>
          <p class="type-case-lead">
            Observational study was my primary user research tool, observing and interviewing approximately 60 players across multiple session environments and game systems like <em>Dungeons &amp; Dragons</em> and <em>Pathfinder</em>. This research revealed a chronological series of physical and social constraints.
          </p>
          
          <div class="space-y-6 type-case-body-lg">
            <div class="space-y-4">
              <CaseImage
                :src="crowdedTableImg"
                alt="A top-down view of a crowded board game dining table during a D&D session with character sheets, books, miniatures, snacks, soda cans, and dice"
                caption="The Setup Space — Typical face-to-face game tables are heavily crowded with reference books, sheets, miniatures, and snacks."
                img-class="w-full h-auto rounded-xl border border-[var(--color-border)]"
              />
              <p>
                <strong>Phase 1: The Messy Table.</strong> Face-to-face board game nights are intensely tactile but highly cluttered. Dining tables are packed flat with character sheets, pencils, rulebooks, miniatures, snack bowls, and drinks. Rolling physical dice in this space was constant chaos—dice routinely knocked over fragile miniature setups, fell off table edges, or landed in beverage cups.
              </p>
            </div>

            <div class="space-y-4">
              <CaseImage
                :src="laptopsTableImg"
                alt="Players hunched over open, bulky laptops at a board game table, blocking views and creating a physical and social barrier"
                caption="The Laptop Barrier — Attempting to run digital dice and sheet utilities on laptops consumes valuable physical space and isolates players."
                img-class="w-full h-auto rounded-xl border border-[var(--color-border)]"
              />
              <p>
                <strong>Phase 2: The Failed Laptop Workaround.</strong> To mitigate physical space issues, some players attempted to use laptops to manage character sheets and roll digital dice. However, this introduced a severe secondary pain point. Laptop screens created a literal social barrier, blocking line-of-sight between players and the Game Master. Additionally, open laptops consumed massive table footprints, leaving zero space for players to reach physical boards or components.
              </p>
            </div>

            <p>
              <strong>Phase 3: The Mobile-First Opportunity.</strong> This sequence of observations highlighted that the solution had to be a mobile web utility that players could lay flat on the table or hold in one hand. It needed to offer a zero-install experience with controls positioned entirely within the thumb-reach zone to prevent players from having to hold the phone with two hands or shift focus away from the game.
            </p>
          </div>

          <h3 class="type-case-subsection">Playtesting &amp; Interview Insights</h3>
          <p class="type-case-body-lg">
            Conducting interviews and playtest observations with 60 users revealed several key issues (highlighted in red below) that shifted our product and interface design:
          </p>
          
          <div class="case-insight-grid grid grid-cols-1 md:grid-cols-3 mt-6 gap-6">
            <CaseInsight stat="25%" statLabel="Tablet Focus" theme="before">
              <p class="type-case-body"><strong>Space constraints were real.</strong> While mobile was the primary target, 25% of observed users reported also wanting to use their tablets flat on the table alongside character sheets rather than phones.</p>
            </CaseInsight>
            <CaseInsight stat="85%" statLabel="DM Stalls" theme="before">
              <p class="type-case-body"><strong>Slow reporting stalled gameplay.</strong> 85% of Dungeon Masters reported that players slowly adding up modifiers and reading physical dice stalled game pacing, and they recommended tools prioritizing speed.</p>
            </CaseInsight>
            <CaseInsight stat="55%" statLabel="Math Friction" theme="before">
              <p class="type-case-body"><strong>Bookkeeping was a massive bottleneck.</strong> 55% of players struggled with calculating modifier math quickly on the fly or keeping track of their roll history during complex encounters.</p>
            </CaseInsight>
          </div>

          <h3 class="type-case-subsection">How Insights Informed the Design</h3>
          <div class="space-y-4 type-case-body-lg">
            <p>
              Rather than building a standard desktop-oriented web layout, the playtesting insights directly shaped the physical ergonomics of the app:
            </p>
            <ul class="list-disc pl-5 space-y-2 type-case-body">
              <li><strong>Flat/Propped Table Ergonomics</strong>: Because 25% of users wanted to roll from tablets and many others kept their phones resting flat on the table, the interface was designed to be operated flat. Font sizes are scaled, and buttons have massive hit areas so players can operate the app from an angle without picking the device up.</li>
              <li><strong>One-Hand Thumb Reach Zone</strong>: The primary rolling controls and tray pickers are clustered at the bottom of the viewport, ensuring players can keep one hand free to hold food, cards, or reference sheets.</li>
            </ul>
          </div>

          <div class="my-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            <div class="max-w-[320px] mx-auto w-full">
              <CaseImage
                :src="touchHeatmapImg"
                alt="Heatmap infographic of a mobile phone screen showing thumb reachability zones (green for easy lower reach, yellow for moderate, red for hard)"
                caption="Thumb Reachability — Green zone highlights easy-reach thumb interactions."
                img-class="w-full h-auto rounded-xl border border-[var(--color-border)]"
              />
            </div>
            <div class="max-w-[320px] mx-auto w-full">
              <CaseImage
                class="device-iphone-wrapper"
                :src="heroImg"
                alt="Mobile view of Online Dice Simulator showing the controls grouped at the bottom of the screen within the thumb reach zone"
                caption="User Interface Compliance — All primary rolling controls and tray pickers are anchored in the easy-reach zone."
              />
            </div>
          </div>
        </section>

        <!-- ─── USER INTERFACE ─── -->
        <section class="space-y-6">
          <h2 class="type-case-section">User Interface</h2>
          
          <div class="space-y-4 type-case-body-lg">
            <h3 class="type-case-subsection">Procreate Inspiration: Canvas Minimalism &amp; Tactile Gestures</h3>
            <p>
              To make the interface feel less like a clinical configuration form and more like a tactile, high-response instrument, I drew significant inspiration from <strong>Procreate's interaction model</strong>. Procreate successfully handles complex artistic tools on mobile devices by keeping the drawing canvas entirely clear, utilizing fluid gesture-driven overlays and slide-in panels that respect user focus and state context.
            </p>
            <ul class="list-disc pl-5 space-y-2 type-case-body">
              <li><strong>Zero-Friction Clear Gesture</strong>: Borrowing Procreate's iconic two-finger tap to undo, a quick double-tap anywhere on the 3D rolling canvas instantly clears all active dice and resets the board.</li>
              <li><strong>Tactile Flick-to-Roll</strong>: Instead of relying strictly on tapping a static "Roll" button, players can flick/swipe their finger directly across the 3D canvas or shake their phone (utilizing browser-native Accelerometer APIs) to toss the dice. The swipe gesture's drag direction and velocity map directly to the initial physical forces and torque applied to the 3D bodies.</li>
              <li><strong>Radial Settings Context Menu</strong>: Long-pressing a die in the tray picker invokes a radial touch dial, allowing players to customize materials, colors, or tweak quantity modifiers in a single continuous touch-drag-release sequence without leaving the canvas.</li>
            </ul>

            <h3 class="type-case-subsection">Stable Layout Principle: Zero Runtime Reflow</h3>
            <p>
              To eliminate cognitive friction during fast-paced play, I established a strict design rule: <strong>the application chrome must not reflow when state changes.</strong> When rolling, selected dice counts change, or errors occur, elements must not push other layout components around.
            </p>
            <ul class="list-disc pl-5 space-y-2 type-case-body">
              <li><strong>Persistent Control Targets</strong>: Clear/remove buttons and counts are always mounted in the DOM. When they are inactive or zero, they use CSS <code>invisible</code> rather than conditional rendering, preserving their exact layout footprint.</li>
              <li><strong>Fixed Cast Cells</strong>: To handle mobile viewport sizing, dice selection cells use a strict <code>--cast-cell-size</code> (84px on mobile, 60px on desktop) instead of adapting dynamically to viewport width, avoiding squishing.</li>
              <li><strong>Tray Isolation</strong>: The interface control tray overlays the 3D viewport instead of resizing it, guaranteeing that Three.js does not trigger expensive camera updates or canvas resize layouts during gameplay.</li>
            </ul>

            <h3 class="type-case-subsection">Mobile Scrolling Rails</h3>
            <p>
              To fit D4, D6, D8, D10, D12, D20, and D100 picker options inside mobile viewports, the app features a horizontal <code>TrayActionsRail</code>. 
            </p>
            <p>
              Through iterative commits, I optimized the horizontal scroll snapping, introduced a floating dice rail design to improve discoverability, and added logic to disable scrolling indicators when the full stack fits in the viewport, ensuring clean visual cues.
            </p>

            <h3 class="type-case-subsection">Instant Dice Presets</h3>
            <p>
              To resolve playtest bookkeeping struggles (55% users struggling with manual math) and GM stalls, we implemented a dedicated <strong>Dice Presets Manager</strong>. Players can save complex formulas (e.g., D&D Wizard Fireball 8d6, Warhammer Attack 10d6, Pathfinder Initiative 1d20+5) to quickly jump between rolling contexts and games. This maintains steady pacing and automates calculations instantly.
            </p>
            <div class="my-6 max-w-[320px] mx-auto">
              <CaseImage
                class="device-iphone-wrapper"
                :src="presetsImg"
                alt="Mobile view of Online Dice Simulator showing the Dice Presets screen with custom quick-rolling slots"
                caption="Dice Presets — Dedicated slots for saving custom modifier formulas to speed up reporting."
              />
            </div>

            <h3 class="type-case-subsection">Tablet Landscape Interface Layout</h3>
            <p>
              To accommodate the 25% of playtesters wanting to roll from tablets, we built a responsive wide-screen layout mode. In landscape orientation, the canvas is side-by-side with a persistent settings drawer. This creates a clean, split-screen desktop-like experience on iPad, displaying character statistics and math modifier histories concurrently with the active 3D tray.
            </p>
          </div>

          <!-- Video Demo Mobile -->
          <div class="my-6 max-w-[320px] mx-auto">
            <CaseLazyImage
              class="device-iphone-wrapper"
              :loader="rollMobileLoader"
              alt="Video demonstrating dice selection, gesture interactions, and roll physics animation on a mobile viewport"
              caption="Gesture & Motion Demo — Real-time recording of gesture-driven dice selection, spring-based panels, and interactive 3D physics roll."
              video
            />
          </div>

          <h3 class="type-case-subsection pt-4">Accessibility &amp; Keyboard Support</h3>
          <p class="type-case-lead">
            Accessibility was built into the foundation rather than treated as a checklist item.
          </p>
          <div class="space-y-4 type-case-body-lg">
            <p>
              <strong>Roving Keyboard Focus</strong>: To support players using external keyboards, adaptive switches, or controllers, I implemented a custom roving focus system (<code>useCastGridRovingFocus</code> and <code>RovingFocusList</code>). Buttons and dice tiles are managed dynamically, allowing users to navigate through selection cards and roll trays using arrow keys, rather than tabs.
            </p>
            <p>
              <strong>Text-Size Scaling</strong>: Low-light environments are common at board game nights. The settings panel includes a dedicated text sizing preference (Small, Large, Maximum) that scales interface labels globally, aiding legibility.
            </p>
            <p>
              <strong>Screen Reader Announcements</strong>: The roll breakdown utilizes ARIA live regions (<code>aria-live="polite"</code>) to instantly announce the final roll total and modifiers, allowing visually impaired players to participate seamlessly.
            </p>
          </div>

          <h3 class="type-case-subsection pt-4">Performance Tuning &amp; &ldquo;No 3D Mode&rdquo;</h3>
          <p class="type-case-lead">
            A key design-engineering constraint was managing battery consumption during extended sessions.
          </p>
          <div class="space-y-4 type-case-body-lg">
            <p>
              To address this, I implemented a dedicated <strong>No 3D Mode</strong> bypass. Enabling this option disables the WebGL renderer and Rapier3D physics entirely. Roll calculations are completed instantly in JavaScript and displayed via simple, styled text cards.
            </p>
            <p>
              When 3D is active, the app supports <strong>Graphics Quality Tiers</strong> (Low, Medium, High). Low-quality mode reduces shadow resolutions, disables anti-aliasing, and caps the physics engine step rate, ensuring older devices can roll without overheating.
            </p>
            <p>
              Additionally, local session state is cached in IndexedDB (via <code>idb-keyval</code>) alongside a local session service to allow offline PWA support, ensuring rolls are stored and functional even during poor cellular coverage in game rooms.
            </p>
          </div>

          <!-- Video Demo Desktop -->
          <div class="my-6">
            <CaseLazyImage
              class="device-macbook-wrapper"
              :loader="rollDesktopLoader"
              alt="Video demonstrating dice selection and roll physics animation on a desktop viewport"
              caption="Desktop Roll Demo — Scaled interface showing 3D dice trajectories, collisions, and scoreboard updates"
              video
            />
          </div>

          <h3 class="type-case-subsection pt-4">Tech Stack</h3>
          <p class="type-case-body-lg">
            The project utilizes a high-performance React frontend coupled with WebGL physics and a serverless Supabase backend:
          </p>
          <div class="case-insight-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            <CaseInsight stat="Frontend Architecture" statLabel="React 19 · TypeScript · Vite · Tailwind v4" theme="after">
              <p class="type-case-body">Modern React stack utilizing Tailwind CSS v4's compiler for styling. Roving focus and accessibility are built using Radix UI primitives.</p>
            </CaseInsight>
            <CaseInsight stat="3D Physics Simulation" statLabel="React Three Fiber · Rapier3D · WASM" theme="after">
              <p class="type-case-body">WebGL rendering driven by Three.js. Realistic rigid-body physics collisions are calculated via a Rapier3D WebAssembly instance, copied during post-installation.</p>
            </CaseInsight>
            <CaseInsight stat="State Management" statLabel="Zustand · idb-keyval" theme="after">
              <p class="type-case-body">Zustand handles global dice tray counts, modifiers, roll results, and settings. IndexedDB handles local session backups to guarantee offline support.</p>
            </CaseInsight>
            <CaseInsight stat="Monetization & Backend" statLabel="Supabase · Vercel · Stripe API" theme="after">
              <p class="type-case-body">Supabase Postgres database handles user accounts, purchases, and settings sync. Vercel Serverless Functions process Stripe payment webhooks for custom dice skins.</p>
            </CaseInsight>
          </div>
          
          <div class="my-8">
            <CaseImage
              class="device-macbook-wrapper"
              :src="desktopImg"
              alt="Desktop interface of Online Dice Simulator showing multiple green and grey dice rolling on a 3D board alongside a sidebar settings menu"
              caption="Desktop Layout — Wide viewport showcasing settings panel, graphics toggles, and roll histories"
            />
          </div>
        </section>

        <!-- ─── PRODUCT DECISIONS ─── -->
        <section class="space-y-6">
          <h2 class="type-case-section">Product Decisions</h2>
          <p class="type-case-lead">
            Product success depended on key decisions around <strong>distribution</strong>, <strong>monetization</strong>, and <strong>organic viral growth</strong>.
          </p>
          <div class="space-y-4 type-case-body-lg">
            <h3 class="type-case-subsection">Distribution: PWA Webapp Over Native Stores</h3>
            <p>
              To maximize adoption in a social, physical game setting, I opted to build a Progressive Web App (PWA) distributed directly via the web rather than native iOS or Android app stores. During a game night, the loop and friction of navigating to an app store, authenticating, and downloading a native app acts as a massive barrier to spontaneous adoption.
            </p>
            <p>
              By offering a lightweight, zero-install mobile website that players can run instantly with a URL or QR code, the tool fits seamlessly into the game setup. Making it a PWA allows players to optionally "Add to Home Screen" to run it in a clean, borderless window. Since other tabletop utilities (like character managers or rule lookups) are web-based, web distribution aligns with the players' existing digital habits.
            </p>

            <h3 class="type-case-subsection">Monetization: Micro-SKUs &amp; Donations over Ads</h3>
            <p>
              When evaluating monetization, I rejected banner/interstitial ads entirely. Ads disrupt the flow and immersion of tabletop gaming sessions, leading to a cheap, annoying user experience that drives players away.
            </p>
            <p>
              Instead, I observed that players who enjoyed the utility were highly willing to support the project via voluntary donations (Ko-fi tips of $5 or $10). Because the donation conversion rate was healthy, it supported a clean, ad-free experience.
            </p>
            <p>
              To complement donations, I introduced super micro-SKUs: 49-cent cosmetic custom dice skins (Royale Purple, Lava Swirl, Malachite, etc.). Because it was extremely low effort for me to model and render new skins in Blender, this cosmetic personalization model allowed high-margin, low-complexity monetization without introducing user friction.
            </p>

            <h3 class="type-case-subsection">Growth Loops: Organic Posts, Game Clubs, &amp; GM Champions</h3>
            <p>
              Growth was completely organic and hyper-focused. Rather than investing in paid advertisements, users were acquired through targeted organic posts in board gaming and roleplaying subreddits and Discord channels.
            </p>
            <p>
              To bridge the physical-to-digital gap, I distributed physical cards with printed <strong>QR codes in local games clubs and cafes</strong>. Players could scan the code and roll immediately without leaving their seats.
            </p>
            <p>
              Additionally, by targeting Game Masters (GMs) and convincing them to recommend the app to their tables—often because it solved the slow reporting and math stalling issues—we established a natural word-of-mouth referral network. GMs acted as micro-influencers, introducing the tool to 4 to 6 new players per campaign.
            </p>
          </div>
        </section>

      </div>

      <!-- Table of Contents Sidebar -->
      <div class="toc-sidebar-column hidden xl:block xl:col-span-3 xl:col-start-10 relative">
        <div class="toc-sidebar-sticky">
          <TableOfContents />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ─── DEVICE MOCKUP WRAPPERS ─── */

/* Mobile Phone Screenshot Frame (Sleek Notchless Android) */
.device-iphone-wrapper :deep(.case-image__trigger),
.device-iphone-wrapper :deep(.case-loop__trigger),
.device-iphone-wrapper :deep(.case-lazy-image__placeholder),
.device-iphone-wrapper :deep(.case-loop__placeholder) {
  position: relative;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  border: 10px solid var(--color-border-heavy, #222);
  border-radius: 36px;
  background: #000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.device-iphone-wrapper :deep(.case-image__trigger),
.device-iphone-wrapper :deep(.case-loop__trigger) {
  margin-bottom: 16px; /* Spacing between mockup and caption */
}

.device-iphone-wrapper :deep(img),
.device-iphone-wrapper :deep(video) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 26px;
  border: none !important;
}

/* iPad Tablet Screenshot Frame */
.device-ipad-wrapper :deep(.case-image__trigger),
.device-ipad-wrapper :deep(.case-loop__trigger),
.device-ipad-wrapper :deep(.case-lazy-image__placeholder),
.device-ipad-wrapper :deep(.case-loop__placeholder) {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border: 18px solid var(--color-border-heavy, #222);
  border-radius: 28px;
  background: #000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 0 4px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.device-ipad-wrapper :deep(.case-image__trigger),
.device-ipad-wrapper :deep(.case-loop__trigger) {
  margin-bottom: 16px; /* Spacing between mockup and caption */
}

.device-ipad-wrapper :deep(img),
.device-ipad-wrapper :deep(video) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: none !important;
}

/* MacBook Desktop Screenshot Frame */
.device-macbook-wrapper {
  position: relative;
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

.device-macbook-wrapper :deep(.case-image__trigger),
.device-macbook-wrapper :deep(.case-loop__trigger),
.device-macbook-wrapper :deep(.case-lazy-image__placeholder),
.device-macbook-wrapper :deep(.case-loop__placeholder) {
  position: relative;
  border: 12px solid #1c1c1d;
  border-bottom: 0;
  border-radius: 16px 16px 0 0;
  background: #000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 24px; /* reserve space for absolute lip below + spacing */
  overflow: visible; /* show lip outside */
}

.device-macbook-wrapper :deep(.case-image__trigger)::after,
.device-macbook-wrapper :deep(.case-loop__trigger)::after {
  content: '';
  display: block;
  height: 12px;
  background: linear-gradient(to bottom, #747477 0%, #48484a 100%);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 100%;
  left: -12px;
  right: -12px;
  z-index: 10;
}

.device-macbook-wrapper :deep(.case-image__trigger)::before,
.device-macbook-wrapper :deep(.case-loop__trigger)::before {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 70px;
  height: 6px;
  background: #2a2a2c;
  border-radius: 0 0 6px 6px;
  z-index: 11;
}

.device-macbook-wrapper :deep(img),
.device-macbook-wrapper :deep(video) {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0;
  border: none !important;
}
</style>
