const studioPreset = {
  name: 'studio',
  type: 'procedural',
  resolution: 512,
  lights: [
    {
      // Ceiling
      form: 'rect',
      intensity: 2,
      rotationX: Math.PI / 2,
      position: [0, 4, 0],
      scale: [6, 2, 2],
      color: 'white',
    },
    {
      // Key light
      form: 'ring',
      color: 'white',
      intensity: 10,
      scale: 3,
      position: [10, 5, 10],
    },
    {
      // Fill light
      form: 'ring',
      color: 'white',
      intensity: 5,
      scale: 2,
      position: [-10, 3, -10],
    },
  ],
};

export default studioPreset;
