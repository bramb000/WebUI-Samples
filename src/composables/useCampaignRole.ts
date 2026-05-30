import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { captureEvent } from '../analytics'
import {
  DEFAULT_ROLE_LABEL,
  isCampaignRoleKey,
  labelForCampaignRole,
  readStoredCampaignRole,
  storeCampaignRole,
  type CampaignRoleKey,
} from '../constants/campaignRoles'

function parseRoleQuery(raw: unknown): CampaignRoleKey | null {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value !== 'string' || !isCampaignRoleKey(value)) return null
  return value
}

/** Home hero secondary line: default Product Specialist; overridden by ?role= or session. */
export function useCampaignRole() {
  const route = useRoute()

  const activeRoleKey = computed<CampaignRoleKey | null>(() => {
    const fromQuery = parseRoleQuery(route.query.role)
    if (fromQuery) return fromQuery
    if (route.path === '/') return readStoredCampaignRole()
    return readStoredCampaignRole()
  })

  const roleLabel = computed(() => {
    const key = activeRoleKey.value
    return key ? labelForCampaignRole(key) : DEFAULT_ROLE_LABEL
  })

  watch(
    () => route.query.role,
    (raw) => {
      const key = parseRoleQuery(raw)
      if (key) {
        storeCampaignRole(key)
        captureEvent('landing_role_shown', { role: key, source: 'query' })
      }
    },
    { immediate: true },
  )

  return { roleLabel, activeRoleKey }
}
