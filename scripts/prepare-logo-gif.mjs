#!/usr/bin/env node
/**
 * Prepare navbar logo GIF from source animation:
 * - keep first 30 frames (drop empty frames 31–32)
 * - key near-black pixels to transparent
 * - crop to content bounds across all kept frames
 * - resize for navbar height
 *
 * Usage: node scripts/prepare-logo-gif.mjs
 */
import { spawn } from 'node:child_process'
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const LOGO_DIR = path.join(ROOT, 'src/assets/images/logo')
const SOURCE = path.join(LOGO_DIR, 'Animated name.gif')
const OUTPUT = path.join(LOGO_DIR, 'bramha-logo.gif')
const WORK_DIR = path.join(ROOT, 'tmp/logo-prep')

const MAX_FRAMES = 30
const TARGET_HEIGHT = 28
const BLACK_THRESHOLD = 16
const PAD = 2

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit' })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited ${code}`))
    })
  })
}

async function computeBounds(framePaths) {
  let minX = Infinity
  let minY = Infinity
  let maxX = 0
  let maxY = 0

  for (const framePath of framePaths) {
    const { data, info } = await sharp(framePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { width, height, channels } = info
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * channels
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        const a = data[idx + 3]
        const isBlack = r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD
        const visible = a > 10 && !isBlack
        if (!visible)
          continue
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
      }
    }
  }

  const contentW = maxX - minX + 1
  const contentH = maxY - minY + 1
  return {
    left: Math.max(0, minX - PAD),
    top: Math.max(0, minY - PAD),
    width: contentW + PAD * 2,
    height: contentH + PAD * 2,
  }
}

async function main() {
  await rm(WORK_DIR, { recursive: true, force: true })
  await mkdir(path.join(WORK_DIR, 'raw'), { recursive: true })
  await mkdir(path.join(WORK_DIR, 'processed'), { recursive: true })

  await run('ffmpeg', [
    '-y',
    '-i', SOURCE,
    '-frames:v', String(MAX_FRAMES),
    path.join(WORK_DIR, 'raw/frame_%03d.png'),
  ])

  const rawDir = path.join(WORK_DIR, 'raw')
  const rawFrames = (await readdir(rawDir))
    .filter(f => f.endsWith('.png'))
    .sort()
    .map(f => path.join(rawDir, f))

  if (rawFrames.length !== MAX_FRAMES)
    throw new Error(`Expected ${MAX_FRAMES} frames, got ${rawFrames.length}`)

  const crop = await computeBounds(rawFrames)
  const outWidth = Math.max(1, Math.round(crop.width * (TARGET_HEIGHT / crop.height)))

  for (const [i, framePath] of rawFrames.entries()) {
    await sharp(framePath)
      .extract(crop)
      .resize(outWidth, TARGET_HEIGHT, { fit: 'fill' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(async ({ data, info }) => {
        const { width, height, channels } = info
        const out = Buffer.from(data)
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * channels
            const r = out[idx]
            const g = out[idx + 1]
            const b = out[idx + 2]
            if (r <= BLACK_THRESHOLD && g <= BLACK_THRESHOLD && b <= BLACK_THRESHOLD)
              out[idx + 3] = 0
          }
        }
        await sharp(out, { raw: { width, height, channels } })
          .png()
          .toFile(path.join(WORK_DIR, 'processed', `frame_${String(i + 1).padStart(3, '0')}.png`))
      })
  }

  const palette = path.join(WORK_DIR, 'palette.png')
  await run('ffmpeg', [
    '-y',
    '-framerate', '100',
    '-i', path.join(WORK_DIR, 'processed/frame_%03d.png'),
    '-frames:v', '1',
    '-vf', 'palettegen=reserve_transparent=1:stats_mode=full',
    '-update', '1',
    palette,
  ])

  await run('ffmpeg', [
    '-y',
    '-framerate', '12.5',
    '-i', path.join(WORK_DIR, 'processed/frame_%03d.png'),
    '-i', palette,
    '-frames:v', String(MAX_FRAMES),
    '-lavfi', 'paletteuse=alpha_threshold=128',
    '-loop', '0',
    OUTPUT,
  ])

  const { size } = await stat(OUTPUT)
  console.log(`\nWrote ${path.relative(ROOT, OUTPUT)} (${outWidth}x${TARGET_HEIGHT}, ${MAX_FRAMES} frames, ${(size / 1024).toFixed(1)} KB)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
