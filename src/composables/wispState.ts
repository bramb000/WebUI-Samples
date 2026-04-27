import { reactive } from 'vue';

export const wispState = reactive({
  hoveredElement: null as HTMLElement | null,
  rect: { x: 0, y: 0, width: 0, height: 0 },
  hoverIntensity: 0, // 0 to 1
  clickIntensity: 0, // for pulses
  seed: 0
});

export function setWispHover(el: HTMLElement | null) {
  if (el) {
    if (wispState.hoveredElement !== el) {
      wispState.hoverIntensity = 0;
    }
    const rect = el.getBoundingClientRect();
    wispState.hoveredElement = el;
    wispState.rect = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
    wispState.hoverIntensity = 1;
    wispState.seed = Math.random() * 100;
  } else {
    wispState.hoveredElement = null;
    wispState.hoverIntensity = 0;
  }
}

export function triggerWispClick() {
  wispState.clickIntensity = 1.0;
}
