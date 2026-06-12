import type { TalesBookImageKey } from '../../../constants/alchemistBookData'

import taleCover from './tales/tale-cover.png'
import taleBack from './tales/tale-back.png'
import tale07 from './tales/tale-07.png'
import tale08 from './tales/tale-08.png'
import tale09 from './tales/tale-09.png'
import tale10 from './tales/tale-10.png'
import tale11 from './tales/tale-11.png'
import tale12 from './tales/tale-12.png'
import tale13 from './tales/tale-13.png'

/** Explicit Vite imports — reliable bundling for the Tales storybook. */
export const TALES_IMAGE_SRC_BY_KEY: Record<TalesBookImageKey, string> = {
  'tale-cover': taleCover,
  'tale-back': taleBack,
  'tale-07': tale07,
  'tale-08': tale08,
  'tale-09': tale09,
  'tale-10': tale10,
  'tale-11': tale11,
  'tale-12': tale12,
  'tale-13': tale13,
}

export const ALL_TALES_IMAGE_SRC_ENTRIES = Object.entries(TALES_IMAGE_SRC_BY_KEY) as [
  TalesBookImageKey,
  string,
][]
