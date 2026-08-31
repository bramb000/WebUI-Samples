<script setup lang="ts">
import CaseDiagramFrame from '../CaseDiagramFrame.vue'

const stroke = 'var(--diagram-stroke, #2f3339)'
const fill = 'var(--diagram-fill, #ebe4d6)'
const accentFill = 'var(--diagram-accent-fill, #3dba6a)'
const accentStroke = 'var(--diagram-accent-stroke, #2a8f4f)'
const laneFill = 'var(--diagram-lane-fill, #f2ece2)'
const rejectFill = 'var(--diagram-reject-fill, #c4565e)'
const text = 'var(--diagram-text, #1a1814)'
const muted = 'var(--diagram-muted, #5c564c)'
</script>

<template>
  <CaseDiagramFrame
    title="UML activity diagram · cross-banner product matching"
    caption="Pair equivalent SKUs first, then derive shared category labels from those pairs."
  >
    <!--
      Strict orthogonal grid (shared Y for row centres, shared X for columns).
      Row A y=88  | Row B y=200  | Row C y=300
      Skip column x=590
    -->
    <svg
      viewBox="0 0 700 380"
      role="img"
      aria-labelledby="matching-uml-title matching-uml-desc"
      xmlns="http://www.w3.org/2000/svg"
      class="matching-uml"
    >
      <title id="matching-uml-title">Planoverse cross-banner product matching UML activity diagram</title>
      <desc id="matching-uml-desc">
        Compact UML activity diagram: load SKUs, normalise names, same-brand gate, score similarity,
        threshold gate, lock a one-to-one match, derive shared categories, or skip the pair.
      </desc>

      <defs>
        <marker
          id="uml-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" :fill="stroke" />
        </marker>
      </defs>

      <rect x="12" y="12" width="676" height="356" rx="10" :fill="laneFill" :stroke="stroke" stroke-width="1.3" />
      <text
        x="28"
        y="32"
        :fill="muted"
        font-family="Lexend, system-ui, sans-serif"
        font-size="10"
        font-weight="700"
        letter-spacing="0.1em"
      >
        «partition» Matching engine
      </text>

      <!-- ═══ ROW A · y = 88 ═══ -->
      <circle cx="40" cy="88" r="8" :fill="text" />

      <rect x="64" y="66" width="156" height="44" rx="14" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="142"
        y="93"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Load store-pair SKUs
      </text>

      <rect x="244" y="66" width="150" height="44" rx="14" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="319"
        y="93"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Normalise names
      </text>

      <!-- D1 centre (448, 88) · half-diagonal 32 -->
      <path d="M448 56 L480 88 L448 120 L416 88 Z" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="448"
        y="48"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="11"
        font-weight="700"
      >
        Same brand?
      </text>

      <!-- Skip column · centre x = 590 -->
      <rect x="540" y="150" width="100" height="40" rx="12" :fill="rejectFill" :stroke="stroke" stroke-width="1.4" />
      <text
        x="590"
        y="175"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Skip pair
      </text>
      <circle cx="590" cy="230" r="11" :fill="text" />
      <g :stroke="laneFill" stroke-width="2.2" stroke-linecap="round">
        <line x1="584" y1="224" x2="596" y2="236" />
        <line x1="596" y1="224" x2="584" y2="236" />
      </g>

      <!-- ═══ ROW B · y = 200 ═══ -->
      <rect x="64" y="178" width="156" height="44" rx="14" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="142"
        y="205"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Score similarity
      </text>

      <!-- D2 centre (319, 200) · half-diagonal 32 -->
      <path d="M319 168 L351 200 L319 232 L287 200 Z" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="319"
        y="156"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="11"
        font-weight="700"
      >
        Above threshold?
      </text>

      <rect x="380" y="178" width="136" height="44" rx="14" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="448"
        y="205"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Lock 1:1 match
      </text>

      <!-- ═══ ROW C · y = 300 ═══ -->
      <rect x="360" y="278" width="176" height="44" rx="14" :fill="fill" :stroke="stroke" stroke-width="1.5" />
      <text
        x="448"
        y="305"
        text-anchor="middle"
        :fill="text"
        font-family="Lexend, system-ui, sans-serif"
        font-size="12"
        font-weight="600"
      >
        Derive shared categories
      </text>

      <circle cx="448" cy="350" r="11" :fill="accentFill" :stroke="accentStroke" stroke-width="2" />
      <circle cx="448" cy="350" r="5" :fill="laneFill" :stroke="accentStroke" stroke-width="1.8" />

      <!--
        Orthogonal connectors only (H / V segments).
        Endpoints sit on node edges at the shared row/column centre.
      -->
      <g :stroke="stroke" stroke-width="1.5" fill="none" marker-end="url(#uml-arrow)">
        <!-- start → load -->
        <path d="M48 88 H64" />
        <!-- load → normalise -->
        <path d="M220 88 H244" />
        <!-- normalise → D1 left -->
        <path d="M394 88 H416" />
        <!-- D1 yes: bottom → down to rail y=140 → left to Score column → down into Score top -->
        <path d="M448 120 V140 H142 V178" />
        <!-- D1 no: right → across to Skip column → down into Skip top -->
        <path d="M480 88 H590 V150" />
        <!-- Score → D2 left -->
        <path d="M220 200 H287" />
        <!-- D2 yes: right → into Lock left -->
        <path d="M351 200 H380" />
        <!-- D2 no: bottom → down under Lock → right to Skip column → up into Skip bottom -->
        <path d="M319 232 V250 H590 V190" />
        <!-- Skip → reject -->
        <path d="M590 190 V219" />
        <!-- Lock → Derive (same column x=448) -->
        <path d="M448 222 V278" />
        <!-- Derive → end -->
        <path d="M448 322 V339" />
      </g>

      <!-- Guard labels clear of edges and paths -->
      <g :fill="muted" font-family="Lexend, system-ui, sans-serif" font-size="10" font-weight="700">
        <text x="456" y="136">[yes]</text>
        <text x="510" y="82">[no]</text>
        <text x="358" y="194">[yes]</text>
        <text x="328" y="248">[no]</text>
      </g>

      <!-- Legend -->
      <g transform="translate(28, 340)" :fill="muted" font-family="Lexend, system-ui, sans-serif" font-size="9">
        <circle cx="0" cy="0" r="4" :fill="text" />
        <text x="10" y="3">Start</text>
        <rect x="48" y="-7" width="22" height="12" rx="6" :fill="fill" :stroke="stroke" stroke-width="1" />
        <text x="76" y="3">Activity</text>
        <path d="M122 -1 L132 5 L122 11 L112 5 Z" :fill="fill" :stroke="stroke" stroke-width="1" />
        <text x="138" y="3">Decision</text>
        <circle cx="198" cy="0" r="5" :fill="text" />
        <g :stroke="laneFill" stroke-width="1.4" stroke-linecap="round">
          <line x1="195" y1="-3" x2="201" y2="3" />
          <line x1="201" y1="-3" x2="195" y2="3" />
        </g>
        <text x="208" y="3">Reject</text>
        <circle cx="258" cy="0" r="6" :fill="accentFill" :stroke="accentStroke" stroke-width="1.4" />
        <circle cx="258" cy="0" r="2.5" :fill="laneFill" :stroke="accentStroke" stroke-width="1" />
        <text x="270" y="3">End</text>
      </g>
    </svg>
  </CaseDiagramFrame>
</template>

<style scoped>
.matching-uml {
  max-height: min(48vh, 26rem);
}
</style>
