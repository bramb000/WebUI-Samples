/**
 * Generates Open Graph JPEGs in public/ for social previews.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')

const ASSETS = [
  {
    source: path.join(ROOT, 'src/assets/images/about/about-2.webp'),
    out: path.join(ROOT, 'public/og-image.jpg'),
    label: 'og-image.jpg',
  },
  {
    source: path.join(ROOT, 'src/assets/images/roster-cards/Guild of Guardians.webp'),
    out: path.join(ROOT, 'public/og-guild.jpg'),
    label: 'og-guild.jpg',
  },
  {
    source: path.join(ROOT, 'src/assets/images/roster-cards/Rocksmith.webp'),
    out: path.join(ROOT, 'public/og-rocksmith.jpg'),
    label: 'og-rocksmith.jpg',
  },
]

for (const { source, out, label } of ASSETS) {
  if (!fs.existsSync(source)) {
    console.warn(`prepare-seo-assets: missing ${source}, skipping ${label}`)
    continue
  }
  await sharp(source)
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(out)
  console.log(`Wrote public/${label} (1200×630)`)
}
