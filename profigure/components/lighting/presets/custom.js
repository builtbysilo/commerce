// Template for creating custom procedural lighting presets.
// Copy this file, rename it, and adjust the values below.
const customPreset = {
  name: 'custom',
  type: 'procedural',
  resolution: 512,
  lights: [
    {
      // Overhead fill — adjust scale for coverage
      form: 'rect',
      intensity: 2,
      rotationX: Math.PI / 2,
      position: [0, 4, 0],
      scale: [6, 2, 2],
      color: 'white',
    },
    {
      // Key light — position & intensity set the mood
      form: 'ring',
      color: 'white',
      intensity: 8,
      scale: 3,
      position: [10, 5, 10],
    },
  ],
};

export default customPreset;
