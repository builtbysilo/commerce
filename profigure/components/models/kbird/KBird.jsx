import {useGLTF, Clone} from "@react-three/drei";
import {forwardRef, useEffect, useLayoutEffect} from "react";
import {useModel} from "../../../context/ModelContext";
import * as THREE from "three";
import {useMeshControls} from "../../../hooks";
import {useMaterials} from "../../../hooks/useMaterials";

const KBird = forwardRef(function KBird({onMeshesFound, ...props}, ref) {
  const {scene, nodes} = useGLTF("/models/KBird.gltf");
  const {setModelData, accentColor} = useModel();
  const currentMaterials = useMaterials(accentColor);

  useEffect(() => {
    setModelData({nodes});
    console.log("KBird nodes:", nodes);
  }, [nodes, setModelData]);

  const materialAssignments = {
    Keyboard_Trackpad: {
      default: currentMaterials.baseMetal,
      meshes: {
        Sweep_2: currentMaterials.chrome,
      },
    },
    Keyboard_Keypad: {
      default: currentMaterials.baseMetal,
      meshes: {
        Extrude_0: currentMaterials.accentColor,
        Extrude_1: currentMaterials.accentColor,
        Extrude_2: currentMaterials.accentColor,
        Extrude_3: currentMaterials.accentColor,
        Tube_1: currentMaterials.chrome,
        Tube_1_1: currentMaterials.chrome,
        Sweep_1: currentMaterials.chrome,
        Polygon_77: currentMaterials.keyWhite,
        Polygon_78: currentMaterials.keyWhite,
        Polygon_79: currentMaterials.keyWhite,
        Polygon_80: currentMaterials.keyWhite,
        Polygon_81: currentMaterials.keyWhite,
        Polygon_82: currentMaterials.keyWhite,
        Polygon_83: currentMaterials.keyWhite,
        Polygon_84: currentMaterials.keyWhite,
        Polygon_85: currentMaterials.keyWhite,
        Polygon_86: currentMaterials.keyWhite,
        Polygon_87: currentMaterials.keyWhite,
        Polygon_88: currentMaterials.keyWhite,
        Polygon_89: currentMaterials.keyWhite,
        Polygon_90: currentMaterials.keyWhite,
        Polygon_91: currentMaterials.keyWhite,
        Polygon_92: currentMaterials.keyWhite,
        Polygon_93: currentMaterials.keyWhite,
        Polygon_94: currentMaterials.keyWhite,
        Polygon_95: currentMaterials.keyGray,
        Polygon_96: currentMaterials.keyGray,
        Polygon_97: currentMaterials.keyGray,
        Polygon_98: currentMaterials.keyGray,
        Polygon_99: currentMaterials.keyGray,
        Polygon_100: currentMaterials.keyGray,
        Polygon_101: currentMaterials.keyWhite,
        Polygon_102: currentMaterials.keyWhite,
        Polygon_103: currentMaterials.keyWhite,
        Polygon_104: currentMaterials.accentColor,
        Polygon_105: currentMaterials.keyGray,
        Polygon_106: currentMaterials.keyGray,
      },
    },
    Keyboard_Knobs: {
      default: currentMaterials.baseMetal,
      meshes: {
        Sweep_4: currentMaterials.chrome,
        Cylinder_3: currentMaterials.accentColor,
        Cylinder_4: currentMaterials.accentColor,
        Cylinder_5: currentMaterials.accentColor,
        Cylinder_6: currentMaterials.accentColor,
        Cylinder_7: currentMaterials.accentColor,
        Cylinder_8: currentMaterials.accentColor,
        Cylinder_9: currentMaterials.accentColor,
        Cylinder_10: currentMaterials.accentColor,
        Cylinder_11: currentMaterials.accentColor,
        Cylinder_12: currentMaterials.accentColor,
        Sweep_0_1: currentMaterials.chrome,
        Sweep_1_2: currentMaterials.chrome,
        Sweep_2_1: currentMaterials.chrome,
        Sweep_3_1: currentMaterials.chrome,
        Sweep_4_1: currentMaterials.chrome,
        Sweep_5_1: currentMaterials.chrome,
        Tube_1_5: currentMaterials.chrome,
        Tube_5: currentMaterials.chrome,
        Extrude: currentMaterials.chrome,
        Extrude_1: currentMaterials.chrome,
        Extrude_2: currentMaterials.chrome,
        Extrude_3: currentMaterials.chrome,
        Extrude_4: currentMaterials.chrome,
        Extrude_5: currentMaterials.chrome,
        VolumeKnob: currentMaterials.keyGray,
        VolumeKnob_1: currentMaterials.keyGray,
        ...Array(14)
          .fill(0)
          .map((_, i) => `VolumeKnob_${1 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyGray,
            }),
            {}
          ),
      },
    },
    Keyboard_Main: {
      default: currentMaterials.iridescent,
      meshes: {
        Polygon_65: currentMaterials.accentColor,
        VolumeKnob: currentMaterials.accentColor,
        Esc_Light: currentMaterials.glowColor,
        Middle: currentMaterials.accentColor,
        Polygon_22: currentMaterials.keyGray,
        Polygon_44: currentMaterials.keyWhite,
        Polygon: currentMaterials.keyWhite,
        Polygon_1: currentMaterials.keyWhite,
        Polygon_73: currentMaterials.keyWhite,
        Polygon_74: currentMaterials.keyWhite,
        ...Array(21)
          .fill(0)
          .map((_, i) => `Polygon_${1 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyWhite,
            }),
            {}
          ),
        Polygon_23: currentMaterials.keyWhite,
        ...Array(11)
          .fill(0)
          .map((_, i) => `Polygon_${23 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyWhite,
            }),
            {}
          ),
        Polygon_34: currentMaterials.keyWhite,
        ...Array(10)
          .fill(0)
          .map((_, i) => `Polygon_${34 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyWhite,
            }),
            {}
          ),
        Polygon_45: currentMaterials.keyGray,
        ...Array(20)
          .fill(0)
          .map((_, i) => `Polygon_${45 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyGray,
            }),
            {}
          ),
        Polygon_66: currentMaterials.keyGray,
        ...Array(7)
          .fill(0)
          .map((_, i) => `Polygon_${66 + i}`)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: currentMaterials.keyGray,
            }),
            {}
          ),
      },
    },
    Handles_1: {
      default: currentMaterials.chrome,
    },
    Handles_holders: {
      default: currentMaterials.chrome,
    },
    Bottom: {
      default: currentMaterials.accentColor,
    },
  };

  useMeshControls(scene, materialAssignments, onMeshesFound);

  return <primitive ref={ref} object={scene} {...props} />;
});

KBird.displayName = "KBird";
export default KBird;

useGLTF.preload("/models/KBird.gltf");
