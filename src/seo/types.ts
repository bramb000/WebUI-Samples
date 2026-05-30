export interface RouteMetaSeo {
  title: string
  description: string
  keywords?: string[]
  /** Open Graph type — defaults to website */
  ogType?: 'website' | 'article'
  /** e.g. noindex, nofollow for experiments */
  robots?: string
  /** Path under site root, e.g. /og/custom.jpg — defaults to site OG image */
  ogImage?: string
}

declare module 'vue-router' {
  interface RouteMeta {
    seo?: RouteMetaSeo
    /** Include in sitemap.xml (build script reads router source) */
    sitemap?: boolean
    /** Prerender to static HTML at build time */
    prerender?: boolean
  }
}
