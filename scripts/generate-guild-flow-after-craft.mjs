#!/usr/bin/env node
/**
 * Cinematic "after only" AFK flow clip — chest, collect, buttons, rewards reveal.
 * Three beats crossfaded: establish modal → chest glow + CTAs → rewards burst.
 *
 * Run: node scripts/generate-guild-flow-after-craft.mjs
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src/assets/images/guild/summary/source')
const NEW = join(SRC, 'new-flow.mp4')
const OUT = join(ROOT, 'src/assets/images/guild/summary/flow-after-craft.webm')

function run(cmd) {
  console.log(`\n→ ${cmd}\n`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT })
}

mkdirSync(SRC, { recursive: true })

if (!existsSync(NEW)) {
  console.log('Downloading new AFK flow recording…')
  run(`yt-dlp -f "best[height<=1080]" -o "${join(SRC, 'new-flow.%(ext)s')}" "https://www.youtube.com/watch?v=reWvwvFF8CQ"`)
}

const grade = 'eq=saturation=1.24:contrast=1.08:brightness=0.03,unsharp=5:5:0.85:5:5:0.0'
const canvas = 'scale=-2:960:flags=lanczos,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x080810,vignette=angle=PI/4.8,fps=30,format=yuv420p'

const filter = [
  // Beat 1 — full AFK modal, slow establish
  `[0:v]crop=548:896:(iw-548)/2:0,scale=860:-2:flags=lanczos,setpts=1.55*PTS,${grade},${canvas}[v0];`,
  // Beat 2 — chest + flying coins + pill buttons (tighter crop on reward row)
  `[1:v]crop=520:780:(iw-520)/2:72,scale=920:-2:flags=lanczos,setpts=1.45*PTS,${grade},${canvas}[v1];`,
  // Beat 3 — REWARDS burst, golden rays + icon row
  `[2:v]crop=500:540:(iw-500)/2:200,scale=980:-2:flags=lanczos,setpts=1.5*PTS,${grade},${canvas}[v2];`,
  `[v0][v1]xfade=transition=fade:duration=0.45:offset=3.95[v01];`,
  `[v01][v2]xfade=transition=fade:duration=0.4:offset=7.85[v]`,
].join('')

run(
  `ffmpeg -y -an ` +
    `-ss 0.8 -t 2.7 -i "${NEW}" ` +
    `-ss 2.1 -t 3.0 -i "${NEW}" ` +
    `-ss 4.75 -t 1.7 -i "${NEW}" ` +
    `-filter_complex "${filter}" ` +
    `-map "[v]" -t 10.5 -c:v libvpx-vp9 -b:v 3.2M -an "${OUT}"`,
)

console.log(`\nWrote ${OUT}`)
