/**
 * BIMScene — hero 3D experience.
 *
 * The building cycles slowly through its five visualisation states
 * (point cloud → scanned structure → wireframe → BIM model → digital
 * building) while the user can drag to orbit it freely 360°. The stage
 * value is written to a ref every frame, so there are no React re-renders.
 */
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import BIMBuilding from './BIMBuilding';
import SceneEnvironment from './SceneEnvironment';
import { smoothstep } from '../lib/math';

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const CYCLE = 17; // seconds for a 0 → 4 sweep (then mirrored back)

/** Drives the auto-cycling stage value (hero only). */
function StageDriver({ stageRef, reduced }) {
  useFrame((state) => {
    if (reduced) {
      stageRef.current = 4;
      return;
    }
    const phase = (state.clock.elapsedTime / CYCLE) % 2;
    const u = phase < 1 ? phase : 2 - phase;
    stageRef.current = smoothstep(0, 1, clamp01(u)) * 4;
  });
  return null;
}

export default function BIMScene({ stageRef, reduced = false, mobile = false, className }) {
  const internalRef = useRef(0);
  stageRef = stageRef ?? internalRef;
  const pointCount = mobile ? 2000 : 8000;

  return (
    <Canvas
      className={className}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [23, 15, 29], fov: 42, near: 0.1, far: 220 }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#0b0b0a', 36, 96);
      }}
    >
      <SceneEnvironment mobile={mobile} />
      <BIMBuilding stageRef={stageRef} pointCount={pointCount} reduced={reduced} />
      <StageDriver stageRef={stageRef} reduced={reduced} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.32}
        minPolarAngle={0.5}
        maxPolarAngle={1.52}
        enableDamping
        dampingFactor={0.06}
        target={[0, 7.5, 0]}
        makeDefault
      />
    </Canvas>
  );
}
