<script setup lang="ts">
import CaseDiagramFrame from '../CaseDiagramFrame.vue'

const stroke = 'var(--diagram-stroke, #2f3339)'
const fill = 'var(--diagram-fill, #ebe4d6)'
const accentFill = 'var(--diagram-accent-fill, #3dba6a)'
const accentStroke = 'var(--diagram-accent-stroke, #2a8f4f)'
const laneFill = 'var(--diagram-lane-fill, #f2ece2)'
const text = 'var(--diagram-text, #1a1814)'
const muted = 'var(--diagram-muted, #5c564c)'
</script>

<template>
  <CaseDiagramFrame
    title="Process flowchart · daily shelf intelligence"
    caption="Parallel collection from both banners, then a single transform and publish path each morning."
  >
    <svg
      viewBox="0 0 880 480"
      role="img"
      aria-labelledby="pipeline-chart-title pipeline-chart-desc"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title id="pipeline-chart-title">Planoverse daily data pipeline process chart</title>
      <desc id="pipeline-chart-desc">
        Flowchart: daily run opens shopper sessions, fetches Coles and Woolworths store data in parallel,
        archives raw snapshots, matches products, maps categories, computes bay metrics, publishes the dashboard,
        and ends when managers review.
      </desc>

      <defs>
        <marker id="pipe-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" :fill="stroke" />
        </marker>
      </defs>

      <!-- Swimlanes -->
      <g :stroke="stroke" stroke-width="1.1" fill="none" opacity="0.9">
        <rect x="12" y="12" width="856" height="78" rx="8" :fill="laneFill" />
        <rect x="12" y="98" width="856" height="128" rx="8" :fill="laneFill" opacity="0.75" />
        <rect x="12" y="234" width="856" height="110" rx="8" :fill="laneFill" opacity="0.75" />
        <rect x="12" y="352" width="856" height="112" rx="8" :fill="laneFill" opacity="0.75" />
      </g>

      <g
        :fill="muted"
        font-family="Lexend, system-ui, sans-serif"
        font-size="10"
        font-weight="700"
        letter-spacing="0.1em"
      >
        <text x="24" y="34">SOURCE</text>
        <text x="24" y="118">COLLECTION</text>
        <text x="24" y="254">PLATFORM</text>
        <text x="24" y="372">DELIVERY</text>
      </g>

      <!-- Source apps (aligned above fetch nodes) -->
      <rect x="292" y="42" width="132" height="36" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <rect x="456" y="42" width="132" height="36" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <g :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="12" font-weight="600" text-anchor="middle">
        <text x="358" y="64">Coles app</text>
        <text x="522" y="64">Woolworths app</text>
      </g>

      <!-- Collection: start → session → fork → parallel fetches → join → archive -->
      <ellipse cx="88" cy="168" rx="40" ry="20" :fill="accentFill" :stroke="accentStroke" stroke-width="1.6" />
      <text x="88" y="172" text-anchor="middle" :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="700">
        Daily run
      </text>

      <rect x="156" y="148" width="120" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text x="216" y="172" text-anchor="middle" :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="600">
        Open session
      </text>

      <!-- Fork gateway -->
      <path d="M300 168 L312 180 L300 192 L288 180 Z" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <g :stroke="stroke" stroke-width="1.3" stroke-linecap="round">
        <line x1="294" y1="180" x2="306" y2="180" />
        <line x1="300" y1="174" x2="300" y2="186" />
      </g>

      <rect x="338" y="148" width="120" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <rect x="482" y="148" width="120" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <g :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">
        <text x="398" y="172">Fetch Coles</text>
        <text x="542" y="172">Fetch Woolies</text>
      </g>

      <!-- Join gateway -->
      <path d="M630 168 L642 180 L630 192 L618 180 Z" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <g :stroke="stroke" stroke-width="1.3" stroke-linecap="round">
        <line x1="624" y1="180" x2="636" y2="180" />
        <line x1="630" y1="174" x2="630" y2="186" />
      </g>

      <!-- Cylinder data store -->
      <g :stroke="stroke" stroke-width="1.5" :fill="fill">
        <ellipse cx="740" cy="156" rx="48" ry="10" />
        <rect x="692" y="156" width="96" height="36" />
        <ellipse cx="740" cy="192" rx="48" ry="10" />
      </g>
      <text x="740" y="180" text-anchor="middle" :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="600">
        Raw archive
      </text>

      <text
        x="470"
        y="136"
        text-anchor="middle"
        :fill="muted"
        font-family="Lexend, system-ui, sans-serif"
        font-size="9"
        font-weight="700"
        letter-spacing="0.12em"
      >
        PARALLEL
      </text>

      <!-- Platform -->
      <rect x="220" y="278" width="140" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <rect x="400" y="278" width="140" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <rect x="580" y="278" width="140" height="40" rx="7" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <g :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="600" text-anchor="middle">
        <text x="290" y="302">Match SKUs</text>
        <text x="470" y="302">Map categories</text>
        <text x="650" y="302">Bay metrics</text>
      </g>

      <!-- Delivery -->
      <rect x="340" y="392" width="150" height="40" rx="7" :fill="accentFill" :stroke="accentStroke" stroke-width="1.6" />
      <ellipse cx="620" cy="412" rx="56" ry="22" :fill="accentFill" :stroke="accentStroke" stroke-width="1.6" />
      <g :fill="text" font-family="Lexend, system-ui, sans-serif" font-size="11" font-weight="700" text-anchor="middle">
        <text x="415" y="416">Publish dashboard</text>
        <text x="620" y="416">Managers review</text>
      </g>

      <!-- Connectors: apps → fetches -->
      <g :stroke="stroke" stroke-width="1.5" fill="none" marker-end="url(#pipe-arrow)">
        <path d="M358 78 V148" />
        <path d="M522 78 V148" />
      </g>

      <!-- Collection flow -->
      <g :stroke="stroke" stroke-width="1.5" fill="none" marker-end="url(#pipe-arrow)">
        <path d="M128 168 H156" />
        <path d="M276 168 H288" />
        <!-- fork → Coles fetch -->
        <path d="M312 180 H338" />
        <!-- fork → Woolies fetch (below) -->
        <path d="M300 192 V210 H542 V188" />
        <!-- Coles → join (route above Woolies box) -->
        <path d="M458 168 H470 V140 H618 V168" />
        <!-- Woolies → join -->
        <path d="M602 168 H618" />
        <!-- join → archive -->
        <path d="M642 180 H692" />
      </g>

      <!-- Archive → Match (straight down then left, no loop) -->
      <g :stroke="stroke" stroke-width="1.5" fill="none" marker-end="url(#pipe-arrow)">
        <path d="M740 202 V250 H290 V278" />
        <path d="M360 298 H400" />
        <path d="M540 298 H580" />
        <path d="M650 318 V370 H415 V392" />
        <path d="M490 412 H564" />
      </g>
    </svg>
  </CaseDiagramFrame>
</template>
