#!/usr/bin/env node
/**
 * List large assets under src/assets and src/shaders.
 * Usage: node scripts/asset-inventory.mjs [--min-kb=400]
 */
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const minKbArg = process.argv.find(a => a.startsWith('--min-kb='))
const MIN_KB = minKbArg ? Number(minKbArg.split('=')[1]) : 400

const SCAN_DIRS = [
  path.join(ROOT, 'src/assets'),
  path.join(ROOT, 'src/shaders'),
]

const EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.json'])

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
    else if (EXT.has(path.extname(ent.name).toLowerCase()))
      out.push(full)
  }
  return out
}

function fmtKb(bytes) {
  return `${(bytes / 1024).toFixed(1)}`
}

async function main() {
  const files = []
  for (const dir of SCAN_DIRS)
    await walk(dir, files)

  const rows = []
  let total = 0
  for (const f of files) {
    const st = await stat(f)
    total += st.size
    if (st.size >= MIN_KB * 1024)
      rows.push({ rel: path.relative(ROOT, f), bytes: st.size })
  }
  rows.sort((a, b) => b.bytes - a.bytes)

  const byFolder = new Map()
  for (const r of rows) {
    const parts = r.rel.split(path.sep)
    const folder = parts.slice(0, 3).join(path.sep)
    byFolder.set(folder, (byFolder.get(folder) ?? 0) + r.bytes)
  }

  console.log(`\nAssets ≥ ${MIN_KB} KB (${rows.length} files)\n`)
  console.log('KB\tPATH')
  console.log('—\t—')
  for (const r of rows.slice(0, 50))
    console.log(`${fmtKb(r.bytes).padStart(8)}\t${r.rel}`)
  if (rows.length > 50)
    console.log(`… and ${rows.length - 50} more`)

  console.log('\nBy folder (top-level under src/):')
  const folderRows = [...byFolder.entries()].sort((a, b) => b[1] - a[1])
  for (const [folder, bytes] of folderRows.slice(0, 15))
    console.log(`  ${(bytes / 1024 / 1024).toFixed(2)} MB\t${folder}`)

  console.log(`\nScanned total: ${(total / 1024 / 1024).toFixed(2)} MB (${files.length} media files)\n`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
