<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ROUTE_SEO } from '../seo/routeMeta'
import {
  articleSchema,
  breadcrumbSchema,
  creativeWorksGraph,
  personSchema,
  profilePageSchema,
  websiteSchema,
} from '../seo/structuredData'

const route = useRoute()

const jsonLd = (id: string, data: object) => ({
  type: 'application/ld+json',
  innerHTML: JSON.stringify(data),
  key: id,
})

const schemaScripts = computed(() => {
  const scripts: ReturnType<typeof jsonLd>[] = [
    jsonLd('schema-person', personSchema),
    jsonLd('schema-website', websiteSchema),
  ]

  const name = route.name ? String(route.name) : ''

  if (name === 'Home') {
    scripts.push(jsonLd('schema-works', creativeWorksGraph))
  }

  if (name === 'About') {
    scripts.push(jsonLd('schema-profile', profilePageSchema()))
  }

  if (name === 'ProjectGuild') {
    const seo = ROUTE_SEO.ProjectGuild
    scripts.push(
      jsonLd('schema-breadcrumb', breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: 'Guild of Guardians', path: '/work/guild-of-guardians' },
      ])),
      jsonLd('schema-article', articleSchema({
        headline: seo.title,
        description: seo.description,
        path: '/work/guild-of-guardians',
      })),
    )
  }

  if (name === 'ProjectRocksmith') {
    const seo = ROUTE_SEO.ProjectRocksmith
    scripts.push(
      jsonLd('schema-breadcrumb', breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Work', path: '/work' },
        { name: 'Rocksmith+', path: '/work/rocksmith' },
      ])),
      jsonLd('schema-article', articleSchema({
        headline: seo.title,
        description: seo.description,
        path: '/work/rocksmith',
      })),
    )
  }

  return scripts
})

useHead({
  script: computed(() => schemaScripts.value) as never,
})
</script>

<template><!-- JSON-LD only --></template>
