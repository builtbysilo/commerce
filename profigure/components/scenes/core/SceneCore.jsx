'use client';

import {Canvas} from '@react-three/fiber';
import {PerspectiveCamera, OrbitControls} from '@react-three/drei';
import {Suspense} from 'react';
import {EffectComposer, Bloom, DepthOfField, Noise, Vignette} from '@react-three/postprocessing';
import SceneLighting from '../../lighting/core/SceneLighting';

// Minimal Canvas wrapper — no debug tools
function SceneCore({
  children,
  backgroundColor = '#888C89',
  cameraPosition = [0, 0, 4.5],
  cameraFov = 20,
  lighting = 'studio',
  orbitControls = true,
  className = '',
  ...canvasProps
}) {
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{position: 'relative', width: '100%', height: '100%'}}
    >
      <Canvas
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
        dpr={[1, 2]}
        performance={{min: 0.5}}
        {...canvasProps}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={cameraFov} />
        <color attach="background" args={[backgroundColor]} />

        <Suspense fallback={null}>
          {children}
          {typeof lighting === 'string' || typeof lighting === 'object' ? (
            <SceneLighting preset={lighting} />
          ) : (
            lighting
          )}
        </Suspense>

        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0} mipmapBlur luminanceSmoothing={0.0} intensity={1} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {/* <DepthOfField target={[0, 0, 13]} focalLength={0.3} bokehScale={15} height={700} /> */}
        </EffectComposer>

        {orbitControls && (
          <OrbitControls
            enablePan={false}
            {...(typeof orbitControls === 'object' ? orbitControls : {})}
          />
        )}
      </Canvas>
    </div>
  );
}

export default SceneCore;
