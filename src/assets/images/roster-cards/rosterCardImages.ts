/**
 * Roster card art keyed by project `id` (see ProjectSelect).
 * Add imports here when new files land in this folder.
 */
import guildCard from './Guild of Guardians.png'
import rocksmithCard from './Rocksmith.png'

export const ROSTER_CARD_IMAGE_BY_ID: Partial<Record<string, string>> = {
  guild: guildCard,
  rocksmith: rocksmithCard,
}

export function rosterCardImage(id: string): string | undefined {
  return ROSTER_CARD_IMAGE_BY_ID[id]
}
