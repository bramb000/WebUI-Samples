<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import TocProceduralRow from './TocProceduralRow.vue'

interface TocItem {
  id: string
  text: string
}

const items = ref<TocItem[]>([])
const activeId = ref<string>('')
const tocRootRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
let scrollRootEl: HTMLElement | null = null

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

  const headings = Array.from(caseRoot.querySelectorAll('section h2')) as HTMLElement[]
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
    const text = heading.textContent?.trim()
    if (!text)
      return

    const sec = heading.closest('section') as HTMLElement | null
    const slug = slugifyHeading(text, index)

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
    </div>

    <div class="toc-list-wrap">
      <ul class="toc-list" role="list">
        <li v-for="item in items" :key="item.id" class="toc-item">
          <TocProceduralRow
            :label="item.text"
            :active="activeId === item.id"
            :accent-root="tocRootRef"
            @pick="scrollTo(item.id)"
          />
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
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 35%, transparent 65%);
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
}
</style>
