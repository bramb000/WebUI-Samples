#!/usr/bin/env node
/**
 * Optimize images under src/assets (and src/shaders).
 *
 * - PNG/JPEG → WebP (sharp)
 * - GIF → WebM (ffmpeg) or animated WebP (sharp fallback)
 *
 * Usage:
 *   node scripts/optimize-assets.mjs [--write] [--replace] [--force]
 */
import { spawn } from 'node:child_process'
import { readdir, stat, access, unlink } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const WRITE = process.argv.includes('--write')
const REPLACE = process.argv.includes('--replace')
const FORCE = process.argv.includes('--force')
const dirArg = process.argv.find(a => a.startsWith('--dir='))
const SCAN_ROOT = dirArg
  ? path.join(ROOT, dirArg.split('=')[1])
  : path.join(ROOT, 'src/assets')

const minKbArg = process.argv.find(a => a.startsWith('--min-kb='))
const MIN_INPUT_KB = minKbArg ? Number(minKbArg.split('=')[1]) : 200
const WEBP_QUALITY = 82
const MAX_EDGE = 1920
const MASK_MAX_EDGE = 1024

async function fileExists(p) {
  try {
    await access(p)
    return true
  }
  catch {
    return false
  }
}

async function walk(dir, out = []) {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  }
  catch {
    return out
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory())
      await walk(full, out)
    else {
      const ext = path.extname(ent.name).toLowerCase()
      if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext))
        out.push(full)
    }
  }
  return out
}

function hasFfmpeg() {
  return new Promise((resolve) => {
    const child = spawn('ffmpeg', ['-version'], { stdio: 'ignore' })
    child.on('error', () => resolve(false))
    child.on('close', code => resolve(code === 0))
  })
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'pipe' })
    let stderr = ''
    child.on('error', reject)
    child.stderr.on('data', d => { stderr += d })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} exited ${code}: ${stderr}`))
    })
  })
}

/**
 * Filmstrip / ezgif GIFs must not go through Sharp — it destroys layout.
 * ffmpeg decodes them correctly as video.
 */
async function gifToWebm(input, output) {
  await run('ffmpeg', [
    '-y',
    '-i', input,
    '-c:v', 'libvpx-vp9',
    '-b:v', '0',
    '-crf', '24',
    '-an',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    output,
  ])
}

async function loadSharp() {
  try {
    return (await import('sharp')).default
  }
  catch {
    console.error('Install sharp: npm i -D sharp')
    process.exit(1)
  }
}

async function rasterToWebp(sharp, input, output, maxEdge = MAX_EDGE) {
  const img = sharp(input)
  const meta = await img.metadata()
  const w = meta.width ?? maxEdge
  const h = meta.height ?? maxEdge
  const scale = Math.min(1, maxEdge / Math.max(w, h))
  let pipeline = img
  if (scale < 1) {
    pipeline = pipeline.resize(Math.round(w * scale), Math.round(h * scale), {
      fit: 'inside',
    })
  }
  await pipeline.webp({
    quality: WEBP_QUALITY,
    effort: 4,
  }).toFile(output)
}

async function main() {
  const sharp = await loadSharp()
  const ffmpegOk = await hasFfmpeg()
  if (!ffmpegOk) {
    console.warn('ffmpeg not required for PNG/JPEG. GIF→WebM skipped (install ffmpeg).\n')
  }
  else {
    console.log('ffmpeg found — filmstrip GIFs → WebM (never Sharp WebP)\n')
  }

  const files = await walk(SCAN_ROOT)
  const shaderMask = path.join(ROOT, 'src/shaders/IMG_0558.PNG')
  if (await fileExists(shaderMask))
    files.push(shaderMask)

  let saved = 0
  let considered = 0

  for (const input of files) {
    const st = await stat(input)
    if (st.size < MIN_INPUT_KB * 1024)
      continue
    considered++
    const ext = path.extname(input).toLowerCase()
    const base = input.slice(0, -ext.length)
    const rel = path.relative(ROOT, input)
    const isMask = rel.includes('shaders/IMG_0558')

    if (ext === '.gif') {
      if (!ffmpegOk) {
        console.warn(`skip ${rel} (needs ffmpeg for WebM; keep .gif in app)`)
        continue
      }
      const webm = `${base}.webm`
      const badWebp = `${base}.webp`
      if (await fileExists(webm) && !FORCE) {
        console.log(`skip (exists) ${rel} → ${path.basename(webm)}`)
        continue
      }
      console.log(`${WRITE ? 'write' : 'dry'} ${rel} → ${path.basename(webm)}`)
      if (WRITE) {
        await gifToWebm(input, webm)
        const outSt = await stat(webm)
        saved += st.size - outSt.size
        console.log(`  ${(st.size / 1024).toFixed(0)} KB → ${(outSt.size / 1024).toFixed(0)} KB`)
        if (await fileExists(badWebp)) {
          try {
            await unlink(badWebp)
            console.log(`  removed broken ${path.basename(badWebp)}`)
          }
          catch { /* ignore */ }
        }
        if (REPLACE) {
          try { await unlink(input) }
          catch { /* keep source */ }
        }
      }
      continue
    }

    const webp = `${base}.webp`
    if (await fileExists(webp) && !FORCE) {
      console.log(`skip (exists) ${rel} → .webp`)
      continue
    }
    console.log(`${WRITE ? 'write' : 'dry'} ${rel} → ${path.basename(webp)}`)
    if (WRITE) {
      const edge = isMask ? MASK_MAX_EDGE : MAX_EDGE
      await rasterToWebp(sharp, input, webp, edge)
      const outSt = await stat(webp)
      const delta = st.size - outSt.size
      saved += Math.max(0, delta)
      console.log(`  ${(st.size / 1024).toFixed(0)} KB → ${(outSt.size / 1024).toFixed(0)} KB (${delta > 0 ? '-' : '+'}${Math.abs(delta / 1024).toFixed(0)} KB)`)
      if (REPLACE) {
        try { await unlink(input) }
        catch { /* keep source */ }
      }
    }
  }

  console.log(`\n${considered} files considered. ${WRITE ? `Est. saved ~${(saved / 1024 / 1024).toFixed(2)} MB on disk (originals kept unless --replace)` : 'Re-run with --write to generate files.'}\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
