import immutableLogo from './immutable.png'
import relianceGamesLogo from './reliance-games.svg'
import ubisoftLogo from './ubisoft.png'

export const CLIENT_LOGOS = {
  Immutable: immutableLogo,
  'Reliance Games': relianceGamesLogo,
  Ubisoft: ubisoftLogo,
} as const

export const HERO_COMPANY_LOGOS = [
  { name: 'Immutable', logo: CLIENT_LOGOS.Immutable },
  { name: 'Ubisoft', logo: CLIENT_LOGOS.Ubisoft },
] as const

export type ClientName = keyof typeof CLIENT_LOGOS
