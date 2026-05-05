import { reactive } from 'vue';

export const flameState = reactive({
  hoveredElement: null as HTMLElement | null,
  rect: { x: 0, y: 0, width: 0, height: 0 },
  hoverIntensity: 0, // 0 to 1
  seed: 0,
});

export function setFlameHover(el: HTMLElement | null) {
  if (el) {
    if (flameState.hoveredElement !== el) {
      flameState.hoverIntensity = 0;
    }
    const rect = el.getBoundingClientRect();
    flameState.hoveredElement = el;
    flameState.rect = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
    flameState.hoverIntensity = 1;
    flameState.seed = Math.random() * 100;
  } else {
    flameState.hoveredElement = null;
    flameState.hoverIntensity = 0;
  }
}

