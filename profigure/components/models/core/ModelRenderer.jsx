'use client';

import {useRef, Suspense, useState, useCallback} from 'react';
import {useFrame} from '@react-three/fiber';
import * as THREE from 'three';
import {useModel} from '../../../context/ModelContext';
import ModelLoader from './ModelLoader';

// Animated wrapper: lerps position/rotation, renders ModelLoader
function ModelRenderer({config, useContextValues = true, manualPosition, manualRotation}) {
  const {modelPosition, modelRotation} = useModel();
  const modelRef = useRef();
  const [, setModelLoaded] = useState(false);

  const handleMeshesFound = useCallback(() => {
    setModelLoaded(true);
  }, []);

  // Compute targets
  const pos = useContextValues ? modelPosition : manualPosition;
  const rot = useContextValues ? modelRotation : manualRotation;

  const targetPosition = new THREE.Vector3(
    pos?.x ?? 0,
    pos?.y ?? 0,
    pos?.z ?? config.defaultTransform.position[2] ?? 4,
  );

  const targetRotation = new THREE.Euler(
    ((rot?.x ?? 0) * Math.PI) / 180,
    ((rot?.y ?? 0) * Math.PI) / 180,
    ((rot?.z ?? 0) * Math.PI) / 180,
  );

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    modelRef.current.position.lerp(targetPosition, 2.5 * delta);
    const cur = modelRef.current.rotation;
    cur.x = THREE.MathUtils.lerp(cur.x, targetRotation.x, 2.5 * delta);
    cur.y = THREE.MathUtils.lerp(cur.y, targetRotation.y, 2.5 * delta);
    cur.z = THREE.MathUtils.lerp(cur.z, targetRotation.z, 2.5 * delta);
  });

  const {position, rotation, scale} = config.defaultTransform;

  const posArray = Array.isArray(position)
    ? position
    : [position?.x ?? 0, position?.y ?? 0, position?.z ?? 0];

  const rotArray = Array.isArray(rotation)
    ? rotation.map((r) => (r * Math.PI) / 180)
    : [(rotation?.x ?? 0) * Math.PI / 180, (rotation?.y ?? 0) * Math.PI / 180, (rotation?.z ?? 0) * Math.PI / 180];

  return (
    <Suspense fallback={null}>
      <ModelLoader
        ref={modelRef}
        config={config}
        position={posArray}
        rotation={rotArray}
        scale={typeof scale === 'number' ? scale : 1}
        onMeshesFound={handleMeshesFound}
      />
    </Suspense>
  );
}

export default ModelRenderer;
