import { buildBackground } from '../tile-utils.js';
export function render(el, cell) {
  el.style.background = buildBackground(cell);
  el.dataset.tileType = 't-tile';
}
