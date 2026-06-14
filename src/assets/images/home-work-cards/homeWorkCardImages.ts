/**
 * Home work card visuals — WebM loops with WebP posters.
 * Run `npm run assets:optimize:write -- --dir=src/assets/images/home-work-cards` after raster updates.
 */
import rocksmithWebm from './home-work-rocksmith.webm'
import rocksmithPoster from './home-work-rocksmith.webp'
import guildWebm from './home-work-guild.webm'
import guildPoster from './home-work-guild.webp'

export type HomeWorkCardArt = {
  /** Looping WebM */
  video?: string
  poster?: string
  /** Empty visual slot — reserves 4:3 layout space until asset lands */
  visualPlaceholder?: boolean
  /** Skip recessed panel / opaque fill so alpha WebM shows through */
  transparentVisual?: boolean
  /** Soft edge blend when video bg is matched to --color-surface */
  featherVisualEdges?: boolean | 'strong'
}

export const HOME_WORK_CARD_ART = {
  rocksmith: { video: rocksmithWebm, poster: rocksmithPoster, featherVisualEdges: true },
  guild: { video: guildWebm, poster: guildPoster },
} as const satisfies Record<string, HomeWorkCardArt>

export type HomeWorkCardArtKey = keyof typeof HOME_WORK_CARD_ART

export function homeWorkCardArt(key: HomeWorkCardArtKey): HomeWorkCardArt {
  return HOME_WORK_CARD_ART[key]
}
