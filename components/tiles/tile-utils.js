/**
 * tile-utils.js — Shared utilities for all tile components.
 *
 * buildBackground(cell) constructs a CSS multi-layer gradient background
 * that renders the tile shape purely in CSS — no extra DOM nodes required.
 */

export function getTileType(cell) {
  if (!cell) return 'wall';
  const { n, s, e, w } = cell;
  const count = [n, s, e, w].filter(Boolean).length;

  if (count === 4) return 'cross';
  if (count === 3) {
    if (!n) return 't-s';
    if (!s) return 't-n';
    if (!e) return 't-w';
    return 't-e';
  }
  if (count === 2) {
    if (n && s) return 'straight-v';
    if (e && w) return 'straight-h';
    if (n && e) return 'l-ne';
    if (n && w) return 'l-nw';
    if (s && e) return 'l-se';
    return 'l-sw';
  }
  if (count === 1) {
    if (n) return 'dead-n';
    if (s) return 'dead-s';
    if (e) return 'dead-e';
    return 'dead-w';
  }
  return 'wall';
}

/**
 * Build a CSS `background` multi-layer gradient string for a tile.
 *
 * Uses keyword background-position (center/top/bottom/left/right) so that
 * corridor arms correctly anchor to tile edges regardless of corridor width.
 *
 * @param {{n:boolean,s:boolean,e:boolean,w:boolean,win?:boolean}} cell
 * @param {boolean} [isOOB=false]
 * @returns {string}
 */
export function buildBackground(cell, isOOB = false) {
  if (isOOB || !cell) return 'var(--color-wall)';

  const floor = cell.win ? 'var(--color-floor-win)' : 'var(--color-floor)';
  const wall  = 'var(--color-wall)';
  const cw    = 'var(--corridor-width)';
  const ch    = 'var(--corridor-half)';

  const layers = [
    `linear-gradient(${floor},${floor}) center center / ${cw} ${cw} no-repeat`,
  ];

  if (cell.n) layers.push(
    `linear-gradient(${floor},${floor}) center top / ${cw} calc(${ch} + 1px) no-repeat`
  );
  if (cell.s) layers.push(
    `linear-gradient(${floor},${floor}) center bottom / ${cw} calc(${ch} + 1px) no-repeat`
  );
  if (cell.e) layers.push(
    `linear-gradient(${floor},${floor}) right center / calc(${ch} + 1px) ${cw} no-repeat`
  );
  if (cell.w) layers.push(
    `linear-gradient(${floor},${floor}) left center / calc(${ch} + 1px) ${cw} no-repeat`
  );

  return `${layers.join(', ')}, ${wall}`;
}
