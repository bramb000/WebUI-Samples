export type HeroTaglinePhrase = {
  from: string
  to: string
}

export const HERO_TAGLINE_PHRASES: readonly HeroTaglinePhrase[] = [
  { from: 'installs', to: 'engagement' },
  { from: 'engagement', to: 'retention' },
  { from: 'retention', to: 'revenue' },
]

export function heroTaglineTail(phrase: HeroTaglinePhrase): string {
  return `${phrase.from} into ${phrase.to}`
}

/** Widest cycling segment — reserves layout space so surrounding copy does not shift. */
export const HERO_TAGLINE_LONGEST_TAIL = heroTaglineTail(HERO_TAGLINE_PHRASES[1]!)

export const HERO_TAGLINE_TAILS = HERO_TAGLINE_PHRASES.map(heroTaglineTail)

type TaglineSegment = {
  text: string
  accent: boolean
}

/** Accent the metric words once fully typed; leave " into " plain. */
export function parseHeroTaglineTailSegments(
  displayed: string,
  phrase: HeroTaglinePhrase,
): TaglineSegment[] {
  const { from, to } = phrase
  const intoSep = ' into '
  const segments: TaglineSegment[] = []

  if (displayed.length === 0)
    return segments

  if (displayed.length <= from.length) {
    segments.push({ text: displayed, accent: displayed === from })
    return segments
  }

  segments.push({ text: from, accent: true })
  const afterFrom = displayed.slice(from.length)

  if (afterFrom.length === 0)
    return segments

  if (afterFrom.length < intoSep.length) {
    segments.push({ text: afterFrom, accent: false })
    return segments
  }

  if (afterFrom.startsWith(intoSep)) {
    segments.push({ text: intoSep, accent: false })
    const toPart = afterFrom.slice(intoSep.length)
    if (toPart.length > 0)
      segments.push({ text: toPart, accent: toPart === to })
    return segments
  }

  segments.push({ text: afterFrom, accent: false })
  return segments
}
