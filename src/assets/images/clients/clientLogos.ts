import immutableLogo from './immutable.png'
import ubisoftLogo from './ubisoft.png'

export const CLIENT_LOGOS = {
  Immutable: immutableLogo,
  Ubisoft: ubisoftLogo,
} as const

export type ClientName = keyof typeof CLIENT_LOGOS
