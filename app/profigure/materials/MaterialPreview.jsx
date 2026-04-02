'use client';

import {useGLTF, Center} from '@react-three/drei';
import {useEffect} from 'react';

function MaterialPreview({material, useSphere}) {
  const {scene} = useGLTF('/models/Profigure-New.glb');

  useEffect(() => {
    if (material) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material = material;
        }
      });
    }
  }, [scene, material]);

  if (useSphere) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 64, 64]} />
        {material && <primitive object={material} attach="material" />}
      </mesh>
    );
  }

  return (
    <Center>
      <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
    </Center>
  );
}

export default MaterialPreview;
