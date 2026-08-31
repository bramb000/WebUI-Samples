/**
 * Roster card art keyed by project `id` (see ProjectSelect).
 * Add imports here when new files land in this folder.
 */
import guildCard from './Guild of Guardians.webp'
import helldiversCard from './Helldivers UI.webp'
import rocksmithCard from './Rocksmith.webp'
import loginCard from './Login Interaction.webp'
import artBookCard from '../book/tales/tale-cover.png'
import voiceChatCard from './AI Voice Chat.webp'
import pataponCard from './Rhythm Game.webp'
import jediCard from './laser sword.webp'
import cozyCornerCard from './Cozy Corner.webp'
import planoverseCard from '../planoverse/macro-store-map.png'

export const ROSTER_CARD_IMAGE_BY_ID: Partial<Record<string, string>> = {
  guild: guildCard,
  rocksmith: rocksmithCard,
  helldivers: helldiversCard,
  login: loginCard,
  'art-book': artBookCard,
  'voice-chat': voiceChatCard,
  patapon: pataponCard,
  jedi: jediCard,
  'cozy-corner': cozyCornerCard,
  planoverse: planoverseCard,
}

export function rosterCardImage(id: string): string | undefined {
  return ROSTER_CARD_IMAGE_BY_ID[id]
}
