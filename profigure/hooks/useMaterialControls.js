'use client';

import {useMemo, useEffect, useRef} from 'react';
import {useControls, button} from 'leva';
import {createMaterial} from '../components/materials/core/createMaterial';
import * as presets from '../components/materials/presets';
import * as extended from '../components/materials/extended';
import * as special from '../components/materials/special';

const allConfigs = {...presets, ...extended, ...special};
const materialNames = Object.keys(allConfigs);

export function useMaterialControls() {
  const prevNameRef = useRef(materialNames[0]);

  // Material selector
  const [{material}, setMaterial] = useControls('Material', () => ({
    material: {value: materialNames[0], options: materialNames},
  }), []);

  const config = allConfigs[material];
  const isPhysical = config.type === 'physical';

  // Common params — every material has these
  const [common, setCommon] = useControls('Parameters', () => ({
    color: {value: config.params.color ?? '#808080'},
    roughness: {value: config.params.roughness ?? 0.5, min: 0, max: 1, step: 0.01},
    metalness: {value: config.params.metalness ?? 0, min: 0, max: 1, step: 0.01},
    opacity: {value: config.params.opacity ?? 1, min: 0, max: 1, step: 0.01},
    transparent: config.params.transparent ?? false,
    emissiveIntensity: {value: config.params.emissiveIntensity ?? 0, min: 0, max: 10, step: 0.01},
    emissive: {value: config.params.emissive ?? '#000000'},
  }), []);

  // Physical-only params
  const [physical, setPhysical] = useControls('Physical', () => ({
    transmission: {value: 0, min: 0, max: 1, step: 0.01},
    thickness: {value: 0, min: 0, max: 5, step: 0.01},
    clearcoat: {value: 0, min: 0, max: 1, step: 0.01},
    clearcoatRoughness: {value: 0, min: 0, max: 1, step: 0.01},
  }), []);

  // When material changes, reset all sliders to that preset's defaults
  useEffect(() => {
    if (material !== prevNameRef.current) {
      prevNameRef.current = material;
      const p = allConfigs[material].params;
      setCommon({
        color: p.color ?? '#808080',
        roughness: p.roughness ?? 0.5,
        metalness: p.metalness ?? 0,
        opacity: p.opacity ?? 1,
        transparent: p.transparent ?? false,
        emissiveIntensity: p.emissiveIntensity ?? 0,
        emissive: p.emissive ?? '#000000',
      });
      setPhysical({
        transmission: p.transmission ?? 0,
        thickness: p.thickness ?? 0,
        clearcoat: p.clearcoat ?? 0,
        clearcoatRoughness: p.clearcoatRoughness ?? 0,
      });
    }
  }, [material, setCommon, setPhysical]);

  // Listen for sidebar clicks
  useEffect(() => {
    const handler = (e) => {
      if (allConfigs[e.detail]) setMaterial({material: e.detail});
    };
    window.addEventListener('material-lab-select', handler);
    return () => window.removeEventListener('material-lab-select', handler);
  }, [setMaterial]);

  // Build live material from current params
  const activeMaterial = useMemo(() => {
    const params = {...common};
    if (isPhysical) {
      params.transmission = physical.transmission;
      params.thickness = physical.thickness;
      params.clearcoat = physical.clearcoat;
      params.clearcoatRoughness = physical.clearcoatRoughness;
    }
    return createMaterial(params, config.type);
  }, [common, physical, config.type, isPhysical]);

  return {activeMaterial, selectedName: material};
}

export {allConfigs, materialNames};
