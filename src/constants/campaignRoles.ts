export const DEFAULT_ROLE_LABEL = 'Product Specialist' as const

export const CAMPAIGN_ROLE_LABELS = {
  'game-designer': 'Game designer',
  'product-designer': 'Product designer',
  'ui-ux-designer': 'UI/UX designer',
  'product-manager': 'Product manager',
} as const

export type CampaignRoleKey = keyof typeof CAMPAIGN_ROLE_LABELS

const SESSION_KEY = 'bramha_campaign_role'

export function isCampaignRoleKey(value: string): value is CampaignRoleKey {
  return value in CAMPAIGN_ROLE_LABELS
}

export function labelForCampaignRole(key: CampaignRoleKey): string {
  return CAMPAIGN_ROLE_LABELS[key]
}

export function readStoredCampaignRole(): CampaignRoleKey | null {
  if (typeof sessionStorage === 'undefined') return null
  const stored = sessionStorage.getItem(SESSION_KEY)
  return stored && isCampaignRoleKey(stored) ? stored : null
}

export function storeCampaignRole(key: CampaignRoleKey | null): void {
  if (typeof sessionStorage === 'undefined') return
  if (key) sessionStorage.setItem(SESSION_KEY, key)
  else sessionStorage.removeItem(SESSION_KEY)
}
