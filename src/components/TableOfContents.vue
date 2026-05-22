<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import TocProceduralRow from './TocProceduralRow.vue'

interface TocItem {
  id: string
  text: string
}

const items = ref<TocItem[]>([])
const activeId = ref<string>('')
const tocRootRef = ref<HTMLElement | null>(null)
const tocLayoutStyle = ref<Record<string, string>>({})

let layoutScrollRoot: HTMLElement | null = null
let layoutObserver: ResizeObserver | null = null

/** Matches `.toc-sidebar-sticky` top in `style.css` / embedded case chrome */
const TOC_STICKY_TOP_PX = 32
const TOC_VIEWPORT_BOTTOM_INSET_PX = 16

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
let scrollSpyPaused = false
let scrollSpyResumeTimer = 0

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

function getTocStickySlot(): HTMLElement | null {
  return (tocRootRef.value?.closest('.toc-sidebar-sticky') as HTMLElement | null)
    ?? tocRootRef.value?.parentElement
    ?? null
}

function applyStickySlotHeight(panelMaxH: number) {
  const sticky = getTocStickySlot()
  if (!sticky)
    return
  const h = `${Math.round(panelMaxH)}px`
  sticky.style.display = 'flex'
  sticky.style.flexDirection = 'column'
  sticky.style.justifyContent = 'center'
  sticky.style.alignItems = 'stretch'
  sticky.style.boxSizing = 'border-box'
  sticky.style.height = h
  sticky.style.minHeight = h
  sticky.style.maxHeight = h
}

function clearStickySlot() {
  const sticky = getTocStickySlot()
  if (!sticky)
    return
  sticky.style.removeProperty('display')
  sticky.style.removeProperty('flex-direction')
  sticky.style.removeProperty('justify-content')
  sticky.style.removeProperty('align-items')
  sticky.style.removeProperty('height')
  sticky.style.removeProperty('min-height')
  sticky.style.removeProperty('max-height')
  sticky.style.removeProperty('box-sizing')
}

function applyTocLayoutVars(opts: {
  panelPad: number
  headerGap: number
  gap: number
  rowMin: number
  padBlock: number
  compact: boolean
}) {
  tocLayoutStyle.value = {
    '--toc-panel-pad': `${opts.panelPad}px`,
    '--toc-header-gap': `${opts.headerGap}px`,
    '--toc-item-gap': `${Math.max(2, Math.round(opts.gap * 10) / 10)}px`,
    '--toc-row-min-height': `${Math.round(opts.rowMin)}px`,
    '--toc-row-pad-block': `${opts.padBlock}px`,
    '--toc-row-font-size': opts.rowMin < 20 ? '9px' : opts.compact ? '10px' : '11px',
    '--toc-row-line-height': opts.compact ? '1.18' : '1.3',
    '--toc-row-pad-inline-start': opts.compact ? '22px' : '28px',
  }
}

/** Fit TOC in parchment scrollport; measure DOM and shrink until nothing is clipped. */
async function layoutTocFit(attempt = 0) {
  const toc = tocRootRef.value
  if (!toc || items.value.length === 0)
    return

  const scrollRoot = toc.closest('.dl-embedded') as HTMLElement | null
  if (!scrollRoot)
    return

  if (scrollRoot.clientHeight < 80) {
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
    if (scrollRoot.clientHeight < 80 && attempt < 6)
      return layoutTocFit(attempt)
  }

  const panelPad = 18
  const headerGap = 8
  const panelMaxH = Math.max(
    120,
    scrollRoot.clientHeight - TOC_STICKY_TOP_PX - TOC_VIEWPORT_BOTTOM_INSET_PX,
  )
  const maxInnerH = panelMaxH - panelPad * 2

  const shrink = Math.pow(0.94, attempt)
  const gap = Math.max(2, 6 * shrink)
  const rowMin = Math.max(16, 28 * shrink)
  const padBlock = Math.max(2, Math.min(5, Math.floor((rowMin - 10) / 2)))
  const compact = rowMin < 25

  applyStickySlotHeight(panelMaxH)
  applyTocLayoutVars({
    panelPad,
    headerGap,
    gap,
    rowMin,
    padBlock,
    compact,
  })

  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

  const inner = toc.querySelector('.toc-panel__inner') as HTMLElement | null
  if (!inner)
    return

  const actualInnerH = inner.getBoundingClientRect().height
  if (actualInnerH > maxInnerH + 1 && attempt < 24)
    return layoutTocFit(attempt + 1)
}

function bindTocLayoutObserver() {
  layoutObserver?.disconnect()
  layoutScrollRoot = tocRootRef.value?.closest('.dl-embedded') as HTMLElement | null
  if (!layoutScrollRoot)
    return
  layoutObserver = new ResizeObserver(() => { void layoutTocFit() })
  layoutObserver.observe(layoutScrollRoot)
  void layoutTocFit()
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

  /** Primary case-study sections only (h2) — exclude h3 subsections e.g. TLDR under Action. */
  const headings = Array.from(caseRoot.querySelectorAll('section > h2')) as HTMLElement[]
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
      if (scrollSpyPaused)
        return
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

  const firstId = items.value[0]?.id
  if (firstId)
    activeId.value = firstId

  nextTick(() => {
    void layoutTocFit()
    bindTocLayoutObserver()
    window.setTimeout(() => void layoutTocFit(), 350)
    syncActiveFromScroll()
  })
}

/** Pick the section most visible in the scrollport (initial highlight + after spy resume). */
function syncActiveFromScroll() {
  if (!scrollRootEl || items.value.length === 0)
    return

  const rootRect = scrollRootEl.getBoundingClientRect()
  const bandTop = rootRect.top + rootRect.height * 0.12
  const bandBottom = rootRect.bottom - rootRect.height * 0.45

  let bestId = items.value[0]!.id
  let bestScore = -1

  for (const item of items.value) {
    const el = document.getElementById(item.id)
    if (!el)
      continue
    const r = el.getBoundingClientRect()
    const visibleTop = Math.max(r.top, bandTop)
    const visibleBottom = Math.min(r.bottom, bandBottom)
    const visible = Math.max(0, visibleBottom - visibleTop)
    if (visible > bestScore) {
      bestScore = visible
      bestId = item.id
    }
  }

  if (bestScore > 0)
    activeId.value = bestId
}

watch(
  () => items.value.length,
  () => { void layoutTocFit() },
)

function pauseScrollSpy(ms = 720) {
  scrollSpyPaused = true
  if (scrollSpyResumeTimer)
    window.clearTimeout(scrollSpyResumeTimer)
  scrollSpyResumeTimer = window.setTimeout(() => {
    scrollSpyResumeTimer = 0
    scrollSpyPaused = false
    syncActiveFromScroll()
  }, ms)
}

onMounted(async () => {
  await nextTick()
  await nextTick()
  collectHeadings()
})

onBeforeUnmount(() => {
  if (scrollSpyResumeTimer) {
    window.clearTimeout(scrollSpyResumeTimer)
    scrollSpyResumeTimer = 0
  }
  scrollSpyPaused = false
  if (observer) {
    observer.disconnect()
    observer = null
  }
  layoutObserver?.disconnect()
  layoutObserver = null
  layoutScrollRoot = null
  clearStickySlot()
})

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el)
    return

  activeId.value = id
  pauseScrollSpy()

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
    const onScrollEnd = () => {
      s.removeEventListener('scrollend', onScrollEnd)
      scrollSpyPaused = false
      if (scrollSpyResumeTimer) {
        window.clearTimeout(scrollSpyResumeTimer)
        scrollSpyResumeTimer = 0
      }
      syncActiveFromScroll()
    }
    if ('onscrollend' in s) {
      s.addEventListener('scrollend', onScrollEnd, { once: true })
    }
  }
}
</script>

<template>
  <nav ref="tocRootRef" class="toc-panel" :style="tocLayoutStyle">
    <div class="toc-panel__inner">
      <div class="toc-header">
        <h4 class="toc-title">
          Contents
        </h4>
      </div>

      <div class="toc-list-wrap">
        <ul class="toc-list" role="list">
          <li v-for="item in items" :key="item.id" class="toc-item">
            <div class="toc-item__row">
              <TocProceduralRow
                :label="item.text"
                :active="activeId === item.id"
                @pick="scrollTo(item.id)"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.toc-panel {
  width: 100%;
  height: auto;
  padding: var(--toc-panel-pad, 18px) 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: visible;
}

.toc-panel__inner {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  overflow: visible;
}

.toc-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: fit-content;
  max-width: 100%;
  flex-shrink: 0;
  margin-bottom: var(--toc-header-gap, 10px);
  padding-bottom: 0;
  border-bottom: none;
}

.toc-title {
  font-family: var(--font-sans);
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-text-muted);
  margin: 0;
}

.toc-list-wrap {
  position: relative;
  flex: 0 0 auto;
  overflow: visible;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--toc-item-gap, 6px);
}

.toc-item {
  margin: 0;
  overflow: visible;
  flex: 0 0 auto;
}

.toc-item__row {
  overflow: visible;
}
</style>
