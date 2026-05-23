#!/usr/bin/env node
/** Rewrite static asset imports to .webp when a sibling exists. */
import { readFile, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const TARGETS = [
  'src/views/ProjectRocksmith.vue',
  'src/views/ProjectGuild.vue',
  'src/views/Home.vue',
  'src/assets/images/roster-cards/rosterCardImages.ts',
]

async function exists(p) {
  try {
    await access(p)
    return true
  }
  catch {
    return false
  }
}

async function migrateFile(rel) {
  const filePath = path.join(ROOT, rel)
  let src = await readFile(filePath, 'utf8')
  let changes = 0
  const re = /from '(\.\.\/[^']+\.(png|gif|jpe?g))'/gi

  const replacements = []
  for (const m of src.matchAll(re)) {
    const importPath = m[1]
    if (/\.gif$/i.test(importPath))
      continue
    const abs = path.join(path.dirname(filePath), importPath)
    const webp = abs.replace(/\.(png|gif|jpe?g)$/i, '.webp')
    if (await exists(webp)) {
      const newImport = importPath.replace(/\.(png|gif|jpe?g)$/i, '.webp')
      replacements.push([m[0], `from '${newImport}'`])
    }
  }

  for (const [old, neu] of replacements) {
    if (src.includes(old)) {
      src = src.replace(old, neu)
      changes++
    }
  }

  if (changes) {
    await writeFile(filePath, src)
    console.log(`${rel}: ${changes} imports → webp`)
  }
}

for (const t of TARGETS)
  await migrateFile(t)
