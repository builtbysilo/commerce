// Helper to generate Polygon_N ranges
function polygonRange(start, end, material) {
  const result = {};
  for (let i = start; i <= end; i++) {
    result[`Polygon_${i}`] = material;
  }
  return result;
}

function cylinderRange(start, end, material) {
  const result = {};
  for (let i = start; i <= end; i++) {
    result[`Cylinder_${i}`] = material;
  }
  return result;
}

function volumeKnobRange(start, end, material) {
  const result = {};
  for (let i = start; i <= end; i++) {
    result[`VolumeKnob_${i}`] = material;
  }
  return result;
}

// K-Bird keyboard model configuration
const kbirdConfig = {
  name: 'K-Bird',
  path: '/models/KBird.gltf',
  defaultTransform: {
    position: [0, 0, 4],
    rotation: [0, 0, 0],
    scale: 0.1,
  },
  defaultCamera: {
    position: [0, 0, 4.5],
    fov: 20,
  },

  // Add-ons: maps option title → GLTF node name. Hidden by default.
  addOns: {
    'Num Pad': 'Keyboard_Keypad',
    'Note Pad': 'Keyboard_Trackpad',
    'Mixer': 'Keyboard_Knobs',
  },

  // Material assignments: maps parent node names → material keys
  // (materials) → assignment map
  getMaterialAssignments(m) {
    return {
      Keyboard_Trackpad: {
        default: m.baseMetal,
        meshes: {Sweep_2: m.chrome},
      },
      Keyboard_Keypad: {
        default: m.baseMetal,
        meshes: {
          Extrude_0: m.accentColor, Extrude_1: m.accentColor,
          Extrude_2: m.accentColor, Extrude_3: m.accentColor,
          Tube_1: m.chrome, Tube_1_1: m.chrome,
          Sweep_1: m.chrome,
          ...polygonRange(77, 94, m.keyWhite),
          ...polygonRange(95, 100, m.keyGray),
          Polygon_101: m.keyWhite, Polygon_102: m.keyWhite, Polygon_103: m.keyWhite,
          Polygon_104: m.accentColor,
          Polygon_105: m.keyGray, Polygon_106: m.keyGray,
        },
      },
      Keyboard_Knobs: {
        default: m.baseMetal,
        meshes: {
          Sweep_4: m.chrome,
          ...cylinderRange(3, 12, m.accentColor),
          Sweep_0_1: m.chrome, Sweep_1_2: m.chrome, Sweep_2_1: m.chrome,
          Sweep_3_1: m.chrome, Sweep_4_1: m.chrome, Sweep_5_1: m.chrome,
          Tube_1_5: m.chrome, Tube_5: m.chrome,
          Extrude: m.chrome, Extrude_1: m.chrome, Extrude_2: m.chrome,
          Extrude_3: m.chrome, Extrude_4: m.chrome, Extrude_5: m.chrome,
          VolumeKnob: m.keyGray,
          ...volumeKnobRange(1, 14, m.keyGray),
        },
      },
      Keyboard_Main: {
        default: m.baseMetal,
        meshes: {
          Polygon_65: m.accentColor,
          VolumeKnob: m.accentColor,
          Esc_Light: m.glowColor,
          Middle: m.accentColor,
          Polygon_22: m.keyGray,
          Polygon_44: m.keyWhite,
          Polygon: m.keyWhite, Polygon_1: m.keyWhite,
          Polygon_73: m.keyWhite, Polygon_74: m.keyWhite,
          ...polygonRange(1, 21, m.keyWhite),
          Polygon_23: m.keyWhite,
          ...polygonRange(23, 33, m.keyWhite),
          Polygon_34: m.keyWhite,
          ...polygonRange(34, 43, m.keyWhite),
          Polygon_45: m.keyGray,
          ...polygonRange(45, 64, m.keyGray),
          Polygon_66: m.keyGray,
          ...polygonRange(66, 72, m.keyGray),
        },
      },
      Handles_1: {default: m.chrome},
      Handles_holders: {default: m.chrome},
      Bottom: {default: m.accentColor},
    };
  },
};

export default kbirdConfig;
