#!/usr/bin/env node
/**
 * Builds an artistic before→after flow transformation clip from the two Guild YouTube screen recordings.
 * Requires: ffmpeg, yt-dlp (run downloads first or place source mp4s in guild/summary/source/)
 *
 * Run: node scripts/generate-guild-flow-transform.mjs
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC = join(ROOT, 'src/assets/images/guild/summary/source')
const OUT = join(ROOT, 'src/assets/images/guild/summary/flow-transform.webm')

const OLD = join(SRC, 'old-flow.mp4')
const NEW = join(SRC, 'new-flow.mp4')

function run(cmd) {
  console.log(`\n→ ${cmd}\n`)
  execSync(cmd, { stdio: 'inherit', cwd: ROOT })
}

mkdirSync(SRC, { recursive: true })

if (!existsSync(OLD) || !existsSync(NEW)) {
  console.log('Downloading source screen recordings…')
  run(`yt-dlp -f "best[height<=1080]" -o "${join(SRC, 'old-flow.%(ext)s')}" "https://www.youtube.com/watch?v=nJ4OENCLzkE"`)
  run(`yt-dlp -f "best[height<=1080]" -o "${join(SRC, 'new-flow.%(ext)s')}" "https://www.youtube.com/watch?v=reWvwvFF8CQ"`)
}

/** Phone crop, pillarbox, color grade, smooth wipe transform */
const phone = 'crop=520:896:(iw-520)/2:0,scale=-2:660:flags=lanczos'
const canvas = 'pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0x101018,setsar=1,fps=30,format=yuv420p'

const filter = [
  `[0:v]${phone},`,
  `eq=saturation=0.55:brightness=-0.06:contrast=1.12,`,
  `${canvas},vignette=angle=PI/4.5[v0];`,
  `[1:v]${phone},`,
  `eq=saturation=1.28:brightness=0.04:contrast=1.04,`,
  `unsharp=5:5:1.1:5:5:0.0,`,
  `${canvas},vignette=angle=PI/4.5[v1];`,
  `[v0][v1]xfade=transition=smoothleft:duration=1.1:offset=4.2,format=yuv420p[v]`,
].join('')

run(
  `ffmpeg -y -an -ss 9 -t 5.5 -i "${OLD}" -an -ss 2.5 -t 5.5 -i "${NEW}" ` +
  `-filter_complex "${filter}" ` +
  `-map "[v]" -t 8.5 -c:v libvpx-vp9 -b:v 2.8M -an "${OUT}"`,
)

console.log(`\nWrote ${OUT}`)
