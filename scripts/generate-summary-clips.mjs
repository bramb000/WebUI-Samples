#!/usr/bin/env node
/**
 * Builds short looping WebM summary clips from before/after stills.
 * Run: node scripts/generate-summary-clips.mjs
 */
import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const IMG = (...parts) => join(ROOT, 'src/assets/images', ...parts)

function run(cmd) {
  console.log(`\n→ ${cmd}\n`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT })
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

/** Side-by-side before | after loop (~6s) */
function sideBySideClip({ before, after, out, width = 1280, height = 720, duration = 6 }) {
  ensureDir(dirname(out))
  const half = Math.floor(width / 2)
  run(
    `ffmpeg -y -stream_loop -1 -i "${before}" -stream_loop -1 -i "${after}" ` +
    `-filter_complex "` +
    `[0:v]scale=${half}:${height}:force_original_aspect_ratio=decrease,pad=${half}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1[left];` +
    `[1:v]scale=${half}:${height}:force_original_aspect_ratio=decrease,pad=${half}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1[right];` +
    `[left][right]hstack=inputs=2,format=yuv420p[v]` +
    `" -map "[v]" -r 30 -t ${duration} -c:v libvpx-vp9 -b:v 1.2M -an "${out}"`,
  )
}

/** Crossfade A → B (~6s total) */
function crossfadeClip({ before, after, out, width = 1280, height = 720 }) {
  ensureDir(dirname(out))
  run(
    `ffmpeg -y -stream_loop -1 -i "${before}" -stream_loop -1 -i "${after}" ` +
    `-filter_complex "` +
    `[0:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v0];` +
    `[1:v]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1,fps=30[v1];` +
    `[v0][v1]xfade=transition=fade:duration=20:offset=70,format=yuv420p[v]` +
    `" -map "[v]" -t 6 -c:v libvpx-vp9 -b:v 1.2M -an "${out}"`,
  )
}

console.log('Generating case study summary clips…')

sideBySideClip({
  before: IMG('guild/tldr/008_screenshot-20251215-083431-guild-of-guardians-thumbnail.webp'),
  after: IMG('guild/tldr/009_figma-e1njfafc8a-1-1-thumbnail.webp'),
  out: IMG('guild/summary/flow-highlight.webm'),
})

sideBySideClip({
  before: IMG('rocksmith/executive-summary/000_traditional-rocksmith.webp'),
  after: IMG('rocksmith/executive-summary/001_rocksmith-mobile.webp'),
  out: IMG('rocksmith/summary/platform-shift.webm'),
})

sideBySideClip({
  before: IMG('online-dice-simulator/crowded_game_table.png'),
  after: IMG('online-dice-simulator/screenshot_1.png'),
  out: IMG('online-dice-simulator/summary/table-to-phone.webm'),
  width: 1280,
  height: 720,
})

console.log('\nDone.')
