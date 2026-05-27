<script setup lang="ts">
import { ref } from 'vue';
import ProjectHero from '../components/ProjectHero.vue';
import CaseImage from '../components/CaseImage.vue';
import CaseLazyImage from '../components/CaseLazyImage.vue';
import { rocksmithLazyMedia } from '../assets/case-studies/rocksmithLazyMedia';
import VideoEmbed from '../components/VideoEmbed.vue';
import CaseMetric from '../components/CaseMetric.vue';
import CaseInsight from '../components/CaseInsight.vue';
import CaseTestimonialCard from '../components/CaseTestimonialCard.vue';
import TableOfContents from '../components/TableOfContents.vue';
import { useCaseStudySketchPanels } from '../composables/useCaseStudySketchPanels';

// Rocksmith Assets
import traditionalRocksmith from '../assets/images/rocksmith/executive-summary/000_traditional-rocksmith.webp';
import rocksmithMobile from '../assets/images/rocksmith/executive-summary/001_rocksmith-mobile.webp';
import challengeGraphic from '../assets/images/rocksmith/context/002_challenge-2.png';
import outcomeGraphic from '../assets/images/rocksmith/context/003_outcome-2.png';
import outcomeAward from '../assets/images/rocksmith/context/004_outcome-1-2.png';
import kitchenContext from '../assets/images/rocksmith/research/005_rocksmith-kitchen-context.webp';
import simpleSetup from '../assets/images/rocksmith/research/008_rocksmith-simple-setup-2.webp';
import complexSetup from '../assets/images/rocksmith/research/009_rocksmith-complex-setup-2.webp';
// Gallery images
import gallery1 from '../assets/images/rocksmith/solution/010_img-20251109-wa0002-2-thumbnail.webp';
import gallery2 from '../assets/images/rocksmith/solution/011_img-20251109-wa0009-2-thumbnail.webp';
import gallery3 from '../assets/images/rocksmith/solution/012_img-20251109-wa0006-2-thumbnail.webp';
import gallery4 from '../assets/images/rocksmith/solution/013_img-20251109-wa0011-2-thumbnail.webp';
import gallery5 from '../assets/images/rocksmith/solution/014_img-20251109-wa0004-2-thumbnail.webp';
import gallery6 from '../assets/images/rocksmith/solution/015_img-20251109-wa0010-2-thumbnail.webp';
import gallery7 from '../assets/images/rocksmith/solution/016_img-20251109-wa0005-thumbnail.webp';
import gallery8 from '../assets/images/rocksmith/solution/017_img-20251109-wa0012-2-thumbnail.webp';
// Solution
import comparisonRocksmith from '../assets/images/rocksmith/solution/020_frame-8.webp';
import gpdWin4 from '../assets/images/rocksmith/solution/022_r-on-gpd-win4.webp';
import accessibilityScale from '../assets/images/rocksmith/solution/023_img-20251109-wa0022.jpg';
import marketingOnHand from '../assets/images/rocksmith/solution/024_ubdc-newsheader-960x540-us.jpg';
import cognitiveLoad from '../assets/images/rocksmith/solution/025_img-0492.webp';
import interactionMatrix from '../assets/images/rocksmith/solution/026_interaction-matrix-abstraction.png';
import inputSystem from '../assets/images/rocksmith/solution/027_input-system.webp';
import mobileComponent from '../assets/images/rocksmith/solution/028_mobile-componenet-r-2.webp';
import nestedScroll from '../assets/images/rocksmith/solution/031_nested-scroll-4.png';
import nestedScrollSolution from '../assets/images/rocksmith/solution/032_nested-scroll-solution-trial-1-4.webp';
import guitarController from '../assets/images/rocksmith/solution/033_guitar-controller-1-2.webp';
import scrollAmbiguity from '../assets/images/rocksmith/solution/035_r-scroll-ambiguity.webp';
import controlSchemeConsole from '../assets/images/rocksmith/solution/038_rocksmith-screenshot-2025-12-24-07-50-27-43.webp';
import controlSchemeDesktop from '../assets/images/rocksmith/solution/039_rocksmith-screenshot-2025-12-24-09-01-25-06.webp';

// Accessibility Colorblind Profiles
import accessibilityColorblind1 from '../assets/images/rocksmith/accessibility/img-20251109-wa0014-2.webp';
import accessibilityColorblind2 from '../assets/images/rocksmith/accessibility/img-20251109-wa0017-3.webp';
import accessibilityColorblind3 from '../assets/images/rocksmith/accessibility/img_0459-1.webp';
import accessibilityColorblind4 from '../assets/images/rocksmith/accessibility/img_0460-1.webp';

const caseStudyRoot = ref<HTMLElement | null>(null);
useCaseStudySketchPanels(caseStudyRoot);
</script>

<template>
  <div ref="caseStudyRoot" class="animate-fade-in pb-24 relative">
    <div class="case-study-layout xl:grid xl:grid-cols-12 xl:gap-8 w-full max-w-7xl mx-auto px-6 xl:px-0">
      <!-- Main Content Container -->
      <div class="case-study-main xl:col-span-8 xl:col-start-1 min-w-0">
    <!-- ─── HERO ─── -->
    <div class="relative">
      <!-- Decorative Alchemist Etching -->
      <svg class="absolute right-0 top-0 opacity-10 pointer-events-none w-64 h-64 text-[var(--color-accent)] mix-blend-screen transform translate-x-1/4 -translate-y-1/4" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="0.5">
        <polygon points="50,10 90,90 10,90" stroke-dasharray="2 4" />
        <circle cx="50" cy="65" r="25" />
        <path d="M 20 40 Q 50 10 80 40 T 50 90 Z" />
        <circle cx="50" cy="50" r="45" stroke-dasharray="1 6" />
      </svg>
      
      <ProjectHero
      title="Making guitar learning accessible to 1 million users"
      description="Releasing a new learning game on 5 platforms with a single, scalable UI system."
      role="UX Lead for Mobile & Multi-platform Interactions"
      timeline="~2 Years"
      :tags="['PC Game', 'Console Game', 'Accessibility']"
    >
      <template #team>
        <p class="type-case-team">UX Director &middot; 2 UX Designers &middot; 2 UI Artists &middot; 2 UI Engineers</p>
      </template>
    </ProjectHero>
    </div>

    <!-- ─── EXECUTIVE SUMMARY ─── -->
    <section class="panel-recessed--no-pencil-frame noise-overlay case-study-panel">
      <h2 class="type-case-section-accent">Executive Summary</h2>
      <div class="case-study-panel__metric-grid">
        <CaseMetric value="5" label="Platforms" />
        <CaseMetric value="1" label="UI System" />
      </div>
      <div class="case-study-panel__body type-case-body-lg">
        <div>
          <h4 class="type-case-kicker mb-2">01. The Problem</h4>
          <p><strong>Fragmentation:</strong> Rocksmith+ faced a massive scaling challenge: launching a PC-first MVP on Mobile and Console simultaneously. Without a unified framework, the team faced alienating users whose context would switch based on a device and burdening triple the maintenance cost for maintaining all the platforms.</p>
        </div>
        <div>
          <h4 class="type-case-kicker mb-2">02. The Solution</h4>
          <p><strong>Building a responsive UI system:</strong> I architected a technical UI system in the Snowdrop engine that scaled responsive UI across different PC monitors, TVs, tablets, and mobiles. This <strong>ensured visual parity</strong> across devices ranging from 4:3 iPads to 21:9 Ultra-wide monitors without bespoke adjustments.</p>
          <p class="mt-4"><strong>Unified Input Philosophy:</strong> Mapped divergent inputs (Keyboard, Gamepad, Touch) to singular behavioral outcomes, <strong>reducing cognitive load</strong> for users switching between platforms.</p>
          <p class="mt-4"><strong>Driving Global Collaboration:</strong> Orchestrated design collaboration between India, Japan, and the US <strong>to share user insights and create a holistic understanding of user needs across all platforms.</strong></p>
        </div>
      </div>
      <!-- Before/After context -->
      <div class="space-y-4">
        <p class="type-case-body">This was the legacy Rocksmith experience — on a big screen with lots of space, with no choice except an expensive desktop or a game console.</p>
        <CaseImage :src="traditionalRocksmith" alt="Traditional Rocksmith experience" caption="The traditional Rocksmith experience was always on a big screen" imgClass="w-full h-auto rounded-xl" />
        <p class="type-case-body">Rocksmith+ gave users the option to learn guitar anywhere they wanted, on any device they wanted with 1 subscription. This unlocked a whole new segment of millions of users.</p>
        <CaseImage :src="rocksmithMobile" alt="New Rocksmith+ mobile experience" caption="The new Rocksmith+ experience" imgClass="w-full h-auto rounded-xl" />
      </div>
    </section>

    <!-- ─── CONTEXT ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Context</h2>
      <div class="space-y-8">
        <p class="type-case-lead">
          I joined the team in 2020 when Rocksmith+ was in pre-launch production and <strong>Ubisoft wanted a global release on mobile, PC, and next-gen game consoles</strong> (PlayStation 5 and Xbox Series X). Very few people on the UX team had prior experience building mobile user experiences and responsive UIs and interactions for multiple platforms.
        </p>
        <p class="type-case-body-lg">
          The MVP for Rocksmith+ was also built only for PC. My goal was to deliver it on Mobile and Tablets in addition to Consoles to invite a whole new audience of guitar learners from around the globe.
        </p>
        <CaseImage :src="challengeGraphic" alt="Challenges faced" caption="The challenges I faced at the start" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="outcomeGraphic" alt="Outcomes achieved" caption="And drove to these outcomes" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="outcomeAward" alt="Accessibility award" imgClass="w-full h-auto rounded-xl max-w-xs mx-auto" />
      </div>
    </section>

    <!-- ─── RESEARCH ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Research</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          The first piece of work started with extensive user testing. I requested internal and external volunteers to play a crude, ported version of the PC game on iPad without any scaling and no interactions except simple taps. <strong>My first few initial tests were to discover how people set up a portable device compared to playing on a PC or a TV</strong> to understand the context and environment in which Rocksmith+ would be experienced.
        </p>
        <p class="type-case-body-lg">The tests gleaned insights using three primary methods:</p>
        <ol class="list-decimal pl-5 space-y-2 type-case-body">
          <li>Observational studies and contextual interviews with internal and external volunteers (4–6 waves with panels sized 12–15)</li>
          <li>Diary Studies to see if and how user needs evolved as users went from beginners to power users (10 users)</li>
          <li>Surveys after each playtest to track key success signals via ability to learn on mobile as compared to PC, satisfaction of experience, and NPS surveys</li>
        </ol>
        <p class="type-case-body-lg">
          Throughout virtual and in-person testing sessions I made notes of various environments users learn guitar in:
        </p>
        <ol class="list-decimal pl-5 space-y-2 type-case-body">
          <li>Placing their phone on various physical contexts ranging from kitchen countertops to dedicated desks</li>
          <li>Plugging in their guitars into a myriad of equipment — from pedals to headphones so a parent can practice without disturbing the children</li>
          <li>Placing devices at different distances to have room to play their instruments</li>
        </ol>

        <!-- Context photos -->
        <CaseImage :src="kitchenContext" alt="Kitchen counter setup" caption="A setup showcasing the use of a kitchen counter and an iPad" imgClass="w-full h-auto rounded-xl max-w-md mx-auto" />
        <CaseLazyImage :loader="rocksmithLazyMedia.userContext" alt="User context with notes" caption="A user showing a mixture of physical note taking in their general context" img-class="w-full h-auto rounded-xl" />
        <CaseLazyImage :loader="rocksmithLazyMedia.outdoorsContext" alt="Outdoor setup" caption="One user wanted to push the limits of where they could learn" img-class="w-full h-auto rounded-xl" />

        <p class="type-case-body-lg">Another important highlight was the amount of personalisation needed:</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CaseImage :src="simpleSetup" alt="Simple user setup" caption="A simple user — acoustic guitar and just the device" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="complexSetup" alt="Complex user setup" caption="A hardcore user — electric bass, 2+ musical accessories, and an iPad" imgClass="w-full h-auto rounded-lg" />
        </div>

        <!-- Research statistics -->
        <div class="case-insight-grid grid grid-cols-1 md:grid-cols-2">
          <CaseInsight stat="~90%" statLabel="potential new users" theme="neutral">
            <p>Wanted a hassle-free and wireless experience.</p>
          </CaseInsight>
          <CaseInsight stat="~5%" statLabel="of total responders" theme="neutral">
            <p>Wanted a hardcore experience with all their gear. <em>77% of these were legacy Rocksmith users.</em></p>
          </CaseInsight>
        </div>

        <p class="type-case-body-lg">
          We also included questions related to eyesight. I wanted to know how many users suffered from eyesight issues including near/far sightedness and colour vision deficiency. <strong>I personally suffer from near sightedness and colour vision deficiency which impassioned my desire for an accessible UI.</strong>
        </p>
        <div class="case-insight-grid grid grid-cols-1 md:grid-cols-2">
          <CaseInsight stat="~63%" statLabel="of total responders" theme="neutral">
            <p>Suffered from at least 1 eyesight issue.</p>
          </CaseInsight>
          <CaseInsight stat="~31%" statLabel="of total responders" theme="neutral">
            <p>Suffered from either near or far sightedness.</p>
          </CaseInsight>
        </div>

        <!-- Multi-device insights -->
        <p class="type-case-body-lg">
          I wanted to know how many contexts the general user stories would have and how many devices a user imagined themselves playing on.
        </p>
        <div class="case-insight-grid grid grid-cols-1 md:grid-cols-3">
          <CaseInsight stat="87%" statLabel="correlation" theme="neutral">
            <p>Between size of device and complexity of setup.</p>
          </CaseInsight>
          <CaseInsight stat="~63%" statLabel="of responders" theme="neutral">
            <p>Could see themselves using more than 2 devices, but not more than 2 setups.</p>
          </CaseInsight>
          <CaseInsight stat="~92%" statLabel="of new learners" theme="neutral">
            <p>Said they would start with acoustic guitars and mobile phones.</p>
          </CaseInsight>
        </div>

        <p class="type-case-body-lg">
          <strong>What I quickly realised was that the UI cannot be one size fits all for these many user segments.</strong> Users need tons of customisability to change the experience to their needs:
        </p>
        <ol class="list-decimal pl-5 space-y-2 type-case-body">
          <li>The ability to zoom in and zoom out on the guitar lessons based on device distance</li>
          <li>The ability to scale the UI so that buttons are bigger if the device is farther away</li>
          <li>Other less frequently used but important controls such as changing field of view</li>
        </ol>
      </div>
    </section>

    <!-- ─── SOLUTION: RESPONSIVE UI ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Responsive UI</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          I first began with working on a core responsive UI that would offer the base experience on all devices. It involved not only designing and validating layouts in Figma, but also working closely with UI engineers to build appropriate tools:
        </p>
        <ol class="list-decimal pl-5 space-y-2 type-case-body">
          <li>UI component anchoring and scaling so that UI elements know exactly where to stay on the hundreds of devices (TVs, monitors, tablets, and phones of up to 8 standard aspect ratio configurations)</li>
          <li>Aspect ratio based scaling rules — percentage based scaling to maintain consistency without too many breakpoints</li>
          <li>Aspect ratio break point table for bespoke rules for brackets of devices</li>
        </ol>

        <!-- 3D to 2D system -->
        <p class="type-case-body-lg">
          <strong>The tricky part was making 3D objects in the UI responsive.</strong> I worked very closely with the UI engineers to develop a custom system where an anchor point and multiple boundary points were projected from the 2D screen into 3D space. The camera adjusted so that the 3D point was placed perfectly where the 2D point was supposed to be on screen.
        </p>
        <p class="type-case-body-lg">
          <strong>It would automatically know how much to zoom in or out and how to move left and right</strong> to make sure all the 3D objects appeared at the correct places on the screen no matter the aspect ratio and screen resolution. <strong>The MVP achieved usable display results on all 5 target aspect ratios encompassing 90% of expected devices out of the box.</strong>
        </p>

        <CaseLazyImage :loader="rocksmithLazyMedia.threeDto2dDiagram" alt="3D to 2D coordinate system diagram" caption="Converting a 3D object into 2D coordinates, then applying responsive UI component rules, and making the 3D object adjust on different screens" img-class="w-full h-auto rounded-xl" />

        <CaseLazyImage :loader="rocksmithLazyMedia.comparisonOther" alt="Other games UI overlap issue" caption="You can see the overlap between 2D and 3D elements when the screen becomes narrower in other games. Fun fact — this is exactly why many games put their characters in the center of the screen" img-class="w-full h-auto rounded-xl" />
        <CaseImage :src="comparisonRocksmith" alt="Rocksmith+ no overlap" caption="Because the 3D element is effectively treated as a 2D element, it adjusts without any special rules when playing on phones or tablets" imgClass="w-full h-auto rounded-xl" />

        <CaseLazyImage :loader="rocksmithLazyMedia.responsiveUi" alt="Responsive UI in action" caption="The new UI was responsive in runtime without any overlapping of 3D and 2D elements" img-class="w-full h-auto rounded-xl" />

        <VideoEmbed src="https://www.youtube.com/embed/AvvCJ_hIMjo" title="Responsive UI Live Test" />
        <p class="type-case-caption text-center">Live test demonstrating the 3D-to-2D anchoring system, ensuring all elements remain legible and correctly positioned</p>

        <CaseImage :src="gpdWin4" alt="Rocksmith on GPD Win4" caption="Fun fact — the UI system worked so well that one user got it working on their GPD Win4 handheld gaming machine" imgClass="w-full h-auto rounded-xl max-w-sm mx-auto" />

        <!-- Testing gallery -->
        <h3 class="type-case-subsection pt-4">User Testing Gallery</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <CaseImage :src="gallery1" alt="User testing photo 1" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery2" alt="User testing photo 2" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery3" alt="User testing photo 3" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery4" alt="User testing photo 4" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery5" alt="User testing photo 5" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery6" alt="User testing photo 6" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery7" alt="User testing photo 7" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="gallery8" alt="User testing photo 8" imgClass="w-full h-auto rounded-lg" />
        </div>
      </div>
    </section>

    <!-- ─── ACCESSIBILITY ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Accessibility &amp; UI Scaling</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          Accessibility was a core tenet of the experience. <strong>One of the first accessibility features we developed was allowing users to modify the scale of their UI</strong> to fine tune their mobile and tablet experience based on how far they kept their device. The distance between user and device changed heavily based on skill level, instrument type, and physical setup.
        </p>
        <CaseImage :src="accessibilityScale" alt="UI scaling in action" caption="Users could customise UI scale based on their distance from the device" imgClass="w-full h-auto rounded-xl" />
        <p class="type-case-body-lg">
          <strong>This customisation system was easy to build as my team had already worked on a dynamic system to make our 3D UI responsive.</strong> The original system, being built on solid technical foundations, meant that users could change their configuration at run time — whenever they wanted and however many times they wanted.
        </p>

        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CaseImage :src="accessibilityColorblind1" alt="Colorblind accessibility profile 1" imgClass="w-full h-auto rounded-xl object-cover" />
          <CaseImage :src="accessibilityColorblind2" alt="Colorblind accessibility profile 2" imgClass="w-full h-auto rounded-xl object-cover" />
          <CaseImage :src="accessibilityColorblind3" alt="Colorblind accessibility profile 3" imgClass="w-full h-auto rounded-xl object-cover" />
          <CaseImage :src="accessibilityColorblind4" alt="Colorblind accessibility profile 4" imgClass="w-full h-auto rounded-xl object-cover" />
        </div>
      </div>
    </section>

    <!-- ─── UNIFIED INPUT ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Unified Input System</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          Since one subscription of Rocksmith+ gave access on every platform, we expected users to use the app on multiple platforms — think Netflix. <strong>We needed consistent outcomes from the same input on different platforms.</strong>
        </p>
        <p class="type-case-body-lg">
          From all our extensive user studies, one thing was absolutely clear — <strong>users will only have one hand free as they had a guitar in the other.</strong> Whether a mouse, a game controller, or a touch screen, the entire interface had to be usable with only 1 hand.
        </p>
        <CaseImage :src="marketingOnHand" alt="One hand interface" imgClass="w-full h-auto rounded-xl max-w-xs mx-auto" />

        <!-- Research stats -->
        <div class="case-insight-grid grid grid-cols-1 md:grid-cols-2">
          <CaseInsight stat="86%" statLabel="of participants" theme="neutral">
            <p>Wished the interactions were similar to Netflix or Spotify on mobile.</p>
          </CaseInsight>
          <CaseInsight stat="16%" statLabel="of participants" theme="neutral">
            <p>Used Netflix or Spotify on their console — we could learn from these apps but not rely on them for consoles.</p>
          </CaseInsight>
          <CaseInsight stat="72%" statLabel="of participants" theme="danger">
            <p>Found it difficult to move from mobile to console or PC due to lack of contextual input guides.</p>
          </CaseInsight>
          <CaseInsight stat="47%" statLabel="of participants" theme="danger">
            <p>Failed to recreate contextual outcomes (e.g., hovering for tooltips) when switching platforms.</p>
          </CaseInsight>
        </div>

        <p class="type-case-body-lg">
          <strong>Since users were occupied with guitar chords and memorising complex techniques, it made no sense to add the cognitive load of also learning how to interact with this app on multiple platforms.</strong>
        </p>
        <CaseImage :src="cognitiveLoad" alt="Cognitive load problem" caption="The user knows what they want, but how do they recreate it on a different platform?" imgClass="w-full h-auto rounded-xl" />

        <!-- Interaction Matrix -->
        <p class="type-case-body-lg">
          <strong>I created a 3-dimensional interaction matrix that mapped outcome → component → action</strong> on each platform and conducted many surveys to build an exhaustive list of commonly mapped translations between interactions. For example, hovering with a mouse cursor on desktop was majorly translated as touch and hold for mobile users.
        </p>
        <CaseImage :src="interactionMatrix" alt="Interaction matrix abstraction" caption="A sample abstraction of the complex interaction matrix" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="inputSystem" alt="Unified input system" caption="How 3 different actions consistently lead to the same outcome on any platform" imgClass="w-full h-auto rounded-xl" />
        <div class="mt-8">
          <CaseInsight stat="80%" statLabel="average completion rate per user" theme="success">
            <p>Users could consistently achieve the same activities across platforms despite changing devices.</p>
          </CaseInsight>
        </div>
      </div>
    </section>

    <!-- ─── COMPONENT ADAPTATIONS ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Platform UI Adaptations</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          <strong>The original Rocksmith+ experience was built with only PC in mind</strong>, so many components had to undergo changes to be intuitive for mobile and console UI interactions. For example, on PC you scroll through a carousel by clicking arrows. On touch devices, you simply swipe.
        </p>
        <p class="type-case-body-lg">
          <strong>A large part of my role was making all these small changes to the global design system and its component libraries to improve intuitiveness on mobile, PC, and consoles.</strong>
        </p>
        <CaseImage :src="mobileComponent" alt="Mobile touch UI" caption="Touch focused UI rarely has arrows to scroll — the content extends slightly off-screen to hint at scrollability" imgClass="w-full h-auto rounded-xl" />
        <CaseLazyImage :loader="rocksmithLazyMedia.pcInteractions" alt="PC carousel interactions" caption="On PC, carousel carets are critical for horizontal scrolling with a mouse that usually only supports vertical scroll" img-class="w-full h-auto rounded-xl" />
        <CaseLazyImage :loader="rocksmithLazyMedia.mobileInteractions" alt="Mobile scroll interactions" caption="Mobile scroll containers support free form horizontal and vertical scroll without buttons" img-class="w-full h-auto rounded-xl" />
        <div class="mt-8">
          <CaseInsight stat="~90%" statLabel="of participants" theme="success">
            <p>Felt confident about the mobile UI because it looked similar to an app they already used (e.g., Netflix, Spotify).</p>
          </CaseInsight>
        </div>
      </div>
    </section>

    <!-- ─── CONSOLE NAVIGATION ─── -->
    <section class="space-y-8">
      <h2 class="type-case-section">Console Navigation Challenge</h2>
      <div class="space-y-8">
        <p class="type-case-body-lg">
          Another major issue <strong>I tackled was menu navigation for consoles.</strong> The original prototypes included expanders with nested scrolls to hide secondary information. While common on desktop and mobile, on consoles this created a major issue.
        </p>
        <CaseImage :src="nestedScroll" alt="Nested scroll problem" caption="An example of nested scroll — two scroll bars denoting independent scrollable containers" imgClass="w-full h-auto rounded-xl panel-recessed p-4" />
        <p class="type-case-body-lg">
          <strong>On consoles, you cannot independently focus on a separate item</strong> — all directional input is mapped to the item in focus. You can only scroll the expanded container all the way up till you reach the header to close it.
        </p>
        <p class="type-case-body-lg">
          <strong>My first gut reaction was to try mapping one stick for the nested container and the other for the root container.</strong>
        </p>
        <CaseImage :src="nestedScrollSolution" alt="Failed solution" caption="Mapping two sticks to two containers — a solution that failed" imgClass="w-full h-auto rounded-xl" />
        <p class="type-case-body-lg">This solution had 2 core problems:</p>
        <ol class="list-decimal pl-5 space-y-2 type-case-body">
          <li><strong>Not a natural pattern in video game menu UIs.</strong> No mainstream games use two sticks for two UI elements — not intuitive to users</li>
          <li><strong>One of our main goals was one-hand operation</strong> as the other hand holds a guitar. <strong>This pattern required 2 hands</strong></li>
        </ol>
        <CaseImage :src="guitarController" alt="Guitar + controller" caption="Having to put down the guitar to hold the controller with both hands was a no-go" imgClass="w-full h-auto rounded-xl max-w-sm mx-auto" />

        <!-- Final solution -->
        <p class="type-case-body-lg">
          Going back to the drawing board, a technical designer proposed using a <strong>two-axis design pattern — vertical axis for moving between components, horizontal axis for accessing information.</strong> I created multiple quick iterations in Figma to explore commonalities across platforms.
        </p>
        <CaseLazyImage :loader="rocksmithLazyMedia.skillsScroll" alt="Skills horizontal scroll" caption="Skills moved into a horizontal scroll — the first component to get this treatment" img-class="w-full h-auto rounded-xl" />

        <p class="type-case-body-lg">
          <strong>I worked very closely with a Senior Engineer on building consistent focusing in a two-axis interaction</strong> — whenever users would vertically scroll, the item closest to the current item in focus would gain focus.
        </p>
        <CaseImage :src="scrollAmbiguity" alt="Scroll ambiguity" caption="When you scroll up from here, what item do you expect to focus on?" imgClass="w-full h-auto rounded-xl" />
        <CaseLazyImage :loader="rocksmithLazyMedia.vertScroll" alt="Vertical scroll uniform" caption="Uniform grid — simply focus tile number 3 in the next row" img-class="w-full h-auto rounded-xl" />
        <CaseLazyImage :loader="rocksmithLazyMedia.vertScrollNonUniform" alt="Vertical scroll non-uniform" caption="Non-uniform grid — the focused element is closest in proximity to the previous element" img-class="w-full h-auto rounded-xl" />

        <p class="type-case-body-lg">
          When we specifically asked playtesting moderator "comparing to other main menus such as your console's game library, did you have any issues with the Rocksmith+ main menu?" — <strong>100% of results came in as "no"</strong>. This was a big success.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CaseImage :src="controlSchemeConsole" alt="Console control scheme" caption="Control scheme for consoles" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="controlSchemeDesktop" alt="Desktop control scheme" caption="Control scheme for desktop" imgClass="w-full h-auto rounded-lg" />
        </div>
      </div>
    </section>

    <!-- ─── RESULTS ─── -->
    <section class="panel-recessed--no-pencil-frame noise-overlay case-study-panel case-study-panel--loose">
      <h2 class="type-case-section-major">Result</h2>
      <div class="case-study-panel__body max-w-3xl mx-auto type-case-body-lg">
        <p>
          Rocksmith+ launched in open beta and swiftly followed a global launch in 2022. The mobile version was able to unlock a completely new market of on-the-go learners who did not have the money, time, or privilege of learning to play the guitar on a computer or a game console.
        </p>
        <p>
          The new and improved accessibility feature set also garnered critical acclaim when Rocksmith+ won the <a href="https://www.gamespress.com/en-US/Winners-of-the-GAconf-Accessibility-Awards-announced" target="_blank" rel="noopener noreferrer" class="underline font-bold text-accent hover:opacity-70 transition-opacity">Game's Accessibility Conference's award for Best physical / mobility accessibility</a>.
        </p>
      </div>
      <div class="case-study-panel__metric-grid">
        <VideoEmbed src="https://www.youtube.com/embed/YbmlRnlvNv0?si=m608xmR2kIS-eCED" title="User Testimonials" />
        <VideoEmbed src="https://www.youtube.com/embed/dQxzvH8Pl9E" title="Launch Trailer" />
      </div>
    </section>

    <!-- ─── LEARNINGS ─── -->
    <section class="max-w-4xl mx-auto space-y-6">
      <h2 class="type-case-section-block">Learnings</h2>
      <p class="type-case-body-lg">
        Working in a global team based out of San Francisco, Osaka, and Pune, I quickly learnt that project-wide impact on accessibility and a multi-device philosophy won't automatically result in a great product simply with my personal contributions. A large part of team alignment came from <strong>rooting discussion in user needs and coaching the team what a truly multi-device experience means</strong> — which included numerous coaching and workshop sessions on mobile interactions and games.
      </p>
      <p class="type-case-body-lg">
        This was further challenged by language and cultural barriers in the midst of COVID-19 which meant we had to take an approach of <strong>overcommunication and actively building interpersonal relationships.</strong> While I am extremely proud of the product we put out which helps millions of humans learn guitar at their own pace at an affordable price point, I am even more proud of the team culture we built that allowed people working on it to grow their careers and improve their skill sets.
      </p>
    </section>

    <!-- ─── TESTIMONIALS ─── -->
    <section>
      <h2 class="type-case-section-block mb-12">Testimonials</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <CaseTestimonialCard
          name="Hiroshi Ogawa"
          role="Lead UI Engineer, Ubisoft"
          quote="Bramha made the foundation of Multi-platform UI, which was one of the biggest challenges in the project. His knowledge and insight always pushed our discussion forward. A clear design-based dialogue was productive and helpful in the cross-studio project in Japan and India. I respect his courage to accept the change, which is UX/UI design's most challenging part of improving the game while managing our resources."
        />
        <CaseTestimonialCard
          name="Kaiwen Young"
          role="Director of User Experience, Ubisoft"
          quote="Bramha's passion, knowledge and communication style contributed greatly to the quality of our project and team UX culture."
        />
        <CaseTestimonialCard
          name="Rohit Suvarna"
          role="Senior Game Designer, Ubisoft"
          quote="Bramha has a deep understanding of how to design user interfaces that are intuitive, effective and visually appealing. He is also an expert in user experience research and knows how to use data to drive his designs."
        />
        <CaseTestimonialCard
          name="Utkarsh Bagade"
          role="Senior Engineer, Ubisoft"
          quote="Bramha's approach to designing complex game systems always put UX at the highest priority. I'm very impressed by his ability to understand the tech (tools and engine) and designing features that take advantage of the current frameworks and help improve them."
        />
      </div>
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
