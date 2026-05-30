# SEO & LLM guide — bramha.work

## Edit copy

| What | Where |
|------|--------|
| Page titles & descriptions | [`src/seo/routeMeta.ts`](../src/seo/routeMeta.ts) |
| Site URL | `VITE_SITE_URL` env or [`src/seo/site.ts`](../src/seo/site.ts) |
| LLM summary | [`public/llms.txt`](../public/llms.txt), [`public/llms-full.txt`](../public/llms-full.txt) |
| Campaign hero roles | [`src/constants/campaignRoles.ts`](../src/constants/campaignRoles.ts) |
| Indexable routes | [`src/seo/indexablePaths.ts`](../src/seo/indexablePaths.ts) + [`scripts/seo-routes.mjs`](../scripts/seo-routes.mjs) (keep in sync) |

## Build

```bash
npm run build
```

Pipeline: `prepare-seo-assets` → `vue-tsc` → `vite build` → `prerender` → `sitemap` → `seo-smoke-test`

Individual steps:

```bash
npm run build:app
npm run seo:prerender
npm run seo:sitemap
node scripts/seo-smoke-test.mjs
```

## Campaign links (home hero)

Default secondary line: **Product Specialist**.

| Link | Hero label |
|------|------------|
| `https://bramha.work/?role=game-designer` | Game designer |
| `https://bramha.work/?role=product-designer` | Product designer |
| `https://bramha.work/?role=ui-ux-designer` | UI/UX designer |
| `https://bramha.work/?role=product-manager` | Product manager |

Organic Google search does **not** pass the query to your site; use these links in LinkedIn, email, and ads.

## Post-deploy checklist

1. [Google Search Console](https://search.google.com/search-console) — verify `bramha.work`
2. Submit sitemap: `https://bramha.work/sitemap.xml`
3. Request indexing for `/`, case studies, `/about`
4. Test rich results: [Rich Results Test](https://search.google.com/test/rich-results)
5. Share a case study on LinkedIn — confirm OG image (`og-guild.jpg`, `og-rocksmith.jpg`)
6. Confirm `https://bramha.work/llms.txt` is reachable for LLM crawlers

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_SITE_URL` | Canonical host (default `https://bramha.work`) |
| `VITE_BUILD_DATE` | Optional JSON-LD `dateModified` |

## CI

Deploy workflow installs Playwright Chromium, runs full `npm run build` including smoke tests.
