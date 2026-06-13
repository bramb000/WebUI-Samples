#!/usr/bin/env node
/**
 * Replace edge-connected near-black gutters with cream (--color-surface #ebe4d6).
 * Card interiors are protected so phone blacks are never keyed out.
 */
import { spawn, spawnSync } from 'node:child_process'
import { mkdir, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const SRC = process.argv[2]
  ?? '/Users/kaleighherron/Movies/CapCut/0613 (1)(2).mov'
const OUT_WEBM = process.argv[3]
  ?? path.join(ROOT, 'src/assets/images/home-work-cards/home-work-guild.webm')
const OUT_POSTER = process.argv[4]
  ?? path.join(ROOT, 'src/assets/images/home-work-cards/home-work-guild.webp')

const WIDTH = 1280
const HEIGHT = 960
const FPS = 30
const CREAM = [235, 228, 214]
/** Seed flood fill — near-pure transition black only. */
const BLACK_MAX = 10
/** Tight halo: only expands from gutter, not from cream card surfaces. */
const HALO_MAX = 18
const HALO_PASSES = 3
/** Min cream pixels to count as a card panel. */
const CARD_MIN_AREA = 8000
/** Surgical card-corner / rim cleanup after gutter pass. */
const BORDER_MAX_DARK = 100
const BORDER_PASSES = 12

function probeDuration(file) {
  const out = spawnSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    file,
  ], { encoding: 'utf8' })
  const d = Number.parseFloat(out.stdout.trim())
  return Number.isFinite(d) ? d : 22
}

function isNearBlack(data, px, max = BLACK_MAX) {
  const i = px * 3
  return data[i] <= max && data[i + 1] <= max && data[i + 2] <= max
}

function isCreamish(data, px) {
  const i = px * 3
  return data[i] >= 198 && data[i + 1] >= 192 && data[i + 2] >= 180
}

function isColorful(data, px) {
  const i = px * 3
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  return mx - mn > 35 && mx > 60
}

function cardinals(px, width, height) {
  const x = px % width
  const y = (px / width) | 0
  return [
    x > 0 ? px - 1 : -1,
    x < width - 1 ? px + 1 : -1,
    y > 0 ? px - width : -1,
    y < height - 1 ? px + width : -1,
  ].filter(n => n >= 0)
}

function neighbors8(px, width, height) {
  const x = px % width
  const y = (px / width) | 0
  const out = []
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy)
        continue
      const nx = x + dx
      const ny = y + dy
      if (nx >= 0 && ny >= 0 && nx < width && ny < height)
        out.push(ny * width + nx)
    }
  }
  return out
}

function isCreamRegion(data, px, gutter) {
  return gutter[px] || isCreamish(data, px)
}

function isBorderNeutral(data, px, max = BORDER_MAX_DARK) {
  const i = px * 3
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  return mx <= max && mx - mn <= 32
}

/** Phone/UI — never touch pixels connected to color content. */
function buildPhoneContentMask(data, width, height) {
  const phone = new Uint8Array(width * height)
  const stack = []

  for (let px = 0; px < width * height; px++) {
    if (!isColorful(data, px) || phone[px])
      continue
    phone[px] = 1
    stack.push(px)
  }

  while (stack.length) {
    const px = stack.pop()
    for (const n of cardinals(px, width, height)) {
      if (phone[n] || isCreamish(data, n))
        continue
      phone[n] = 1
      stack.push(n)
    }
  }

  return phone
}

/** Remove only dark rounded-corner rims inside card panels. */
function removeCardBorderFringe(data, width, height, boxes, gaps, gutter) {
  const phone = buildPhoneContentMask(data, width, height)
  const cleared = new Uint8Array(width * height)

  const tryClearBorder = (px, maxDark, requireCardinalCream) => {
    if (cleared[px] || phone[px] || isCreamish(data, px) || !isBorderNeutral(data, px, maxDark))
      return false

    if (neighbors8(px, width, height).some(n => isColorful(data, n)))
      return false

    const isCreamNeighbor = (n) => isCreamRegion(data, n, gutter) || cleared[n] || isCreamish(data, n)

    if (requireCardinalCream) {
      const creamN = cardinals(px, width, height).filter(isCreamNeighbor).length
      if (creamN < 2)
        return false
    }
    else if (!neighbors8(px, width, height).some(isCreamNeighbor)) {
      return false
    }

    paintCream(data, px)
    cleared[px] = 1
    return true
  }

  for (let pass = 0; pass < BORDER_PASSES; pass++) {
    const maxDark = 35 + pass * 6
    let changed = false

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!inCard(x, y, boxes) || inGap(x, y, gaps))
          continue

        if (tryClearBorder(y * width + x, maxDark, true))
          changed = true
      }
    }

    if (!changed)
      break
  }

  // Corner wedges often touch cream only diagonally — allow any 8-neighbor cream.
  for (let pass = 0; pass < BORDER_PASSES; pass++) {
    const maxDark = 35 + pass * 6
    let changed = false

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!inCard(x, y, boxes) || inGap(x, y, gaps))
          continue

        if (tryClearBorder(y * width + x, maxDark, false))
          changed = true
      }
    }

    if (!changed)
      break
  }
}

function paintCream(data, px) {
  const i = px * 3
  data[i] = CREAM[0]
  data[i + 1] = CREAM[1]
  data[i + 2] = CREAM[2]
}

function findCardBboxes(data, width, height) {
  const seen = new Uint8Array(width * height)
  const boxes = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = y * width + x
      if (seen[px] || !isCreamish(data, px))
        continue

      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let area = 0
      const stack = [px]
      seen[px] = 1

      while (stack.length) {
        const p = stack.pop()
        area++
        const pxX = p % width
        const pxY = (p / width) | 0
        minX = Math.min(minX, pxX)
        maxX = Math.max(maxX, pxX)
        minY = Math.min(minY, pxY)
        maxY = Math.max(maxY, pxY)

        for (const n of cardinals(p, width, height)) {
          if (!seen[n] && isCreamish(data, n)) {
            seen[n] = 1
            stack.push(n)
          }
        }
      }

      if (area >= CARD_MIN_AREA)
        boxes.push({ minX, minY, maxX, maxY })
    }
  }

  boxes.sort((a, b) => a.minY - b.minY)
  return boxes
}

/** Vertical gutters between stacked card panels — still keyed to cream. */
function buildGapZones(boxes) {
  const gaps = []
  for (let i = 0; i < boxes.length - 1; i++) {
    const a = boxes[i]
    const b = boxes[i + 1]
    const minY = a.maxY + 1
    const maxY = b.minY - 1
    if (maxY <= minY)
      continue
    gaps.push({
      minX: Math.min(a.minX, b.minX),
      maxX: Math.max(a.maxX, b.maxX),
      minY,
      maxY,
    })
  }
  return gaps
}

function inCard(x, y, boxes) {
  return boxes.some(b => x >= b.minX && x <= b.maxX && y >= b.minY && y <= b.maxY)
}

function inGap(x, y, gaps) {
  return gaps.some(g => x >= g.minX && x <= g.maxX && y >= g.minY && y <= g.maxY)
}

function buildCardInteriorMask(data, width, height, boxes, gaps) {
  const protectedPx = new Uint8Array(width * height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!inCard(x, y, boxes) || inGap(x, y, gaps))
        continue
      const px = y * width + x
      protectedPx[px] = 1
    }
  }

  return protectedPx
}

function replaceEdgeConnectedBlack(data, width, height) {
  const boxes = findCardBboxes(data, width, height)
  const gaps = buildGapZones(boxes)
  const protectedPx = buildCardInteriorMask(data, width, height, boxes, gaps)

  const gutter = new Uint8Array(width * height)
  const stack = []

  const tryPush = (x, y) => {
    const px = y * width + x
    if (gutter[px] || protectedPx[px] || !isNearBlack(data, px))
      return
    gutter[px] = 1
    stack.push(px)
  }

  for (let x = 0; x < width; x++) {
    tryPush(x, 0)
    tryPush(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    tryPush(0, y)
    tryPush(width - 1, y)
  }

  while (stack.length) {
    const px = stack.pop()
    paintCream(data, px)

    const x = px % width
    const y = (px / width) | 0
    if (x > 0)
      tryPush(x - 1, y)
    if (x < width - 1)
      tryPush(x + 1, y)
    if (y > 0)
      tryPush(x, y - 1)
    if (y < height - 1)
      tryPush(x, y + 1)
  }

  for (let pass = 0; pass < HALO_PASSES; pass++) {
    let changed = false
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const px = y * width + x
        if (gutter[px] || protectedPx[px] || !isNearBlack(data, px, HALO_MAX))
          continue
        const neighbors = [
          x > 0 ? px - 1 : -1,
          x < width - 1 ? px + 1 : -1,
          y > 0 ? px - width : -1,
          y < height - 1 ? px + width : -1,
        ]
        if (!neighbors.some((n) => n >= 0 && gutter[n]))
          continue
        gutter[px] = 1
        paintCream(data, px)
        changed = true
      }
    }
    if (!changed)
      break
  }

  removeCardBorderFringe(data, width, height, boxes, gaps, gutter)
}

async function processFrame(buffer) {
  const { data, info } = await sharp(buffer)
    .resize(WIDTH, HEIGHT, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = new Uint8Array(data)
  replaceEdgeConnectedBlack(pixels, info.width, info.height)
  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: 3 } })
    .png()
    .toBuffer()
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'inherit'] })
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`)))
  })
}

async function main() {
  const duration = probeDuration(SRC)
  console.log(`source: ${SRC}`)
  console.log(`duration: ${duration.toFixed(3)}s @ ${FPS}fps`)

  await mkdir(path.dirname(OUT_WEBM), { recursive: true })

  const decode = spawn('ffmpeg', [
    '-i', SRC,
    '-t', String(duration),
    '-vf', `fps=${FPS},scale=${WIDTH}:${HEIGHT}:flags=lanczos`,
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-',
  ], { stdio: ['ignore', 'pipe', 'inherit'] })

  const encode = spawn('ffmpeg', [
    '-y',
    '-f', 'image2pipe',
    '-framerate', String(FPS),
    '-i', '-',
    '-an',
    '-c:v', 'libvpx-vp9',
    '-b:v', '0',
    '-crf', '26',
    '-row-mt', '1',
    '-pix_fmt', 'yuv420p',
    OUT_WEBM,
  ], { stdio: ['pipe', 'inherit', 'inherit'] })

  let frame = 0
  let carry = Buffer.alloc(0)
  const PNG_END = Buffer.from([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])

  const processStream = async () => {
    for await (const chunk of decode.stdout) {
      carry = Buffer.concat([carry, chunk])
      let end = carry.indexOf(PNG_END)
      while (end !== -1) {
        const png = carry.subarray(0, end + PNG_END.length)
        carry = carry.subarray(end + PNG_END.length)
        const out = await processFrame(png)
        encode.stdin.write(out)
        frame++
        if (frame % 30 === 0)
          console.log(`processed ${frame} frames`)
        end = carry.indexOf(PNG_END)
      }
    }
    encode.stdin.end()
  }

  await Promise.all([processStream(), new Promise((res, rej) => {
    encode.on('close', c => c === 0 ? res() : rej(new Error(`encode exited ${c}`)))
  })])

  console.log(`encoded ${frame} frames → ${OUT_WEBM}`)

  const posterPng = path.join(path.dirname(OUT_WEBM), '.guild-poster-tmp.png')
  await run('ffmpeg', ['-y', '-ss', '0', '-i', OUT_WEBM, '-frames:v', '1', posterPng])
  await sharp(posterPng).webp({ quality: 82 }).toFile(OUT_POSTER)
  await unlink(posterPng)
  console.log(`poster → ${OUT_POSTER}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
