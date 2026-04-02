import MacbookScreenContent from './screens/MacbookScreenContent';

// MacBook model configuration
const macbookConfig = {
  name: 'MacBook',
  path: '/models/MAcBook.glb',
  defaultTransform: {
position: {x: 0, y: -0.6118500000000001, z: 2.01355},
rotation: {x: 0, y: 0, z: 0},
    scale: 0.05,
  },
  defaultCamera: {
    position: [0, 0, 4.5],
    fov: 20,
  },

  getMaterialAssignments(m) {
    return {};
  },

  // Screen mesh to replace with a live RenderTexture scene
  screenMesh: 'VQmfhbMzfNAuKAD',
  ScreenContent: MacbookScreenContent,
};

export default macbookConfig;
