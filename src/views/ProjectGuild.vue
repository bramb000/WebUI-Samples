<script setup lang="ts">
import ProjectHero from '../components/ProjectHero.vue';
import CaseImage from '../components/CaseImage.vue';
import VideoEmbed from '../components/VideoEmbed.vue';
import CaseMetric from '../components/CaseMetric.vue';
import CaseInsight from '../components/CaseInsight.vue';
import CaseBeforeAfter from '../components/CaseBeforeAfter.vue';

// Guild of Guardians Assets
import challengeGraphic from '../assets/images/guild/context/000_challenge-graphic-1.png';
import outcomeGraphic from '../assets/images/guild/context/001_outcome-2-2.png';
import kShapeProblem from '../assets/images/guild/tldr/010_k-shape-problem.png';
import persona from '../assets/images/guild/tldr/011_persona-3.png';
import gameLoopNegative from '../assets/images/guild/tldr/012_game-loop-negative-2.png';
import gameLoopPositive from '../assets/images/guild/tldr/013_game-loop-positive.png';
import wireframeFlow from '../assets/images/guild/tldr/014_frame-68.png';
import handSketches from '../assets/images/guild/tldr/015_img-0528-1.png';
import afkTest1 from '../assets/images/guild/tldr/016_afk-rewards-test-1-thumbnail.webp';
import afkTest2 from '../assets/images/guild/tldr/017_afk-rewards-test-2-thumbnail.webp';
import wireframe from '../assets/images/guild/tldr/018_wireframe.png';
import afkMockupFinal from '../assets/images/guild/tldr/019_frame-23.png';
import afkMockupRough from '../assets/images/guild/tldr/020_frame-20.png';
import chestLoop from '../assets/images/guild/tldr/021_fullchestloop-ezgif-com-video-to-gif-converter.gif';
import chestFill from '../assets/images/guild/tldr/022_0112-ezgif-com-optimize.gif';
import afkTutorial from '../assets/images/guild/tldr/023_afk-tutorial.png';
import floatingBadge from '../assets/images/guild/tldr/024_floatingactionbutton-ezgif-com-optimize-2.gif';
import userFlowFigma from '../assets/images/guild/tldr/025_figma-user-flow-2.png';
import surveyEnjoyment from '../assets/images/guild/tldr/026_screenshot-2026-01-10-075400-2.png';
import surveyTimers from '../assets/images/guild/tldr/027_timer-survey-question.png';
import exitScreenBefore from '../assets/images/guild/tldr/028_screenshot-20251215-083431-guild-of-guardians.png';
import exitScreenAnim from '../assets/images/guild/tldr/029_figma-e1njfafc8a.gif';
import exitScreenAfter from '../assets/images/guild/tldr/030_figma-e1njfafc8a-1-1.png';
import playerDropoff from '../assets/images/guild/tldr/031_graph-of-players-attempting-and-quitting.png';
import guardianUsageData from '../assets/images/guild/tldr/032_guardian-usage-data.png';
import recommendedWireframe from '../assets/images/guild/tldr/033_recommended-heroes-2.png';
import recsBeforeImg from '../assets/images/guild/tldr/034_screenshot-20250828-080318-guild-of-guardians-2-thumbnail.webp';
import recsAfterImg from '../assets/images/guild/tldr/035_screenshot-20251105-150237-guild-of-guardians-2-thumbnail.webp';
import progressionWireframe from '../assets/images/guild/tldr/036_visual-progression.png';
import progBeforeImg from '../assets/images/guild/tldr/037_screenshot-20250915-114738-guild-of-guardians-thumbnail.webp';
import progAfterImg from '../assets/images/guild/tldr/038_screenshot-20251105-150223-guild-of-guardians-1-thumbnail.webp';
import dailyCalendar from '../assets/images/guild/tldr/039_screenshot-20251210-075732-guild-of-guardians.png';
import legendaryHero from '../assets/images/guild/tldr/040_image-3.png';
import oldOffer from '../assets/images/guild/tldr/041_screenshot-20251117-090321-guild-of-guardians.png';
import newOffer from '../assets/images/guild/tldr/042_new-offer.png';
import offerWireframe from '../assets/images/guild/tldr/043_image-5.png';
import offerIteration2 from '../assets/images/guild/tldr/044_image-6.png';
import offerIteration3 from '../assets/images/guild/tldr/045_image-4.png';
import smootherBellCurve from '../assets/images/guild/result/046_smoother-bell-curve.png';
import retentionGrowth from '../assets/images/guild/result/047_retention-growth-2.png';
// Before/After gallery
import galBeforeGoal from '../assets/images/guild/tldr/002_screenshot-20250915-114738-guild-of-guardians-2-thumbnail.webp';
import galAfterGoal from '../assets/images/guild/tldr/003_screenshot-20251105-150223-guild-of-guardians-1-2-thumbnail.webp';
import galBeforeOffer from '../assets/images/guild/tldr/004_screenshot-20251117-090321-guild-of-guardians-thumbnail.webp';
import galAfterOffer from '../assets/images/guild/tldr/005_new-offer-thumbnail.webp';
import galBeforeRecs from '../assets/images/guild/tldr/006_screenshot-20250828-080318-guild-of-guardians-thumbnail.webp';
import galAfterRecs from '../assets/images/guild/tldr/007_screenshot-20251105-150237-guild-of-guardians-thumbnail.webp';
import galBeforeAnticipation from '../assets/images/guild/tldr/008_screenshot-20251215-083431-guild-of-guardians-thumbnail.webp';
import galAfterAnticipation from '../assets/images/guild/tldr/009_figma-e1njfafc8a-1-1-thumbnail.webp';
</script>

<template>
  <div class="animate-fade-in space-y-24 pb-24">
    <!-- ─── HERO ─── -->
    <ProjectHero
      title="AFK Rewards for Guild of Guardians"
      description="How data-driven UX design increased D7 retention by 25% and D7 LTV by 12% for a live mobile RPG."
      role="Feature Owner & Lead UX Designer"
      timeline="Multiple Months"
      :tags="['Mobile RPG', 'Data Analysis', 'Feature Design', 'Live Product']"
    >
      <template #team>
        <p class="font-serif text-lg">1 UI Artist | 1 UI Engineer | 1 Full Stack Engineer</p>
      </template>
    </ProjectHero>

    <!-- ─── EXECUTIVE SUMMARY ─── -->
    <section class="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-12 rounded-3xl space-y-8 shadow-sm">
      <h2 class="text-3xl font-serif font-bold">Executive Summary</h2>
      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        <CaseMetric value="+25%" label="Retention (D7)" theme="success" />
        <CaseMetric value="+12%" label="Revenue (D7 LTV)" theme="success" />
      </div>
      <div class="space-y-6 text-lg font-sans leading-relaxed opacity-90">
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 mb-2">01. The Problem</h4>
          <p>The game suffered from a lower than standard D7 retention. Users reported that they needed to play 3-4 times a day to maximise their progression when most users only had time to play 1-2 times a day, creating an ill fit for user lifestyle needs.</p>
        </div>
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 mb-2">02. The Data</h4>
          <p>Using SQL (BigQuery), I identified that the most engaged users were pulling the average session/day metric up and that the average experience felt worse to most users compared to what the dashboards indicated. Most users were playing once a day and therefore lagging behind in a progression system that needed them to play 3 times a day for the best results.</p>
        </div>
        <div>
          <h4 class="text-sm font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-500 mb-2">03. The Solution</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li><strong>Shifting Player Emotions:</strong> Designed an "AFK Reward Feature" that accumulated rewards while the player was away, transforming the mental model from <em>"I'm missing out"</em> when not playing to <em>"I have a gift waiting for me."</em></li>
            <li><strong>Designing for Delight:</strong> Changing the game loop to reframe features that interrupted player focus to a loop that creates positive anticipation as a hook for long term retention.</li>
            <li><strong>End to end delivery:</strong> Designed supporting features — composition recommendation, daily login calendar, and free rewards for achievements to maximise D7 retention.</li>
            <li><strong>Bonus Win:</strong> Increase D7 LTV by 12% by surgically adding monetisation offers to new features.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ─── CONTEXT ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Context</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-xl font-sans leading-relaxed">
          <strong>Guild of Guardians is a squad RPG</strong> game where users create teams of 5 heroes to duke it out against monsters, enemies, and other players. In the first 7 to 10 days, the users are expected to play the Adventure mode where they explore the story, learn about the characters, and fight some easy monsters to learn about the game.
        </p>
        <p class="text-lg font-sans leading-relaxed">
          We had a problem — our D7 retention, the percent of players still continuing to play by the 7th day since they installed, was low. Which means we lost players who we spend lots of money to acquire, reducing the efficiency of our marketing budget.
        </p>
        <p class="text-lg font-sans leading-relaxed">
          On top of this, we did not have a dedicated data analyst and user researcher to help us figure out what is happening.
        </p>
        <CaseImage :src="challengeGraphic" alt="Challenge overview" caption="The challenges I set out to solve" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="outcomeGraphic" alt="Outcomes achieved" caption="And these outcomes were achieved" imgClass="w-full h-auto rounded-xl" />
      </div>
    </section>

    <!-- ─── ACTION: TLDR ─── -->
    <section class="max-w-4xl mx-auto space-y-6 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <h2 class="text-3xl font-serif font-bold">Action</h2>
      <h3 class="text-xl font-sans font-bold">TLDR</h3>
      <p class="text-lg font-sans leading-relaxed">Problems analysed through a mixture of quantitative and qualitative data analysis:</p>
      <ol class="list-decimal pl-5 space-y-1 text-lg font-sans">
        <li>Poor structure of sessions → it always ended on a negative note</li>
        <li>Lack of recommendations when players get stuck</li>
        <li>Lack of visual goal setting</li>
        <li>Lack of celebration of milestones</li>
      </ol>
      <p class="text-lg font-sans leading-relaxed">How I led the team to fix it:</p>
      <ol class="list-decimal pl-5 space-y-1 text-lg font-sans">
        <li>Make UX and game economy changes to make sure player ends game session on a happy note with anticipation for the next time</li>
        <li>Add a strategy recommendation system that nudges and guides while maintaining player autonomy</li>
        <li>Create visual UI that creates a path and goal setting</li>
        <li>Added moments of celebrations and paired them with in-app purchases to score a double win on retention and monetisation</li>
      </ol>
    </section>

    <!-- ─── BEFORE / AFTER GALLERY ─── -->
    <section class="space-y-6">
      <h3 class="text-xl font-sans font-bold max-w-4xl mx-auto">Before & After — Quick Overview</h3>
      <p class="max-w-4xl mx-auto text-lg font-sans leading-relaxed">Old user flow to use adventure energy, get rewards, upgrade, and fight:</p>
      <VideoEmbed src="https://www.youtube.com/embed/nJ4OENCLzkE" title="Old User Flow" />
      <div class="max-w-xl mx-auto py-4">
        <CaseInsight stat="7-10 clicks and open app 3 times a day" statLabel="to get rewards that you have already earned" theme="neutral" />
      </div>
      <p class="max-w-4xl mx-auto text-lg font-sans leading-relaxed">New user flow — rewards as soon you open the game:</p>
      <VideoEmbed src="https://www.youtube.com/embed/reWvwvFF8CQ" title="New User Flow" />
      <div class="max-w-xl mx-auto py-4">
        <CaseInsight stat="2 clicks and open app 2 times a day" statLabel="to get rewards that you have already earned" theme="success" />
      </div>
      <!-- Before/After Comparions -->
      <div class="space-y-8">
        <CaseBeforeAfter :beforeImage="galBeforeGoal" :afterImage="galAfterGoal" caption="Visual goal setting: Players clearly see their progression path." />
        <CaseBeforeAfter :beforeImage="galBeforeOffer" :afterImage="galAfterOffer" caption="Monetisation Offers: Lore-driven context outperforms generic popups." />
        <CaseBeforeAfter :beforeImage="galBeforeRecs" :afterImage="galAfterRecs" caption="Recommendations: Showing successful community teams increases win rates." />
        <CaseBeforeAfter :beforeImage="galBeforeAnticipation" :afterImage="galAfterAnticipation" caption="Anticipation: A clear goal and timeline for the next session." />
      </div>
    </section>

    <!-- ─── DATA DEEP DIVE ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">The Data</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          Being a live product, looking at data is always my first step. <strong>D7 retention is an indicator of how much the game has captured the players attention when they are not playing to bring them back and form habits.</strong> I was clear from the start — we are optimising for D7 retention and not D1 retention.
        </p>
        <p class="text-lg font-sans leading-relaxed">
          <strong>A good metric to track habit formation is sessions per day in the first seven days.</strong> By writing SQL to query our database in BigQuery, I could derive that <strong>the average session per day for new players who downloaded the game in the last 90 days was 1.3</strong>. While that sounds great, <strong>I trusted my instinct and background in statistics to look into the distribution of this number as averages can often be deceiving.</strong>
        </p>
        <p class="text-lg font-sans leading-relaxed">
          What was surprising was that we had K-shaped behaviour — <strong>the players who retained were playing so much that they pulled the average up</strong> and practically blindsided the team.
        </p>
        <CaseImage :src="kShapeProblem" alt="K-shaped distribution of player sessions" caption="K-shaped behaviour: very few players had the 'average' experience" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <p class="text-lg font-sans leading-relaxed">
          In nerd terms, this is a bimodal distribution and very few players are actually having the "average" experience. Those below the average were definitely not sticking around, which was a clear indicator why having 1.3 sessions per day still resulted in such poor D7 retention.
        </p>

        <!-- Regression details -->
        <div class="bg-[var(--color-text-charcoal)]/[0.03] border border-[var(--color-text-charcoal)]/10 rounded-xl p-6 space-y-4">
          <h4 class="text-sm font-bold uppercase tracking-wider opacity-60">Logistic Regression Analysis</h4>
          <p class="text-base font-sans leading-relaxed">I ran a logistic regression test on D7 retention as the dependent binary variable and sessions per day as the independent continuous variable. It explained <strong class="font-bold">24% of the variance</strong> in a complex model like retention.</p>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-[var(--color-text-charcoal)]/20">
                  <th class="text-left p-2 font-bold opacity-60">Metric</th>
                  <th class="text-left p-2 font-bold opacity-60">Coefficient (β)</th>
                  <th class="text-left p-2 font-bold opacity-60">Odds Ratio</th>
                  <th class="text-left p-2 font-bold opacity-60">T-Statistic</th>
                  <th class="text-left p-2 font-bold opacity-60">R²</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-[var(--color-text-charcoal)]/10 hover:bg-[var(--color-text-charcoal)]/[0.02] transition-colors">
                  <td class="p-2 font-medium opacity-80">Intercept (β₀)</td>
                  <td class="p-2 opacity-80">0.00334</td>
                  <td class="p-2 opacity-50">N/A</td>
                  <td class="p-2 opacity-50">N/A</td>
                  <td class="p-2 opacity-50">N/A</td>
                </tr>
                <tr class="hover:bg-[var(--color-text-charcoal)]/[0.02] transition-colors">
                  <td class="p-2 font-medium opacity-80">Sessions/Day (β₁)</td>
                  <td class="p-2 font-bold text-emerald-600 dark:text-emerald-400">0.1501</td>
                  <td class="p-2 opacity-80">1.162</td>
                  <td class="p-2 opacity-80">98.78</td>
                  <td class="p-2 font-bold text-emerald-600 dark:text-emerald-400">0.2416</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="py-4">
          <CaseInsight stat="Even just 1 additional day" statLabel="was 16% higher likelihood of retaining to 7 days" theme="neutral" />
        </div>

        <p class="text-lg font-sans leading-relaxed">
          The averages are different and it explains correlation. But <strong>how do I know if the problem is with session per day and not with overall ability of the game to delight?</strong> If that were true, we would see very low engagement in the first session — but the opposite was true with a healthy average 25 minutes first session length. The game had a healthy D1 retention, just <strong>failing to hook players into coming back and forming habits.</strong>
        </p>
      </div>
    </section>

    <!-- ─── SURVEY INSIGHTS ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Survey Research</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          To make certain that I was chasing the correct lead, I ran a survey to understand the user stories behind the data.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CaseInsight stat="73%" statLabel="played in-between life activities" theme="neutral">
            <p><strong>Unstructured downtime entertainment:</strong></p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-sm italic opacity-80">
              <li>"When picking up my child"</li>
              <li>"When I'm on the toilet"</li>
              <li>"When commuting"</li>
            </ul>
          </CaseInsight>
          <CaseInsight stat="54%" statLabel="Timers negatively impacted lifestyle" theme="neutral">
            <p><strong>Game timers felt punishing and interrupted flow:</strong></p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-sm italic opacity-80">
              <li>"Punishes me for having a job"</li>
              <li>"Interrupted just as it got good"</li>
              <li>"Use lunch break for boring quests"</li>
            </ul>
          </CaseInsight>
          <CaseInsight stat="21%" statLabel="did not think of game between sessions" theme="danger">
            <p><strong>Driven by loss avoidance:</strong> Passive waiting rather than active consideration.</p>
          </CaseInsight>
          <CaseInsight stat="36%" statLabel="passively waited for timer notifications" theme="danger">
            <p><strong>Negative anticipation:</strong></p>
            <ul class="list-disc pl-5 mt-2 space-y-1 text-sm italic opacity-80">
              <li>"Forget until notification reminds me"</li>
              <li>"Burned a few times trying to time it"</li>
              <li>"Anxiety trying to play at work"</li>
            </ul>
          </CaseInsight>
        </div>
        <p class="text-lg font-sans leading-relaxed italic underline">These were all retained, active players. The experience felt worse to new players.</p>
        <p class="text-lg font-sans leading-relaxed"><strong>The mismatch in the energy system and user lifestyle was creating negative feelings, and driving anticipation from loss rather than positive anticipation from expectation.</strong></p>

        <!-- Persona -->
        <p class="text-lg font-sans leading-relaxed">
          <strong>This exercise helped me craft a clear persona that represented the data and the feelings — The Casual Connoisseur.</strong> They are characterised by someone who spends thousands of hours in a game, but will play casually at the start as a trial before committing.
        </p>
        <CaseImage :src="persona" alt="The Casual Connoisseur persona" caption="The Casual Connoisseur — our target persona" imgClass="w-full h-auto rounded-xl" />
      </div>
    </section>

    <!-- ─── AFK REWARDS DESIGN ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">AFK Rewards Design</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          <strong>In the original flow, users had to come back to take an action and be rewarded.</strong> This did not generate any anticipation or excitement at the end of your previous session.
        </p>
        <CaseImage :src="gameLoopNegative" alt="Before game loop" caption="Before — an energy system creates a forced action that discourages returning behaviour" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <p class="text-lg font-sans leading-relaxed">
          I redesigned the game loop to start sessions on a happy note and <strong>end sessions on moments of anticipation for future rewards.</strong>
        </p>
        <CaseImage :src="gameLoopPositive" alt="After game loop" caption="After — a positive loop that encourages habit formation" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />

        <p class="text-lg font-sans leading-relaxed">
          <strong>My proposal was to reposition the current energy system into an AFK (away from keyboard) reward system</strong> that collects resources while the user is away. When they are ready to leave the game, we seed the anticipation by telling users they will have rewards waiting for them.
        </p>

        <!-- Wireframing process -->
        <CaseImage :src="wireframeFlow" alt="Wireframing the new screens" caption="Wireframing the new screens and the golden path" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="handSketches" alt="Hand-drawn throwaway concepts" caption="Some hand-drawn throwaway concepts" imgClass="w-full h-auto rounded-xl" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CaseImage :src="afkTest1" alt="Information heavy concept" caption="Pushing information heavy concepts" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="afkTest2" alt="Iterating on variants" caption="Iterating on variants" imgClass="w-full h-auto rounded-lg" />
        </div>
        <CaseImage :src="wireframe" alt="Final candidate wireframe" caption="One of the final candidate wireframes" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />

        <!-- High fidelity -->
        <CaseImage :src="afkMockupFinal" alt="High fidelity AFK rewards mockup" caption="After — An AFK feature that helps users keep getting rewards while they are away. Created in Figma" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="afkMockupRough" alt="Rough in-engine mockup" caption="A very rough in-engine mockup — originally every interaction was a button" imgClass="w-full h-auto rounded-xl" />

        <p class="text-lg font-sans leading-relaxed">
          While I expected basic usability with this version, <strong>my team's artist made a great remark that this screen was missing feelings of delight and joy.</strong> After conducting competitive analysis we found that most games in this genre have an incredibly high bar of polish for their rewards screen — the "dopamine" factor.
        </p>

        <!-- Chest animations -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CaseImage :src="chestLoop" alt="Treasure chest loop" caption="A delightfully full treasure chest that makes the user feel the game has been 'productive' in their absence" imgClass="w-full h-auto rounded-lg" />
          <CaseImage :src="chestFill" alt="Chest fills up animation" caption="The chest fills up giving a sense of delight" imgClass="w-full h-auto rounded-lg" />
        </div>

        <!-- Usability iteration -->
        <p class="text-lg font-sans leading-relaxed">
          <strong>The chest on the screen did not look like a button and did not look clickable</strong> — in early internal testing users were confused on how to actually collect rewards.
        </p>
        <CaseImage :src="afkTutorial" alt="Tutorial iteration" caption="Iteration 1 — A quick tutorial that coached users about non-button clickable elements (this was a no-go)" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="floatingBadge" alt="Floating badge solution" caption="Final Iteration — Adding a button-shaped badge with gentle motion made it clearer the chest is clickable" imgClass="w-full h-auto rounded-xl" />
        <p class="text-lg font-sans leading-relaxed">
          During testing, we found a <strong>100% completion rate</strong> for actions related to collecting rewards from any screen in the game.
        </p>
        <CaseImage :src="userFlowFigma" alt="Final user flow" caption="The final mocked up user flow in an interactable Figma prototype" imgClass="w-full h-auto rounded-xl" />

        <!-- Final video -->
        <VideoEmbed src="https://www.youtube.com/embed/snkVRbZXBeM" title="Complete AFK Rewards Experience" />
        <p class="text-sm font-sans text-center opacity-60">The complete AFK Rewards experience</p>

        <!-- Post-launch survey -->
        <h3 class="text-xl font-sans font-bold pt-8">Post-Launch Survey</h3>
        <p class="text-lg font-sans leading-relaxed"><span class="underline">Question 1 — "What do you think of the new AFK Rewards?"</span></p>
        <ol class="list-decimal pl-5 space-y-1 text-base font-sans italic">
          <li>"I don't have to think about this game during work, which means I can fully focus on it after work"</li>
          <li>"The new system is far less annoying, I only have to open once a day"</li>
          <li>"It's nice to get all my rewards at the start and then just go into playing"</li>
          <li>"Thank god y'all removed the arbitrary timer"</li>
        </ol>
        <CaseImage :src="surveyEnjoyment" alt="Survey results" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white mb-6" />
        <CaseInsight stat="72%" statLabel="Completely agreed that this flow improved the overall game" theme="success" />
        <CaseImage :src="surveyTimers" alt="Timer survey results" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white mt-8 mb-6" />
        <CaseInsight stat="81%" statLabel="Agreed that the new timers fit their lifestyle better" theme="success" />
      </div>
    </section>

    <!-- ─── EXIT SCREEN ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Exit Screen & Anticipation</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          To close off the new game loop, I <strong>added a quit screen</strong> that set goals and anticipation to encourage the user to come back.
        </p>
        <CaseImage :src="exitScreenBefore" alt="Before exit screen" caption="Before — A simple exit screen that does not create anticipation" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="exitScreenAnim" alt="Animated exit screen WIP" caption="WIP — An animated exit screen I made in Figma to share the idea with the team" imgClass="w-full h-auto rounded-xl" />
        <p class="text-lg font-sans leading-relaxed">
          Using UI data, I found <strong>only 12% players closed it using the in-game dialogue</strong>. With so few players seeing this screen, I could not justify the ROI of spending lots of effort to develop animations.
        </p>
        <CaseImage :src="exitScreenAfter" alt="After exit screen" caption="After — An exit screen that creates a timeline and clear goal for return time" imgClass="w-full h-auto rounded-xl" />
      </div>
    </section>

    <!-- ─── RECOMMENDATION SYSTEM ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Recommendation System</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          I found through analysing further data that <strong>users would get stuck at specific dungeons and quit the game after trying a few more times</strong>. This was a highly correlated factor to low D7 retention.
        </p>
        <CaseImage :src="playerDropoff" alt="Player drop-off graph" caption="Average attempts per dungeon vs players who quit after failing — many dungeons where users were hitting their head against a wall" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <CaseInsight stat="46% of churned users" statLabel="had attempted and lost at the same dungeon 2+ times in their first week" theme="neutral" />
          <CaseInsight stat="22% of churned users" statLabel="had attempted and lost 3+ times" theme="neutral" />
        </div>

        <p class="text-lg font-sans leading-relaxed">
          After analysing what heroes they were using, <strong>it turned out they were using weaker strategic teams despite being at an adequate power level.</strong>
        </p>
        <CaseImage :src="guardianUsageData" alt="Guardian usage data" caption="Clear difference in heroes used by successful vs unsuccessful players" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <div class="py-4">
          <CaseInsight stat="about 50% users who quit" statLabel="Made no changes to their comp between attempt #1 and #2" theme="neutral" />
        </div>

        <p class="text-lg font-sans leading-relaxed">
          We arrived at adding a <strong>recommendation system</strong> using server-wide hero usage data.
        </p>
        <CaseImage :src="recommendedWireframe" alt="Recommended heroes wireframe" caption="Initial wireframe for recommended heroes" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <div class="py-4">
          <CaseBeforeAfter :beforeImage="recsBeforeImg" :afterImage="recsAfterImg" caption="Recommendations guiding players using community data without forcing teams." />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <CaseInsight stat="~70% users" statLabel="Changed their comp after loss #1 (up from 50%)" theme="success" />
          <CaseInsight stat="And 63% of those users" statLabel="Completed the dungeon on Attempt #2" theme="success" />
        </div>
      </div>
    </section>

    <!-- ─── VISUAL PROGRESSION ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Visual Progression & Goal Setting</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          Players quit after losing because whenever they lost in a dungeon, they had to begin from the start. I collaborated directly with the game designer to add a new <strong>checkpoint dungeon progression system</strong>.
        </p>
        <CaseImage :src="progressionWireframe" alt="Visual progression wireframe" caption="Initial wireframe of visual goal setting" imgClass="w-full h-auto rounded-xl border border-gray-200 p-4 bg-white" />
        <div class="py-4">
          <CaseBeforeAfter :beforeImage="progBeforeImg" :afterImage="progAfterImg" caption="A clear visual path with checkpoints replaced the old system where players start from the beginning." />
        </div>

        <!-- Daily Calendar -->
        <h3 class="text-xl font-sans font-bold pt-8">7-Day Reward Calendar</h3>
        <p class="text-lg font-sans leading-relaxed">
          I created a <strong>7 day reward letting players pick 1 legendary guardian</strong>, giving players choice and autonomy at the end of a long commitment. The UI was specifically designed as a countdown calendar.
        </p>
        <CaseImage :src="dailyCalendar" alt="Daily reward calendar" caption="Daily instant gratification rewards + a big delayed gratification reward at the end of the week" imgClass="w-full h-auto rounded-xl" />
        <div class="py-4">
          <CaseInsight stat="+3% increase" statLabel="in day 6 to day 7 retention" theme="success" />
        </div>
      </div>
    </section>

    <!-- ─── LEGENDARY HERO & MONETISATION ─── -->
    <section class="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <div class="md:col-span-4">
        <h2 class="text-2xl font-serif font-bold sticky top-24">Moments of Delight & Monetisation</h2>
      </div>
      <div class="md:col-span-8 space-y-8">
        <p class="text-lg font-sans leading-relaxed">
          I added an explicit scripted moment to get the first legendary hero after defeating the first boss — <strong>a moment of delight to feel celebratory and achieved</strong>. This decision was not informed by pre-prepared data, so <strong>we A/B tested this implementation.</strong>
        </p>
        <CaseImage :src="legendaryHero" alt="Legendary hero design" caption="I created this design in Figma with existing design system components" imgClass="w-full h-auto rounded-xl" />
        <div class="py-4">
          <CaseInsight stat="+38% higher likelihood" statLabel="A user who received the hero would retain compared to one who did not" theme="success" />
        </div>

        <!-- Offer iterations -->
        <p class="text-lg font-sans leading-relaxed">
          After the success, I added an <strong>introductory offer</strong> paired with the delight moment. It performed <strong>162% better</strong> against the old offer and <strong>increased odds of a purchasing player retaining to D7 by 65%.</strong>
        </p>
        <CaseImage :src="oldOffer" alt="Old offer" caption="Before — The old offer had no context. 99% of players closed the popup in under 1 second" imgClass="w-full h-auto rounded-xl" />
        <div class="py-4">
          <CaseInsight stat="99.9% users" statLabel="Closed this popup instantly" theme="danger" />
        </div>
        <CaseImage :src="newOffer" alt="New offer" caption="After — The new offer with context and clear value proposition" imgClass="w-full h-auto rounded-xl" />
        <div class="py-4">
          <CaseInsight stat="More than double purchases" statLabel="compared to the old offer" theme="success" />
        </div>

        <!-- Iteration stages -->
        <h3 class="text-xl font-sans font-bold pt-8">Iteration Process</h3>
        <CaseImage :src="offerWireframe" alt="Stage 1 wireframe" caption="Stage 1 — Low fidelity wireframes focusing on user flow and value proposition" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="offerIteration2" alt="Stage 2 iteration" caption="Stage 2 — Polished by UI artist. We did not release this iteration" imgClass="w-full h-auto rounded-xl" />
        <CaseImage :src="offerIteration3" alt="Stage 3 iteration" caption="Stage 3 — 61% better than old offer, but I wanted more lore and context" imgClass="w-full h-auto rounded-xl" />
        <p class="text-lg font-sans leading-relaxed">
          <strong>The final version outperformed Stage 3 by 4% on claiming the free hero and by over 50% on purchasing the offer!</strong>
        </p>
      </div>
    </section>

    <!-- ─── RESULTS ─── -->
    <section class="bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 p-12 rounded-3xl space-y-12 shadow-sm">
      <h2 class="text-4xl font-serif font-bold">Results</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <CaseMetric value="+25%" label="D7 Retention Uplift" theme="success" />
        <CaseMetric value="+200%" label="Players collecting all rewards" theme="success" />
        <CaseMetric value="+12%" label="D7 LTV (Revenue)" theme="success" />
      </div>
      <div class="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed opacity-90">
        <p>
          The bimodal distribution eventually regressed to a normal distribution, and fewer overall players churned after solving user pain points.
        </p>
        <p>
          Impact on D7 retention followed an 80/20 principle — major impact came from the earliest, biggest changes. At that point, I proposed to dissolve the "D7 Retention" strike team and reallocate people to other features.
        </p>
      </div>
      <CaseImage :src="smootherBellCurve" alt="Normal distribution after changes" caption="The 'average' is lower but the outcome is more consistent for more players" imgClass="w-full h-auto rounded-xl" />
      <CaseImage :src="retentionGrowth" alt="Retention growth over time" caption="Mocked visualisation of approximated retention data (real data is proprietary)" imgClass="w-full h-auto rounded-xl" />
    </section>

    <!-- ─── LEARNINGS ─── -->
    <section class="max-w-4xl mx-auto space-y-6">
      <h2 class="text-3xl font-serif font-bold">Learnings</h2>
      <p class="text-lg font-sans leading-relaxed">
        <strong>This was a major block of work that took multiple months and was shipped over multiple releases.</strong> The discovery phase started by understanding what users are lacking is beyond the screen — it's a mismatch of the game's user experience and their habits and lifestyle.
      </p>
      <p class="text-lg font-sans leading-relaxed">
        <strong>With hypothesis and insights backed by data about player behaviour, we could confidently commit</strong> to this long endeavour to deliver value with constant iteration. Confidence in vision is key to keep the team motivated when the development period is long and uncertain.
      </p>
      <p class="text-lg font-sans leading-relaxed">
        On a small, under-resourced team <strong>I had to basically also be the lead data analyst on this feature.</strong> If you want to see my full in-depth analysis, you can <a href="https://docs.google.com/document/d/1E_Y0sQC5yAS__0F0BeOLr5f_QueWJYBsCgnhGpbD7vE/edit?usp=sharing" target="_blank" rel="noopener noreferrer" class="underline font-bold hover:opacity-70 transition-opacity">read the full report here</a> (~15 min read).
      </p>
    </section>

    <!-- ─── TESTIMONIALS ─── -->
    <section class="border-t border-[var(--color-text-charcoal)]/10 pt-16">
      <h2 class="text-3xl font-serif font-bold text-center mb-12">What My Colleagues Say</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
        <div class="space-y-4 text-center">
          <h4 class="font-serif italic text-sm">Josiah Wallace, Senior Game Design Manager</h4>
          <blockquote class="text-base font-sans leading-relaxed opacity-80 italic">
            "Data driven design is now a keystone in modern game development and there are few others like Bramha who combine the UX and Game Design know-how with the Data Analysis process &amp; procedure as well as he does. The decisions, features, and projects he stands behind always produce measurable results, drive revenue growth, and increase player retention."
          </blockquote>
        </div>
        <div class="space-y-4 text-center">
          <h4 class="font-serif italic text-sm">Daniel Paez, Executive Producer</h4>
          <blockquote class="text-base font-sans leading-relaxed opacity-80 italic">
            "Bramha was always able to breakdown each design decision into its core target audiences and their motivations, helping cut through the franticness and rash decision-making and driving towards elegant, effective solutions."
          </blockquote>
        </div>
      </div>
    </section>

  </div>
</template>
