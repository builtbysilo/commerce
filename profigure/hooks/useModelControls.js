// import {useControls, folder, button} from "leva"; // Moved to ProfigureHelper
import {useModel} from "../context/ModelContext";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import * as THREE from "three";
import {useFrame} from "@react-three/fiber";

export function useModelControls() {
  const {modelData} = useModel();

  // Basic transform controls - now handled by ProfigureHelper
  // Keeping basic values for backward compatibility
  const controls = {
    useContextValues: true,
    position: {x: 0, y: 0, z: 4},
    rotation: {x: 0, y: 0, z: 0},
  };

  return controls;
}

// Separate hook for mesh visibility controls - now handled by ProfigureHelper
export function useMeshVisibilityControls() {
  const {modelData, setModelData} = useModel();
  const [meshVisibility, setMeshVisibility] = useState({});

  // Check if we have valid mesh data
  const hasMeshData = useMemo(() => {
    const result = !!(
      modelData &&
      modelData.meshes &&
      typeof modelData.meshes === "object" &&
      Object.keys(modelData.meshes).length > 0
    );
    return result;
  }, [modelData]);

  // Stable reference to mesh names
  const meshNames = useMemo(() => {
    if (!hasMeshData) {
      return [];
    }
    const names = Object.keys(modelData.meshes).sort();
    return names;
  }, [hasMeshData, modelData?.meshes]);

  // Force re-evaluation of mesh data
  const refreshMeshData = useCallback(() => {
    if (modelData?.nodes) {
      if (!modelData.meshes && modelData.nodes) {
        const extractedMeshes = {};

        Object.entries(modelData.nodes).forEach(([nodeName, node]) => {
          if (node && node.isMesh) {
            extractedMeshes[nodeName] = {
              name: nodeName,
              type: node.type || "Mesh",
              object: node,
              parent: node.parent?.name || null,
              material: node.material?.name || "Unknown",
              geometry: node.geometry?.type || "Unknown",
              visible: node.visible !== false,
            };
          }
        });

        if (Object.keys(extractedMeshes).length > 0) {
          setModelData((prevData) => ({
            ...prevData,
            meshes: extractedMeshes,
          }));
        }
      }
    }
  }, [modelData, setModelData]);

  // Initialize visibility state for new meshes
  useEffect(() => {
    if (meshNames.length > 0) {
      const initialVisibility = {};
      meshNames.forEach((meshName) => {
        if (!(meshName in meshVisibility)) {
          initialVisibility[meshName] = true; // Default to visible
        }
      });

      if (Object.keys(initialVisibility).length > 0) {
        setMeshVisibility((prev) => ({...prev, ...initialVisibility}));
      }
    }
  }, [meshNames.length]);

  return {
    visibilityControls: {}, // Empty - handled by ProfigureHelper
    staticControls: {}, // Empty - handled by ProfigureHelper
    meshVisibility,
    meshCount: meshNames.length,
    refreshMeshData,
  };
}

export function useModelAnimation(
  modelRef,
  useContextValues = true,
  position = {},
  rotation = {}
) {
  const {getTargetTransform} = useModel();
  const targetTransform = getTargetTransform(
    useContextValues,
    position,
    rotation
  );

  useFrame((state, delta) => {
    if (!modelRef.current) return;

    // Smooth position transition
    modelRef.current.position.lerp(targetTransform.position, 2.5 * delta);

    // Smooth rotation transition
    const currentRotation = modelRef.current.rotation;
    currentRotation.x = THREE.MathUtils.lerp(
      currentRotation.x,
      targetTransform.rotation.x,
      2.5 * delta
    );
    currentRotation.y = THREE.MathUtils.lerp(
      currentRotation.y,
      targetTransform.rotation.y,
      2.5 * delta
    );
    currentRotation.z = THREE.MathUtils.lerp(
      currentRotation.z,
      targetTransform.rotation.z,
      2.5 * delta
    );
  });
}

export function useMeshControls(scene, materialAssignments, onMeshesFound) {
  const {setModelData} = useModel();
  const processedScenes = useRef(new Set());

  useLayoutEffect(() => {
    if (!scene) return;

    const sceneId = scene.uuid;
    if (processedScenes.current.has(sceneId)) {
      return;
    }

    // Collect all meshes in the scene
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
          material: child.material?.name || "Unknown",
          geometry: child.geometry?.type || "Unknown",
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

    processedScenes.current.add(sceneId);

    setModelData((prevData) => ({
      ...prevData,
      meshes: allMeshes,
      nodeHierarchy: nodeHierarchy,
    }));

    // Function to find meshes under specific nodes
    const findMeshesUnder = (nodeName) => {
      const meshes = [];
      let targetNode = null;

      scene.traverse((child) => {
        if (child.name === nodeName) {
          targetNode = child;
        }

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

      return {
        meshes,
        node: targetNode,
      };
    };

    const meshControls = {
      Keyboard_Main: findMeshesUnder("Keyboard_Main"),
      Keyboard_Knobs: findMeshesUnder("Keyboard_Knobs"),
      Keyboard_Trackpad: findMeshesUnder("Keyboard_Trackpad"),
      Keyboard_Keypad: findMeshesUnder("Keyboard_Keypad"),
    };

    if (onMeshesFound) {
      onMeshesFound({
        meshControls: meshControls,
        allMeshes: allMeshes,
        nodeHierarchy: nodeHierarchy,
      });
    }

    // Apply materials
    scene.traverse((child) => {
      if (child.isMesh) {
        let parent = child.parent;
        while (parent) {
          const assignment = materialAssignments[parent.name];
          if (assignment) {
            const materialProps =
              assignment.meshes?.[child.name] || assignment.default;
            if (materialProps) {
              child.material = new THREE.MeshStandardMaterial(materialProps);
            }
            break;
          }
          parent = parent.parent;
        }
      }
    });
  }, [scene, onMeshesFound, materialAssignments, setModelData]);
}

// New hook for mesh visibility management
export function useMeshVisibility(meshes, initialVisibility = {}) {
  const [visibility, setVisibility] = useState(initialVisibility);

  useEffect(() => {
    Object.entries(visibility).forEach(([meshName, isVisible]) => {
      const mesh = meshes[meshName];
      if (mesh?.object) {
        mesh.object.visible = isVisible;
      }
    });
  }, [visibility, meshes]);

  const toggleMesh = (meshName) => {
    setVisibility((prev) => ({
      ...prev,
      [meshName]: !prev[meshName],
    }));
  };

  const setMeshVisibility = (meshName, isVisible) => {
    setVisibility((prev) => ({
      ...prev,
      [meshName]: isVisible,
    }));
  };

  const showAll = () => {
    const newVisibility = {};
    Object.keys(meshes).forEach((meshName) => {
      newVisibility[meshName] = true;
    });
    setVisibility(newVisibility);
  };

  const hideAll = () => {
    const newVisibility = {};
    Object.keys(meshes).forEach((meshName) => {
      newVisibility[meshName] = false;
    });
    setVisibility(newVisibility);
  };

  return {
    visibility,
    toggleMesh,
    setMeshVisibility,
    showAll,
    hideAll,
  };
}

// Base hook for scene-specific controls
export function useSceneControls(sections, initialOptions = {}) {
  const {modelData} = useModel();
  const [selectedOptions, setSelectedOptions] = useState(initialOptions);
  const [meshVisibility, setMeshVisibility] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize selected options with first option from each section
  useEffect(() => {
    if (Object.keys(selectedOptions).length === 0) {
      const initialSelectedOptions = {};
      sections.forEach((section) => {
        if (section.options && section.options.length > 0) {
          initialSelectedOptions[section.title] = section.options[0].title;
        }
      });
      setSelectedOptions(initialSelectedOptions);
    }
  }, [sections, selectedOptions]);

  const getMeshesForPart = useCallback(
    (partName) => {
      if (!modelData?.meshes) return [];

      const meshes = [];
      Object.values(modelData.meshes).forEach((mesh) => {
        if (mesh.parent === partName) {
          meshes.push(mesh.name);
        }
        if (mesh.name.includes(partName)) {
          meshes.push(mesh.name);
        }
      });

      return [...new Set(meshes)];
    },
    [modelData?.meshes]
  );

  const togglePartVisibility = useCallback(
    (partName, isVisible) => {
      if (!modelData?.meshes) return;

      const meshesToToggle = getMeshesForPart(partName);

      meshesToToggle.forEach((meshName) => {
        const mesh = modelData.meshes[meshName];
        if (mesh?.object) {
          mesh.object.visible = isVisible;
        }
      });

      setMeshVisibility((prev) => {
        const newVisibility = {...prev};
        meshesToToggle.forEach((meshName) => {
          newVisibility[meshName] = isVisible;
        });
        return newVisibility;
      });
    },
    [modelData?.meshes, getMeshesForPart]
  );

  const selectOption = useCallback(
    (sectionTitle, optionTitle) => {
      const section = sections.find((s) => s.title === sectionTitle);
      if (!section) return;

      section.options.forEach((option) => {
        togglePartVisibility(option.title, false);
      });

      togglePartVisibility(optionTitle, true);

      setSelectedOptions((prev) => ({
        ...prev,
        [sectionTitle]: optionTitle,
      }));
    },
    [sections, togglePartVisibility]
  );

  // Initialize mesh visibility when model loads
  useEffect(() => {
    if (!modelData?.meshes || isInitialized) return;

    Object.values(modelData.meshes).forEach((mesh) => {
      if (mesh?.object) {
        mesh.object.visible = false;
      }
    });

    sections.forEach((section) => {
      if (section.options && section.options.length > 0) {
        togglePartVisibility(section.options[0].title, true);
      }
    });

    setIsInitialized(true);
  }, [modelData?.meshes, isInitialized, sections, togglePartVisibility]);

  const showAllMeshes = useCallback(() => {
    if (!modelData?.meshes) return;
    Object.values(modelData.meshes).forEach((mesh) => {
      if (mesh?.object) mesh.object.visible = true;
    });
  }, [modelData?.meshes]);

  const hideAllMeshes = useCallback(() => {
    if (!modelData?.meshes) return;
    Object.values(modelData.meshes).forEach((mesh) => {
      if (mesh?.object) mesh.object.visible = false;
    });
  }, [modelData?.meshes]);

  return {
    selectedOptions,
    selectOption,
    meshVisibility,
    togglePartVisibility,
    showAllMeshes,
    hideAllMeshes,
    isInitialized,
  };
}
