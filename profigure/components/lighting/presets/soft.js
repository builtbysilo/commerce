const softPreset = {
  name: 'soft',
  type: 'procedural',
  resolution: 512,
  lights: [
    {
      // Wide ceiling diffuser
      form: 'rect',
      intensity: 3,
      rotationX: Math.PI / 2,
      position: [0, 4, 0],
      scale: [10, 6, 4],
      color: 'white',
    },
    {
      // Gentle key
      form: 'ring',
      color: 'white',
      intensity: 4,
      scale: 5,
      position: [6, 4, 8],
    },
    {
      // Matching fill — even illumination
      form: 'ring',
      color: 'white',
      intensity: 3.5,
      scale: 4,
      position: [-6, 3, -8],
    },
  ],
};

export default softPreset;
