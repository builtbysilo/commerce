'use client';

import {useLayoutEffect, useMemo} from 'react';
import {createPortal} from '@react-three/fiber';
import {RenderTexture} from '@react-three/drei';

// Replaces a named mesh in the GLTF scene with a live RenderTexture scene.
// Uses createPortal to render into the mesh's existing parent group so all
// GLTF transforms are inherited correctly — no matrix math needed.
export function MacbookScreen({scene, meshName, children}) {
  const screenMesh = scene?.getObjectByName(meshName);

  // The screen mesh UVs are inverted on both axes in the GLB.
  // Clone the geometry and flip U and V so RenderTexture content appears correctly.
  const correctedGeometry = useMemo(() => {
    if (!screenMesh) return null;
    const geo = screenMesh.geometry.clone();
    const uvs = geo.attributes.uv;
    for (let i = 0; i < uvs.count; i++) {
      uvs.setY(i, 1 - uvs.getY(i));
    }
    uvs.needsUpdate = true;
    return geo;
  }, [screenMesh]);

  // Hide the original embedded mesh
  useLayoutEffect(() => {
    if (!screenMesh) return;
    screenMesh.visible = false;
    return () => {
      screenMesh.visible = true;
    };
  }, [screenMesh]);

  if (!screenMesh || !correctedGeometry) return null;

  // Portal into the mesh's parent group — the overlay inherits the correct
  // local coordinate space without any extra transform bookkeeping
  return createPortal(
    <mesh geometry={correctedGeometry}>
      <meshBasicMaterial toneMapped={false}>
        <RenderTexture attach="map" anisotropy={16}>
          {children}
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>,
    screenMesh.parent,
  );
}
