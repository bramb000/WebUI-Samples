/**
 * Roster card art keyed by project `id` (see ProjectSelect).
 * Add imports here when new files land in this folder.
 */
import guildCard from './Guild of Guardians.png'
import helldiversCard from './Helldivers UI.png'
import rocksmithCard from './Rocksmith.png'
import loginCard from './Login Interaction.png'
import voiceChatCard from './AI Voice Chat.png'
import pataponCard from './Rhythm Game.png'
import jediCard from './laser sword.png'

export const ROSTER_CARD_IMAGE_BY_ID: Partial<Record<string, string>> = {
  guild: guildCard,
  rocksmith: rocksmithCard,
  helldivers: helldiversCard,
  login: loginCard,
  'voice-chat': voiceChatCard,
  patapon: pataponCard,
  jedi: jediCard,
}

export function rosterCardImage(id: string): string | undefined {
  return ROSTER_CARD_IMAGE_BY_ID[id]
}
