import { reactive } from 'vue';

export const caseState = reactive({
  // Page turn
  isTransitioning: false,
  transitionDirection: 1, // 1 = forward, -1 = backward
  transitionProgress: 0, // 0 -> 1 during transition
  accentColor: [0.9, 0.49, 0.13] as [number, number, number], // RGB floats

  // Card hover
  hoveredCardRect: null as DOMRect | null,
  hoveredCardWeight: 0, // 1-4
  cardHoverIntensity: 0,

  // Apex cards (weight 4)
  apexCardRects: [] as DOMRect[],
});

export function setCaseCardHover(el: HTMLElement | null, weight: number) {
  if (el) {
    const rect = el.getBoundingClientRect();
    caseState.hoveredCardRect = rect;
    caseState.hoveredCardWeight = weight;
    caseState.cardHoverIntensity = 1;
  } else {
    caseState.hoveredCardRect = null;
    caseState.cardHoverIntensity = 0;
  }
}

export function registerApexCard(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  caseState.apexCardRects.push(rect);
}

export function clearApexCards() {
  caseState.apexCardRects = [];
}
