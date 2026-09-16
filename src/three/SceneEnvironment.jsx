/**
 * Shared lighting + blueprint ground plane + contact shadows
 * for both 3D scenes. Uses only procedural elements (no HDRI fetch).
 */
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Grid, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

export function RendererSetup() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.localClippingEnabled = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.02;
  }, [gl]);
  return null;
}

export default function SceneEnvironment({ mobile = false, shadows = true }) {
  return (
    <>
      <RendererSetup />

      <hemisphereLight args={['#5a4d33', '#050505', 0.65]} />
      <ambientLight intensity={0.42} color="#e8e4d8" />
      <directionalLight
        position={[14, 22, 10]}
        intensity={1.55}
        color="#fff3d6"
      />
      <directionalLight position={[-16, 12, -10]} intensity={0.5} color="#c9a227" />
      <pointLight position={[0, 4, 16]} intensity={mobile ? 110 : 240} color="#e3c15a" distance={60} />

      {shadows && (
        <ContactShadows
          position={[0, -0.38, 0]}
          scale={52}
          far={24}
          blur={2.6}
          opacity={0.5}
          resolution={mobile ? 256 : 512}
          color="#020202"
        />
      )}

      <Grid
        position={[0, -0.4, 0]}
        args={[80, 80]}
        cellSize={1.3}
        cellThickness={0.55}
        cellColor="#2a2c28"
        sectionSize={6.5}
        sectionThickness={1.1}
        sectionColor="#6b5138"
        fadeDistance={52}
        fadeStrength={1.5}
        infiniteGrid
        followCamera={false}
      />
    </>
  );
}
