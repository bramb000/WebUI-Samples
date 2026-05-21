<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TocProceduralRow from './TocProceduralRow.vue'

interface TocItem {
  id: string
  text: string
}

const items = ref<TocItem[]>([])
const activeId = ref<string>('')
const tocRootRef = ref<HTMLElement | null>(null)
const activeRowRef = ref<HTMLElement | null>(null)

/** Sidebar column is narrow; keep labels scannable and match canvas mask width. */
const TOC_LABEL_MAX_CHARS = 44

const STOPWORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'by', 'for', 'from', 'in', 'into', 'is', 'of', 'on', 'or', 'over',
  'the', 'to', 'up', 'via', 'with', 'without',
])

function toTwoWords(raw: string): string {
  const s = raw.replace(/\s+/g, ' ').trim()
  if (!s)
    return ''

  // Split on spaces, strip punctuation edges, keep alphanumerics + dashes.
  const parts = s
    .split(' ')
    .map(w => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ''))
    .filter(Boolean)

  const keep = parts
    .filter(w => !STOPWORDS.has(w.toLowerCase()))

  const words = (keep.length >= 2 ? keep : parts).slice(0, 2)
  return words.join(' ')
}

let observer: IntersectionObserver | null = null
let scrollRootEl: HTMLElement | null = null

function formatTocLabel(raw: string): string {
  const s = raw.replace(/\s+/g, ' ').trim()
  const short = toTwoWords(s)
  if (short)
    return short
  if (s.length <= TOC_LABEL_MAX_CHARS)
    return s
  return `${s.slice(0, TOC_LABEL_MAX_CHARS - 1).trimEnd()}…`
}

function slugifyHeading(text: string, index: number) {
  const s = text
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
  return s || `section-${index}`
}

function getScrollParent(el: HTMLElement | null): HTMLElement | Window {
  if (!el)
    return window
  let p: HTMLElement | null = el.parentElement
  while (p) {
    const { overflowY } = getComputedStyle(p)
    if (/(auto|scroll|overlay)/.test(overflowY) && p.scrollHeight > p.clientHeight + 4)
      return p
    p = p.parentElement
  }
  return window
}

function collectHeadings() {
  if (observer) {
    observer.disconnect()
    observer = null
  }

  items.value.length = 0
  activeId.value = ''
  scrollRootEl = null

  const caseRoot = tocRootRef.value?.closest('.animate-fade-in') ?? null
  if (!caseRoot) {
    return
  }

  const headings = Array.from(caseRoot.querySelectorAll('section h2, section h3')) as HTMLElement[]
  if (headings.length === 0) {
    return
  }

  const firstTarget = headings[0]!
  scrollRootEl =
    (firstTarget.closest('.dl-embedded') as HTMLElement | null)
    ?? ((getScrollParent(firstTarget) instanceof HTMLElement)
      ? (getScrollParent(firstTarget) as HTMLElement)
      : null)

  const usedSectionIds = new Set<string>()
  headings.forEach((heading, index) => {
    const override = heading.dataset.tocLabel?.trim()
    const textRaw = heading.textContent?.trim().replace(/\s+/g, ' ') || ''
    const displaySource = (override || textRaw).trim()
    if (!displaySource)
      return

    /** Slug IDs follow the on-page heading copy, not the shortened TOC label. */
    const slug = slugifyHeading(textRaw || override || displaySource, index)
    const text = formatTocLabel(displaySource)

    const sec = heading.closest('section') as HTMLElement | null
    let scrollId: string
    if (sec) {
      if (!sec.id) {
        let candidate = slug
        for (let n = 2; document.getElementById(candidate); n++)
          candidate = `${slug}-${n}`
        sec.id = candidate
        scrollId = sec.id
        usedSectionIds.add(sec.id)
      }
      else if (!usedSectionIds.has(sec.id)) {
        usedSectionIds.add(sec.id)
        scrollId = sec.id
      }
      else {
        const hid = `toc-h2-${slug}-${index}`
        if (!heading.id)
          heading.id = hid
        scrollId = heading.id
      }
    }
    else {
      const hid = heading.id || `toc-h2-${slug}-${index}`
      if (!heading.id)
        heading.id = hid
      scrollId = heading.id
    }

    items.value.push({ id: scrollId, text })
  })

  const ioOpts: IntersectionObserverInit =
    scrollRootEl
      ? {
          root: scrollRootEl,
          rootMargin: '-12% 0px -45% 0px',
          threshold: [0, 0.15, 0.35, 0.55, 0.75, 1.0],
        }
      : {
          rootMargin: '-10% 0px -60% 0px',
          threshold: [0, 0.25, 0.5, 0.75, 1.0],
        }

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = visibleEntries[0]!.target.id
        activeId.value = id
      }
    },
    ioOpts,
  )

  items.value.forEach((item) => {
    const el = document.getElementById(item.id)
    if (el)
      observer!.observe(el)
  })
}

function scrollTocToActive() {
  const el = activeRowRef.value
  if (!el)
    return
  el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
}

function setActiveRowRef(id: string) {
  return (el: Element | ComponentPublicInstance | null) => {
    if (activeId.value === id)
      activeRowRef.value = (el as HTMLElement) ?? null
  }
}

watch(activeId, async () => {
  await nextTick()
  scrollTocToActive()
})

onMounted(async () => {
  await nextTick()
  await nextTick()
  collectHeadings()
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el)
    return

  activeId.value = id

  const scroller = scrollRootEl ?? getScrollParent(el)
  const offset = 96

  if (scroller === window) {
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
  else {
    const s = scroller as HTMLElement
    const elRect = el.getBoundingClientRect()
    const rootRect = s.getBoundingClientRect()
    const y = elRect.top - rootRect.top + s.scrollTop - offset
    s.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}
</script>

<template>
  <nav ref="tocRootRef" class="toc-panel">
    <div class="toc-header">
      <h4 class="toc-title">
        Contents
      </h4>
      <span class="case-text-divider" aria-hidden="true" />
    </div>

    <div class="toc-list-wrap">
      <ul class="toc-list" role="list">
        <li v-for="item in items" :key="item.id" class="toc-item">
          <div
            :ref="setActiveRowRef(item.id)"
            class="toc-item__row"
          >
            <TocProceduralRow
            :label="item.text"
            :active="activeId === item.id"
            @pick="scrollTo(item.id)"
            />
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.toc-panel {
  width: 100%;
  padding: 16px;
  position: relative;
  background: transparent;
  border: none;
  box-shadow: none;
}

.toc-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: fit-content;
  max-width: 100%;
  margin-bottom: 8px;
  padding-bottom: 0;
  border-bottom: none;
}

.toc-title {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-text-muted);
  margin: 0;
}

.toc-list-wrap {
  position: relative;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toc-item {
  margin: 0;
  overflow: visible;
}

.toc-item__row {
  overflow: visible;
}
</style>
