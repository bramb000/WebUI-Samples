
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

const CREAM = [235, 228, 214];
const BLACK_MAX = 10, HALO_MAX = 18, HALO_PASSES = 3;
const INTERIOR_GUTTER_MAX = 10, GUTTER_EXPAND_PASSES = 10, GUTTER_EXPAND_MAX = 165;
const RIM_PASSES = 20, RIM_MAX_DARK = 185;

const CREAM = [235, 228, 214]
/** Seed flood fill — near-pure transition black only. */
const BLACK_MAX = 10
/** Tight halo: only expands from gutter, not from cream card surfaces. */
const HALO_MAX = 18
const HALO_PASSES = 3
/** Interior transition gutters (not edge-connected) + rim dilation. */
const INTERIOR_GUTTER_MAX = 10
const GUTTER_EXPAND_PASSES = 10
const GUTTER_EXPAND_MAX = 165
/** Card-rim cleanup — gutter-adjacent anti-alias on panel perimeter only. */
const RIM_PASSES = 20
const RIM_MAX_DARK = 185



// can't easily splice. Just run full script on short clip
