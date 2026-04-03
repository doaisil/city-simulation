// Isometric projection constants and helpers

export const TILE_W = 64;
export const TILE_H = 32;

// We'll use a tight viewBox computed from content, these are just reference
export const SVG_W = 1400;
export const SVG_H = 800;

export const OFFSET_X = SVG_W / 2;
export const OFFSET_Y = SVG_H / 2;

/** Convert grid coords to screen (SVG) coords */
export function isoProject(gx: number, gy: number): { x: number; y: number } {
  return {
    x: (gx - gy) * (TILE_W / 2) + OFFSET_X,
    y: (gx + gy) * (TILE_H / 2) + OFFSET_Y,
  };
}

/** Raw corner positions for an isometric box footprint */
export function isoCorners(gx: number, gy: number, w: number, d: number) {
  return {
    tl: isoProject(gx, gy),
    tr: isoProject(gx + w, gy),
    br: isoProject(gx + w, gy + d),
    bl: isoProject(gx, gy + d),
  };
}

/**
 * Build an isometric box's 3 visible faces as polygon point-strings.
 * gx, gy = grid position. w, d = footprint in grid units. h = pixel height.
 */
export function isoBox(gx: number, gy: number, w: number, d: number, h: number) {
  const { tl, tr, br, bl } = isoCorners(gx, gy, w, d);

  const top = [
    `${tl.x},${tl.y - h}`,
    `${tr.x},${tr.y - h}`,
    `${br.x},${br.y - h}`,
    `${bl.x},${bl.y - h}`,
  ].join(' ');

  const left = [
    `${tl.x},${tl.y - h}`,
    `${bl.x},${bl.y - h}`,
    `${bl.x},${bl.y}`,
    `${tl.x},${tl.y}`,
  ].join(' ');

  const right = [
    `${br.x},${br.y - h}`,
    `${tr.x},${tr.y - h}`,
    `${tr.x},${tr.y}`,
    `${br.x},${br.y}`,
  ].join(' ');

  const sortY = br.y;

  return { top, left, right, sortY, tl, tr, br, bl };
}

/**
 * Generate isometric window parallelogram points on the LEFT face.
 * cx, cy = center position. w, h = window size. The parallelogram
 * follows the left face's ↙ slant.
 */
export function isoWindowLeft(cx: number, cy: number, w: number, h: number): string {
  // Left face slants: dx per depth unit = -TILE_W/2, dy = +TILE_H/2
  const angle = Math.atan2(TILE_H / 2, TILE_W / 2); // ~26.57°
  const shearX = (h / 2) * Math.cos(angle) * 0.3;
  const shearY = (h / 2) * Math.sin(angle) * 0.3;

  return [
    `${cx - w / 2 - shearX},${cy - h / 2 - shearY}`,
    `${cx + w / 2 - shearX},${cy - h / 2 + shearY}`,
    `${cx + w / 2 + shearX},${cy + h / 2 + shearY}`,
    `${cx - w / 2 + shearX},${cy + h / 2 - shearY}`,
  ].join(' ');
}

/**
 * Generate isometric window parallelogram points on the RIGHT face.
 */
export function isoWindowRight(cx: number, cy: number, w: number, h: number): string {
  const angle = Math.atan2(TILE_H / 2, TILE_W / 2);
  const shearX = (h / 2) * Math.cos(angle) * 0.3;
  const shearY = (h / 2) * Math.sin(angle) * 0.3;

  return [
    `${cx - w / 2 + shearX},${cy - h / 2 - shearY}`,
    `${cx + w / 2 + shearX},${cy - h / 2 + shearY}`,
    `${cx + w / 2 - shearX},${cy + h / 2 + shearY}`,
    `${cx - w / 2 - shearX},${cy + h / 2 - shearY}`,
  ].join(' ');
}

/** Lerp between two points */
export function lerp(
  a: { x: number; y: number },
  b: { x: number; y: number },
  t: number,
) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}
