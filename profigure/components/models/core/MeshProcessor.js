import * as THREE from 'three';

// Discovers meshes and builds hierarchy (run once per scene)
export function discoverMeshes(scene) {
  const allMeshes = {};
  const nodeHierarchy = {};

  scene.traverse((child) => {
    if (child.name) {
      nodeHierarchy[child.name] = {
        name: child.name,
        type: child.type,
        object: child,
        parent: child.parent?.name || null,
        children: [],
      };
    }

    if (child.isMesh) {
      const meshName = child.name || `Mesh_${child.id}`;
      allMeshes[meshName] = {
        name: meshName,
        type: child.type,
        object: child,
        parent: child.parent?.name || null,
        material: child.material?.name || 'Unknown',
        geometry: child.geometry?.type || 'Unknown',
        visible: child.visible,
      };
    }
  });

  // Build parent-child relationships
  Object.values(nodeHierarchy).forEach((node) => {
    if (node.parent && nodeHierarchy[node.parent]) {
      nodeHierarchy[node.parent].children.push(node.name);
    }
  });

  return {allMeshes, nodeHierarchy};
}

// Applies material assignments to scene meshes (run whenever materials change)
export function applyMaterials(scene, materialAssignments = {}) {
  scene.traverse((child) => {
    if (child.isMesh) {
      let parent = child.parent;
      while (parent) {
        const assignment = materialAssignments[parent.name];
        if (assignment) {
          const material = assignment.meshes?.[child.name] || assignment.default;
          if (material) {
            child.material = material;
          }
          break;
        }
        parent = parent.parent;
      }
    }
  });
}

// Combined: discover + apply (convenience for one-shot usage)
export function processScene(scene, materialAssignments = {}) {
  const result = discoverMeshes(scene);
  applyMaterials(scene, materialAssignments);
  return result;
}

// Finds all meshes under a specific named node
export function findMeshesUnder(scene, nodeName) {
  const meshes = [];
  let targetNode = null;

  scene.traverse((child) => {
    if (child.name === nodeName) targetNode = child;

    if (child.isMesh) {
      let parent = child.parent;
      while (parent) {
        if (parent.name === nodeName) {
          meshes.push({
            name: child.name,
            type: child.type,
            parent: parent.name,
            mesh: child,
          });
          break;
        }
        parent = parent.parent;
      }
    }
  });

  return {meshes, node: targetNode};
}
