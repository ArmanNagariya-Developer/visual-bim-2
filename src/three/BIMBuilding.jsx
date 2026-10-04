/**
 * BIMBuilding — procedural architectural building with five
 * visualisation states blended by a single float `stage` (0 → 4):
 *
 *   0  POINT CLOUD        scattered scan particles converging on the mass
 *   1  SCANNED STRUCTURE  settled point cloud + active scan ring
 *   2  WIREFRAME          CAD-style edges of the full building
 *   3  BIM MODEL          solid geometry grows from ground up
 *   4  DIGITAL BUILDING   glazed, detailed model with discipline labels
 *
 * Stage is read from `stageRef.current` every frame (no React re-renders),
 * so it can be driven by time (hero) or scroll (technology section).
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { createBuildingGeometry, BUILDING_HEIGHT } from './buildingGeometry';
import { clamp, mapRange, smoothstep } from '../lib/math';

const MAX_Y = BUILDING_HEIGHT + 2.8;

/** GLSL smoothstep (three exports `smoothstep` but keep it explicit/local). */
const glslHelpers = /* glsl */ `
  float sm(float e0, float e1, float x) {
    float t = clamp((x - e0) / (e1 - e0), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
  }
`;

const pointsVertex = /* glsl */ `
  uniform float uStage;
  uniform float uTime;
  uniform float uSize;
  uniform float uScatterScale;
  attribute vec3 aDir;
  attribute float aRand;
  varying float vRand;
  varying float vY;
  ${glslHelpers}
  void main() {
    // Stage 0 → 1.2: particles converge from a scattered cloud onto the mass.
    float s = (1.0 - sm(0.15, 1.15, uStage)) * uScatterScale;
    vec3 pos = position + aDir * s * (1.5 + aRand * 2.4);
    pos += vec3(
      sin(uTime * 0.40 + aRand * 6.283),
      cos(uTime * 0.30 + aRand * 6.283),
      sin(uTime * 0.35 + aRand * 3.14)
    ) * 0.07 * (0.35 + s);

    vRand = aRand;
    vY = pos.y;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float grow = 0.55 + 0.45 * clamp(uStage * 0.25, 0.0, 1.0);
    gl_PointSize = uSize * grow * (320.0 / -mv.z) * (0.65 + 0.7 * aRand);
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vRand;
  varying float vY;
  ${glslHelpers}
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = sm(0.5, 0.06, d);
    float h = clamp(vY / 24.0, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, h * (0.45 + 0.55 * vRand));
    float bright = 0.6 + 0.45 * vRand;
    gl_FragColor = vec4(col * bright, a * uOpacity);
  }
`;

function makePointsMaterial({ size, scatterScale, colorA, colorB }) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uStage: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: size },
      uScatterScale: { value: scatterScale },
      uOpacity: { value: 1 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    },
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
  });
}

/** Technical labels: [text, position, stage-in, stage-out] */
const LABELS = [
  { text: 'POINT CLOUD', pos: [-8.5, 2.6, 4.5], in: 0.0, out: 1.7 },
  { text: 'BIM', pos: [6.4, 15.2, -5.2], in: 1.5, out: 2.6 },
  { text: 'REVIT', pos: [-9.6, 9.4, -4.2], in: 2.1, out: 3.4 },
  { text: 'ARCHITECTURAL', pos: [-9.2, 17.6, 2.8], in: 3.25, out: 5.2 },
  { text: 'STRUCTURAL', pos: [8.4, 11.4, 5.2], in: 3.45, out: 5.4 },
  { text: 'MEP', pos: [-6.6, 4.8, -6.4], in: 3.65, out: 5.6 },
];

export default function BIMBuilding({
  stageRef,
  pointCount = 8000,
  reduced = false,
  showLabels = true,
}) {
  const group = useRef();
  const geo = useMemo(
    () => createBuildingGeometry(pointCount, 7),
    [pointCount],
  );

  const cloudMat = useMemo(
    () => makePointsMaterial({ size: 1.5, scatterScale: 1.0, colorA: '#5a4a22', colorB: '#e3c15a' }),
    [],
  );
  const ambientMat = useMemo(
    () => makePointsMaterial({ size: 1.0, scatterScale: 0.0, colorA: '#3a3220', colorB: '#c9a227' }),
    [],
  );
  const wireMat = useMemo(
    () => new THREE.LineBasicMaterial({ color: new THREE.Color('#e8e4d8'), transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const solidMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1c2733'),
      metalness: 0.42,
      roughness: 0.62,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      emissive: new THREE.Color('#0c0b08'),
      emissiveIntensity: 0.55,
      clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)],
      clipShadows: true,
    });
    return m;
  }, []);
  const glassMat = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#3d3320'),
      emissive: new THREE.Color('#c9a227'),
      emissiveIntensity: 0.42,
      metalness: 0.25,
      roughness: 0.14,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      clippingPlanes: solidMat.clippingPlanes,
    });
    return m;
  }, [solidMat]);
  const ringMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#e3c15a'),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const ring = useRef();

  const labelRefs = useRef([]);
  const dragging = useRef(false);

  // Suppress the pointer-parallax sway while the user drags to orbit.
  useEffect(() => {
    const down = () => (dragging.current = true);
    const up = () => (dragging.current = false);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, []);

  useEffect(() => {
    return () => {
      geo.solid.dispose();
      geo.edges.dispose();
      geo.glass.dispose();
      geo.points.dispose();
      geo.ambient.dispose();
      cloudMat.dispose();
      ambientMat.dispose();
      wireMat.dispose();
      solidMat.dispose();
      glassMat.dispose();
      ringMat.dispose();
    };
  }, [geo]);

  useFrame((state, delta) => {
    const t = stageRef?.current ?? 0;
    const time = state.clock.elapsedTime;

    // ---- stage → visual weights -------------------------------------
    const pointsOp = (1 - 0.88 * smoothstep(1.6, 2.6, t)) * (0.85 + 0.15 * Math.sin(time * 0.8));
    const wireOp = smoothstep(1.25, 2.15, t) * (1 - 0.6 * smoothstep(2.8, 3.8, t));
    const solidOp = smoothstep(2.5, 3.3, t);
    const glassOp = smoothstep(3.35, 4.05, t);

    cloudMat.uniforms.uStage.value = t;
    cloudMat.uniforms.uTime.value = time;
    cloudMat.uniforms.uOpacity.value = pointsOp;
    ambientMat.uniforms.uStage.value = t;
    ambientMat.uniforms.uTime.value = time;
    ambientMat.uniforms.uOpacity.value = 0.5 * (0.6 + 0.4 * Math.sin(time * 0.5));

    wireMat.opacity = wireOp * 0.85;

    // solid grows from the ground as the BIM model "builds" (clip plane)
    const grow = smoothstep(2.45, 3.55, t);
    const clipY = clamp(mapRange(t, 2.45, 3.55, 0.3, MAX_Y, false), 0.3, MAX_Y);
    solidMat.opacity = solidOp;
    solidMat.clippingPlanes[0].constant = clipY;
    glassMat.opacity = glassOp * 0.85;
    solidMat.emissiveIntensity = 0.4 + 0.5 * grow;

    // ---- holographic scan ring --------------------------------------
    const scanPhase = 1 - smoothstep(1.7, 2.35, t);
    const buildPhase = smoothstep(2.45, 3.0, t) * (1 - smoothstep(3.85, 4.3, t));
    const scanY = 0.6 + ((time * 0.22) % 1) * (MAX_Y - 1);
    const ringY = 0.6 + grow * (MAX_Y - 1.2);
    if (ring.current) {
      ring.current.position.y = scanPhase > 0.02 ? scanY : ringY;
      ring.current.visible = scanPhase + buildPhase > 0.02;
      ringMat.opacity = clamp(scanPhase * 0.5 + buildPhase * 0.6, 0, 0.8);
      const s = 1 + 0.02 * Math.sin(time * 1.2);
      ring.current.scale.set(1.42 * s, s, s);
    }

    // ---- labels ------------------------------------------------------
    if (showLabels && labelRefs.current.length) {
      LABELS.forEach((l, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const op = clamp((t - l.in) / 0.55, 0, 1) * (1 - clamp((t - l.out) / 0.5, 0, 1));
        el.style.opacity = (op * 0.95).toFixed(3);
        el.style.visibility = op > 0.01 ? 'visible' : 'hidden';
      });
    }

    // ---- pointer parallax (subtle inspection; paused while dragging) --
    if (group.current && !reduced) {
      const targetY = dragging.current
        ? group.current.rotation.y
        : state.pointer.x * 0.32;
      const targetX = dragging.current
        ? group.current.rotation.x
        : -state.pointer.y * 0.16;
      group.current.rotation.y += (targetY - group.current.rotation.y) * Math.min(1, delta * 1.6);
      group.current.rotation.x += (targetX - group.current.rotation.x) * Math.min(1, delta * 1.6);
      group.current.position.y = -1.1 + Math.sin(time * 0.5) * 0.22;
    } else if (group.current) {
      group.current.rotation.y = 0;
      group.current.rotation.x = 0;
      group.current.position.y = -1.1;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <points geometry={geo.points} material={cloudMat} />
      <points geometry={geo.ambient} material={ambientMat} renderOrder={-1} />
      <lineSegments geometry={geo.edges} material={wireMat} renderOrder={1} />
      <mesh geometry={geo.solid} material={solidMat} castShadow renderOrder={2} />
      <mesh geometry={geo.glass} material={glassMat} renderOrder={3} />

      {/* Holographic scan / build ring */}
      <mesh ref={ring} rotation-x={-Math.PI / 2} material={ringMat} renderOrder={10}>
        <ringGeometry args={[11.2, 12.1, 72]} />
      </mesh>

      {showLabels &&
        LABELS.map((l, i) => (
          <Html
            key={l.text}
            position={l.pos}
            center
            distanceFactor={9}
            zIndexRange={[20, 0]}
            style={{ opacity: 0, transition: 'opacity 0.3s linear' }}
          >
            <span
              ref={(el) => (labelRefs.current[i] = el)}
              className="bim-label"
              style={{ opacity: 0 }}
            >
              {l.text}
            </span>
          </Html>
        ))}
    </group>
  );
}
