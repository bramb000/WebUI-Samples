/**
 * Keys out the opaque black background on the hero portrait PNG.
 * The source export has RGBA but alpha=255 everywhere (black instead of transparent).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const TARGET = path.join(ROOT, 'src/assets/images/home/hero-portrait-character.png')

/** Pixels at or below this RGB level that touch the canvas edge are treated as background. */
const BG_RGB_MAX = 14

function isBackgroundPixel(r, g, b) {
  return r <= BG_RGB_MAX && g <= BG_RGB_MAX && b <= BG_RGB_MAX
}

function keyBlackBackground(rgba, width, height) {
  const total = width * height
  const visited = new Uint8Array(total)
  const queue = []

  const pushIfBg = (x, y) => {
    const idx = y * width + x
    if (visited[idx])
      return
    const i = idx * 4
    if (!isBackgroundPixel(rgba[i], rgba[i + 1], rgba[i + 2]))
      return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x++) {
    pushIfBg(x, 0)
    pushIfBg(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    pushIfBg(0, y)
    pushIfBg(width - 1, y)
  }

  while (queue.length > 0) {
    const idx = queue.pop()
    const x = idx % width
    const y = (idx - x) / width
    rgba[idx * 4 + 3] = 0

    if (x > 0) pushIfBg(x - 1, y)
    if (x < width - 1) pushIfBg(x + 1, y)
    if (y > 0) pushIfBg(x, y - 1)
    if (y < height - 1) pushIfBg(x, y + 1)
  }

  return visited
}

const { data, info } = await sharp(TARGET)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const rgba = Uint8Array.from(data)
const visited = keyBlackBackground(rgba, info.width, info.height)

let cleared = 0
for (let i = 0; i < visited.length; i++) {
  if (visited[i])
    cleared++
}

await sharp(Buffer.from(rgba), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(TARGET)

console.log(`Processed ${path.relative(ROOT, TARGET)} — keyed ${cleared} background pixels`)
