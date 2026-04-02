'use client';

import {useGLTF, Center} from '@react-three/drei';
import {useEffect, useMemo} from 'react';
import * as THREE from 'three';

function LightingPreview({useSphere}) {
  const {scene} = useGLTF('/models/Profigure-New.glb');

  const material = useMemo(
    () => new THREE.MeshStandardMaterial({color: '#c0c0c0', roughness: 0.3, metalness: 0.8}),
    []
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  if (useSphere) {
    return (
      <mesh>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.8} />
      </mesh>
    );
  }

  return (
    <Center>
      <primitive object={scene} rotation={[Math.PI / 2, 0, 0]} />
    </Center>
  );
}

export default LightingPreview;
