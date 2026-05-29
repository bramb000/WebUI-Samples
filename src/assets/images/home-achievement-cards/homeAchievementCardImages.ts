/**
 * Home achievement strip art — WebM loops with WebP posters.
 * Source PNGs live alongside; run `npm run assets:optimize:write -- --dir=src/assets/images/home-achievement-cards` after updates.
 */
import guildWebm from './home-achievement-guild.webm'
import guildPoster from './home-achievement-guild.webp'
import aiWebm from './home-achievement-ai.webm'
import aiPoster from './home-achievement-ai.webp'
import edtechWebm from './home-achievement-edtech.webm'
import edtechPoster from './home-achievement-edtech.webp'
import globalWebm from './home-achievement-global.webm'
import globalPoster from './home-achievement-global.webp'

export type HomeAchievementCardArt = {
  thumb: string
  poster: string
}

export const HOME_ACHIEVEMENT_CARD_ART = {
  guild: { thumb: guildWebm, poster: guildPoster },
  ai: { thumb: aiWebm, poster: aiPoster },
  edtech: { thumb: edtechWebm, poster: edtechPoster },
  global: { thumb: globalWebm, poster: globalPoster },
} as const satisfies Record<string, HomeAchievementCardArt>

export type HomeAchievementCardArtKey = keyof typeof HOME_ACHIEVEMENT_CARD_ART

export function homeAchievementCardArt(
  key: HomeAchievementCardArtKey,
): HomeAchievementCardArt {
  return HOME_ACHIEVEMENT_CARD_ART[key]
}
