import * as THREE from 'three';

// Factory: (params, type) → THREE.Material
// Strips invalid properties per material type before construction
export function createMaterial(params, type = 'standard') {
  const props = {...params};

  // Remove properties that don't belong on certain material types
  if (type !== 'physical') {
    delete props.transmission;
    delete props.thickness;
    delete props.clearcoat;
    delete props.clearcoatRoughness;
  }
  if (type === 'toon') {
    delete props.roughness;
    delete props.metalness;
  }

  switch (type) {
    case 'standard':
      return new THREE.MeshStandardMaterial(props);
    case 'physical':
      return new THREE.MeshPhysicalMaterial(props);
    case 'toon':
      return new THREE.MeshToonMaterial(props);
    case 'basic':
      return new THREE.MeshBasicMaterial(props);
    default:
      return new THREE.MeshStandardMaterial(props);
  }
}
