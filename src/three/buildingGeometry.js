/**
 * Procedural BIM building geometry.
 *
 * A building is described as a set of axis-aligned box "elements"
 * (slabs, columns, core, glazing, mullions, roof, annex). From that
 * single description we derive every visualisation state:
 *
 *   - solid  → merged BoxGeometry (architectural / BIM model)
 *   - edges  → EdgesGeometry (wireframe / structural)
 *   - glass  → merged glazing geometry (detailed digital building)
 *   - points → surface-sampled point cloud (scan / reality capture)
 *
 * No external 3D assets are required — everything is generated at runtime.
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { mulberry32, randomUnit } from '../lib/math';

export const FLOOR_H = 3.2;
export const FLOORS = 6;
export const BUILDING_HEIGHT = FLOORS * FLOOR_H; // ≈ 19.2

/**
 * Build the element table. Every entry: { p: [x,y,z], s: [w,h,d], kind }
 * `kind` drives which geometry the element contributes to.
 *  - 'solid'  → structural + architectural shell
 *  - 'glass'  → curtain wall glazing
 */
function buildElements() {
  const E = [];
  const W = 10.4; // tower footprint X
  const D = 8.4; // tower footprint Z
  const cx = 0;
  const cz = 0;

  // ---- Plinth / podium -------------------------------------------------
  E.push({ p: [cx, 0.3, cz], s: [W + 1.6, 0.6, D + 1.6], kind: 'solid' });

  // ---- Floor slabs ------------------------------------------------------
  for (let i = 0; i <= FLOORS; i++) {
    E.push({ p: [cx, i * FLOOR_H, cz], s: [W, 0.32, D], kind: 'solid' });
  }

  // ---- Perimeter columns (ring grid, skip centre where the core sits) ---
  const xs = [-W / 2 + 0.5, 0, W / 2 - 0.5];
  const zs = [-D / 2 + 0.5, D / 2 - 0.5];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * FLOOR_H + FLOOR_H / 2;
    const h = FLOOR_H - 0.42;
    for (const x of xs) {
      for (const z of zs) {
        if (Math.abs(x) < 0.6 && Math.abs(z) < 1.6) continue; // core void
        E.push({ p: [cx + x, y, cz + z], s: [0.42, h, 0.42], kind: 'solid' });
      }
    }
  }

  // ---- Lift / service core (proud of the roof for a mechanical level) ---
  E.push({ p: [cx, BUILDING_HEIGHT / 2 + 1.2, cz], s: [3.1, BUILDING_HEIGHT + 2.4, 2.5], kind: 'solid' });

  // ---- Curtain-wall glazing on the long elevations ----------------------
  const glassY = FLOOR_H / 2;
  for (let f = 0; f < FLOORS; f++) {
    const y = f * FLOOR_H + glassY;
    E.push({ p: [cx, y, cz - D / 2 - 0.02], s: [W - 0.6, FLOOR_H - 0.5, 0.12], kind: 'glass' });
    E.push({ p: [cx, y, cz + D / 2 + 0.02], s: [W - 0.6, FLOOR_H - 0.5, 0.12], kind: 'glass' });
  }

  // ---- Mullions dividing the glazing into bays --------------------------
  const mullX = [-3.6, -1.2, 1.2, 3.6];
  for (let f = 0; f < FLOORS; f++) {
    const y = f * FLOOR_H + glassY;
    for (const x of mullX) {
      E.push({ p: [cx + x, y, cz - D / 2 - 0.03], s: [0.1, FLOOR_H - 0.5, 0.16], kind: 'solid' });
      E.push({ p: [cx + x, y, cz + D / 2 + 0.03], s: [0.1, FLOOR_H - 0.5, 0.16], kind: 'solid' });
    }
  }

  // ---- Roof: penthouse + parapet ----------------------------------------
  E.push({ p: [cx + 2.4, BUILDING_HEIGHT + 1.0, cz], s: [4.2, 1.7, 3.4], kind: 'solid' });
  const pW = W / 2;
  for (const [px, pz, sw, sd] of [
    [-pW, -D / 2, 0.22, D],
    [pW, -D / 2, 0.22, D],
    [-pW, -D / 2, W, 0.22],
    [-pW, D / 2, W, 0.22],
  ]) {
    E.push({ p: [cx + px + 0.11, BUILDING_HEIGHT + 0.28, cz + pz + 0.11], s: [sw, 0.56, sd], kind: 'solid' });
  }

  // ---- Lower annex wing on the +X side ---------------------------------
  const wingX = W / 2 + 4.6;
  const wingH = FLOOR_H * 2;
  E.push({ p: [wingX, wingH / 2 + 0.32, cz], s: [8.4, wingH, D - 1.4], kind: 'solid' });
  E.push({ p: [wingX, wingH + 0.5, cz], s: [8.8, 0.32, D - 1.0], kind: 'solid' });
  // glazing slots on the annex
  for (let i = -2; i <= 2; i++) {
    E.push({ p: [wingX + i * 1.7, wingH / 2 + 0.32, cz - (D - 1.4) / 2 - 0.05], s: [1.1, wingH - 0.9, 0.1], kind: 'glass' });
  }
  // link bridge between tower and annex
  E.push({ p: [W / 2 + 2.1, FLOOR_H * 2 + 0.9, cz - 1], s: [3.2, 0.28, 2.6], kind: 'solid' });

  return E;
}

/** Merge a list of element boxes into a single BufferGeometry. */
function mergeElements(elements, kinds) {
  const geos = [];
  for (const el of elements) {
    if (!kinds.includes(el.kind)) continue;
    const [w, h, d] = el.s;
    const g = new THREE.BoxGeometry(w, h, d);
    g.translate(el.p[0], el.p[1], el.p[2]);
    geos.push(g);
  }
  const merged = mergeGeometries(geos, false);
  geos.forEach((g) => g.dispose());
  merged.computeBoundingBox();
  return merged;
}

/**
 * Sample points uniformly (area-weighted) over the surfaces of a set of boxes.
 * Also stores a per-point random direction + random value for scatter/noise.
 *
 * @returns {{position:Float32Array, dir:Float32Array, rand:Float32Array}}
 */
function sampleElementPoints(elements, count, seed = 7) {
  const rand = mulberry32(seed);
  const position = new Float32Array(count * 3);
  const dir = new Float32Array(count * 3);
  const randAttr = new Float32Array(count);

  // Total surface area per element to weight the distribution.
  const areas = elements.map((el) => {
    const [w, h, d] = el.s;
    return 2 * (w * h + w * d + h * d);
  });
  const totalArea = areas.reduce((a, b) => a + b, 0);

  let written = 0;
  for (let e = 0; e < elements.length; e++) {
    const el = elements[e];
    const share = Math.max(1, Math.round((areas[e] / totalArea) * count));
    const [w, h, d] = el.s;
    const [px, py, pz] = el.p;
    const hx = w / 2, hy = h / 2, hz = d / 2;
    // 6 faces: normal + tangent basis for sampling
    const faces = [
      { n: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1], lu: h, lv: d, o: [hx, 0, 0] },
      { n: [-1, 0, 0], u: [0, 1, 0], v: [0, 0, 1], lu: h, lv: d, o: [-hx, 0, 0] },
      { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1], lu: w, lv: d, o: [0, hy, 0] },
      { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1], lu: w, lv: d, o: [0, -hy, 0] },
      { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0], lu: w, lv: h, o: [0, 0, hz] },
      { n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0], lu: w, lv: h, o: [0, 0, -hz] },
    ];

    for (let i = 0; i < share && written < count; i++) {
      const f = faces[Math.floor(rand() * 6)];
      const tu = (rand() - 0.5) * f.lu;
      const tv = (rand() - 0.5) * f.lv;
      // small surface noise so the scan feels organic
      const nx = (rand() - 0.5) * 0.05;
      const ny = (rand() - 0.5) * 0.05;
      const nz = (rand() - 0.5) * 0.05;

      const idx = written * 3;
      position[idx] = px + f.o[0] + f.u[0] * tu + f.v[0] * tv + nx;
      position[idx + 1] = py + f.o[1] + f.u[1] * tu + f.v[1] * tv + ny;
      position[idx + 2] = pz + f.o[2] + f.u[2] * tu + f.v[2] * tv + nz;

      const u = randomUnit(rand);
      dir[idx] = u[0];
      dir[idx + 1] = u[1];
      dir[idx + 2] = u[2];
      randAttr[written] = rand();
      written++;
    }
  }

  return { position, dir, rand: randAttr };
}

/** Ambient atmospheric particles in a shell around the building. */
function ambientPoints(count, seed = 21) {
  const rand = mulberry32(seed);
  const position = new Float32Array(count * 3);
  const randAttr = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    // elliptical shell around the whole massing
    const r = 13 + rand() * 11;
    const theta = rand() * Math.PI * 2;
    const y = rand() * 26 - 3;
    position[idx] = Math.cos(theta) * r * 1.35;
    position[idx + 1] = y;
    position[idx + 2] = Math.sin(theta) * r;
    randAttr[i] = rand();
  }
  return { position, rand: randAttr };
}

/**
 * Create the full set of geometries used by <BIMBuilding />.
 * Memoise the result — generation is deterministic for a given seed.
 */
export function createBuildingGeometry(pointCount = 8000, seed = 7) {
  const elements = buildElements();

  const solid = mergeElements(elements, ['solid']);
  const glass = mergeElements(elements, ['glass']);
  const edges = new THREE.EdgesGeometry(solid, 24);
  const cloud = sampleElementPoints(elements, pointCount, seed);
  const ambient = ambientPoints(Math.max(140, Math.round(pointCount * 0.035)), seed + 2);

  const points = new THREE.BufferGeometry();
  points.setAttribute('position', new THREE.BufferAttribute(cloud.position, 3));
  points.setAttribute('aDir', new THREE.BufferAttribute(cloud.dir, 3));
  points.setAttribute('aRand', new THREE.BufferAttribute(cloud.rand, 1));

  const ambGeo = new THREE.BufferGeometry();
  ambGeo.setAttribute('position', new THREE.BufferAttribute(ambient.position, 3));
  ambGeo.setAttribute('aRand', new THREE.BufferAttribute(ambient.rand, 1));

  return { solid, edges, glass, points, ambient: ambGeo };
}

/** Total X/Z footprint for camera framing. */
export const BUILDING_BOUNDS = { x: 17.5, z: 7.5, y: BUILDING_HEIGHT + 2.6 };
