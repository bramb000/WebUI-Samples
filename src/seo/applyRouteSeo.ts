import { useHead } from '@unhead/vue'
import { computed, watch } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  joinKeywords,
  SITE_NAME,
  SITE_TAGLINE,
} from './site'
import { isCampaignRoleKey, labelForCampaignRole } from '../constants/campaignRoles'
import { DEFAULT_ROUTE_SEO, ROUTE_SEO } from './routeMeta'
import type { RouteMetaSeo } from './types'

function resolveSeo(route: RouteLocationNormalizedLoaded): RouteMetaSeo {
  if (route.meta.seo) return route.meta.seo
  const byName = route.name ? ROUTE_SEO[String(route.name)] : undefined
  return byName ?? DEFAULT_ROUTE_SEO
}

export function useRouteSeo(route: RouteLocationNormalizedLoaded) {
  const seo = computed(() => resolveSeo(route))
  const canonical = computed(() => absoluteUrl(route.fullPath.split('?')[0] || '/'))
  const ogImage = computed(() => absoluteUrl(seo.value.ogImage ?? DEFAULT_OG_IMAGE_PATH))

  useHead(
    computed(() => {
      const meta = seo.value
      const keywords = meta.keywords?.length ? joinKeywords(meta.keywords) : joinKeywords()
      const robots = meta.robots ?? 'index, follow, max-image-preview:large'

      const roleRaw = route.query.role
      const roleParam = Array.isArray(roleRaw) ? roleRaw[0] : roleRaw
      const campaignTitle =
        route.name === 'Home' && typeof roleParam === 'string' && isCampaignRoleKey(roleParam)
          ? `${meta.title} · ${labelForCampaignRole(roleParam)}`
          : meta.title

      return {
        title: campaignTitle,
        meta: [
          { name: 'description', content: meta.description },
          { name: 'keywords', content: keywords },
          { name: 'author', content: SITE_NAME },
          { name: 'robots', content: robots },
          { property: 'og:title', content: campaignTitle },
          { property: 'og:description', content: meta.description },
          { property: 'og:type', content: meta.ogType ?? 'website' },
          { property: 'og:url', content: canonical.value },
          { property: 'og:site_name', content: SITE_NAME },
          { property: 'og:image', content: ogImage.value },
          { property: 'og:locale', content: 'en_US' },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: campaignTitle },
          { name: 'twitter:description', content: meta.description },
          { name: 'twitter:image', content: ogImage.value },
        ],
        link: [{ rel: 'canonical', href: canonical.value }],
      }
    }),
  )

  watch(
    () => route.fullPath,
    () => {
      document.documentElement.lang = 'en'
    },
    { immediate: true },
  )

  return { seo, siteTagline: SITE_TAGLINE }
}
