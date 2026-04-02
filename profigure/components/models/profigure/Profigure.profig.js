// Profigure demo model configuration
const profigureConfig = {
  name: 'Profigure',
  path: '/models/Profigure-New.glb',
  center: true,
  defaultTransform: {
    position: [0, 0, 0],
    rotation: [90, 0, 0],
    scale: 0.4,
  },
  defaultCamera: {
    position: [0, 0, 4.5],
    fov: 20,
  },

  getMaterialAssignments(m) {
    return {
      Curve001: m.baseMetal,
      Curve002: m.baseMetal,
      Curve003: m.baseMetal,
    };
  },
};

export default profigureConfig;
