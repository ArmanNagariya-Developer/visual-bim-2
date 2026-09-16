/**
 * TechScene — scroll-driven 3D building for the technology section.
 *
 * `stageRef.current` (0 → 4) is written by the parent from scroll
 * progress, so the model transforms through:
 *   POINT CLOUD → GEOMETRY → PARAMETRIC DATA → BIM MODEL → DIGITAL INTELLIGENCE
 *
 * The render loop is disabled while the section is off-screen.
 */
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import BIMBuilding from './BIMBuilding';
import SceneEnvironment from './SceneEnvironment';

export default function TechScene({ stageRef, reduced = false, mobile = false, frameloop = 'always' }) {
  const pointCount = mobile ? 1600 : 6500;

  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 1.85]}
      frameloop={frameloop}
      gl={{
        alpha: true,
        antialias: !mobile,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      camera={{ position: [21, 13, 26], fov: 44, near: 0.1, far: 220 }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#0b0b0a', 34, 88);
      }}
    >
      <SceneEnvironment mobile={mobile} shadows={!mobile} />
      <BIMBuilding stageRef={stageRef} pointCount={pointCount} reduced={reduced} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.22}
        minPolarAngle={0.55}
        maxPolarAngle={1.45}
        target={[0, 7.5, 0]}
        makeDefault
      />
    </Canvas>
  );
}
