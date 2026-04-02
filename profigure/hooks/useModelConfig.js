import {useState, useCallback} from "react";
import * as THREE from "three";

export function useModelConfig(initialConfig = {}) {
  const [modelPosition, setModelPosition] = useState(
    initialConfig.position || {x: 0, y: 0, z: 0}
  );
  const [modelRotation, setModelRotation] = useState(
    initialConfig.rotation || {x: 0, y: 0, z: 0}
  );
  const [selectedOptions, setSelectedOptions] = useState({});
  const [modelData, setModelData] = useState(null);
  const [accentColor, setAccentColor] = useState(
    initialConfig.accentColor || "#ff6b00"
  );
  const [baseMaterial, setBaseMaterial] = useState(
    initialConfig.baseMaterial || "neon"
  );
  const [screenParams, setScreenParams] = useState(
    initialConfig.screenParams || {}
  );

  const updateModelTransform = useCallback((option) => {
    if (option.position) {
      setModelPosition(option.position);
    }
    if (option.rotation) {
      setModelRotation(option.rotation);
    }
  }, []);

  const handleOptionSelect = useCallback(
    (sectionTitle, option) => {
      // Add Ons: single-select — hide previous, show new
      if (sectionTitle === "Add Ons" && modelData?.toggleAddOn) {
        setSelectedOptions((prev) => {
          const current = prev["add ons"];
          // Hide the previously selected add-on
          if (current?.title) {
            modelData.toggleAddOn(current.title, false);
          }
          // Show the newly selected add-on
          modelData.toggleAddOn(option.title, true);
          return {...prev, "add ons": option};
        });
        updateModelTransform(option);
        return;
      }

      setSelectedOptions((prev) => ({
        ...prev,
        [sectionTitle.toLowerCase()]: option,
      }));
      updateModelTransform(option);

      if (sectionTitle === "Color" && option.color) {
        setAccentColor(option.color);
      }
      if (sectionTitle === "Material" && option.material) {
        setBaseMaterial(option.material);
      }
      if (option.screenParams !== undefined) {
        setScreenParams(option.screenParams);
      }

      if (modelData?.selectOption) {
        modelData.selectOption(sectionTitle, option.title);
      }
    },
    [updateModelTransform, modelData]
  );

  const getTargetTransform = useCallback(
    (useContextValues = true, position = {}, rotation = {}) => {
      return {
        position: new THREE.Vector3(
          useContextValues ? modelPosition.x : position.x,
          useContextValues ? modelPosition.y : position.y,
          useContextValues ? modelPosition.z : position.z
        ),
        rotation: new THREE.Euler(
          ((useContextValues ? modelRotation.x : rotation.x) * Math.PI) / 180,
          ((useContextValues ? modelRotation.y : rotation.y) * Math.PI) / 180,
          ((useContextValues ? modelRotation.z : rotation.z) * Math.PI) / 180
        ),
      };
    },
    [modelPosition, modelRotation]
  );

  return {
    modelPosition,
    modelRotation,
    setModelPosition,
    setModelRotation,
    selectedOptions: modelData?.selectedOptions || selectedOptions,
    modelData,
    accentColor,
    baseMaterial,
    screenParams,
    setModelData,
    setAccentColor,
    setBaseMaterial,
    setScreenParams,
    handleOptionSelect,
    getTargetTransform,
  };
}
