<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface TocItem {
  id: string;
  text: string;
}

const items = ref<TocItem[]>([]);
const activeId = ref<string>('');
let observer: IntersectionObserver | null = null;

onMounted(() => {
  const headings = Array.from(document.querySelectorAll('section h2, .animate-fade-in h2'));
  
  headings.forEach((heading, index) => {
    if (!heading.id) {
      const parentSection = heading.closest('section');
      const generatedId = heading.textContent
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || `section-${index}`;
      
      if (parentSection && !parentSection.id) {
        parentSection.id = generatedId;
      } else {
        heading.id = generatedId;
      }
    }

    const targetId = heading.closest('section')?.id || heading.id;

    if (targetId && heading.textContent) {
      if (!items.value.find(item => item.id === targetId)) {
        items.value.push({
          id: targetId,
          text: heading.textContent.trim(),
        });
      }
    }
  });

  observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        activeId.value = visibleEntries[0].target.id;
      }
    },
    {
      rootMargin: '-10% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1.0],
    }
  );

  items.value.forEach((item) => {
    const el = document.getElementById(item.id);
    if (el) observer?.observe(el);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: y, behavior: 'smooth' });
    activeId.value = id;
  }
}
</script>

<template>
  <nav class="toc-panel panel-recessed noise-overlay">
    <div class="toc-header">
      <h4 class="toc-title">Contents</h4>
    </div>
    <ul class="toc-list">
      <li v-for="item in items" :key="item.id">
        <button
          @click="scrollTo(item.id)"
          :class="['toc-btn', activeId === item.id ? 'toc-btn--active' : '']"
        >
          {{ item.text }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.toc-panel {
  width: 100%;
  padding: 16px;
  position: relative;
}

.toc-header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border);
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

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
  position: relative;
  z-index: 1;
}

.toc-btn {
  width: 100%;
  text-align: left;
  padding: 6px 8px 6px 10px;
  background: transparent;
  border: none;
  border-left: 2px solid transparent;
  border-radius: 0 2px 2px 0;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  transition: all 100ms var(--ease-te-snap);
  line-height: 1.4;
}
.toc-btn:hover {
  background: rgba(197, 168, 114, 0.06);
  color: var(--color-text);
  border-left-color: var(--color-border);
}
.toc-btn--active {
  border-left-color: var(--color-accent);
  color: var(--color-border-hi);
  background: rgba(197, 168, 114, 0.08);
  text-shadow: 0 0 10px rgba(197, 168, 114, 0.3);
  font-weight: 700;
}
</style>
