'use client';

import {useGLTF, Center} from '@react-three/drei';
import {forwardRef, useEffect, useLayoutEffect, useRef} from 'react';
import {useModel} from '../../../context/ModelContext';
import {useMaterials} from '../../materials/core/useMaterials';
import {discoverMeshes, applyMaterials} from './MeshProcessor';
import {MacbookScreen} from '../../ui/MacbookScreen';

// Sets visibility of a named node and all its descendants
function setNodeVisibility(scene, nodeName, visible) {
  scene.traverse((child) => {
    if (child.name === nodeName) {
      child.visible = visible;
      child.traverse((descendant) => {
        descendant.visible = visible;
      });
    }
  });
}

const ModelLoader = forwardRef(function ModelLoader(
  {config, onMeshesFound, position, rotation, scale = 1, ...props},
  ref,
) {
  const {scene, nodes} = useGLTF(config.path);
  const {setModelData, accentColor} = useModel();
  const materials = useMaterials(accentColor);
  const discoveredRef = useRef(false);

  useEffect(() => {
    setModelData((prev) => ({...prev, nodes}));
  }, [nodes, setModelData]);

  // One-time mesh discovery + hide add-on nodes by default
  useLayoutEffect(() => {
    if (!scene || discoveredRef.current) return;
    discoveredRef.current = true;

    const {allMeshes, nodeHierarchy} = discoverMeshes(scene);

    // Hide add-on nodes by default
    if (config.addOns) {
      Object.values(config.addOns).forEach((nodeName) => {
        setNodeVisibility(scene, nodeName, false);
      });
    }

    setModelData((prev) => ({
      ...prev,
      meshes: allMeshes,
      nodeHierarchy,
      addOns: config.addOns || null,
      toggleAddOn: config.addOns ? (optionTitle, visible) => {
        const nodeName = config.addOns[optionTitle];
        if (nodeName) {
          setNodeVisibility(scene, nodeName, visible);
        }
      } : null,
    }));

    if (onMeshesFound) {
      onMeshesFound({allMeshes, nodeHierarchy});
    }
  }, [scene, onMeshesFound, setModelData, config]);

  // Re-apply materials whenever materials (accentColor) change
  useEffect(() => {
    if (!scene) return;
    if (config.getMaterialAssignments) {
      const assignments = config.getMaterialAssignments(materials);
      applyMaterials(scene, assignments);
    }
    if (config.getMeshOverrides) {
      const overrides = config.getMeshOverrides(materials);
      scene.traverse((child) => {
        if (child.isMesh && overrides[child.name]) {
          child.material = overrides[child.name];
        }
      });
    }
  }, [scene, materials, config]);

  const content = <primitive object={scene} scale={scale} {...props} />;

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {config.center ? <Center>{content}</Center> : content}
      {config.screenMesh && config.ScreenContent && (
        <MacbookScreen scene={scene} meshName={config.screenMesh}>
          <config.ScreenContent />
        </MacbookScreen>
      )}
    </group>
  );
});

ModelLoader.displayName = 'ModelLoader';
export default ModelLoader;
