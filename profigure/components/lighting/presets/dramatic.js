const dramaticPreset = {
  name: 'dramatic',
  type: 'procedural',
  resolution: 512,
  lights: [
    {
      // Narrow ceiling spot
      form: 'rect',
      intensity: 1,
      rotationX: Math.PI / 2,
      position: [0, 5, 0],
      scale: [3, 1, 1],
      color: 'white',
    },
    {
      // Strong key light — high contrast
      form: 'ring',
      color: '#ffe8d0',
      intensity: 18,
      scale: 2,
      position: [8, 6, 6],
    },
    {
      // Dim fill — deepens shadows
      form: 'ring',
      color: '#c0d0ff',
      intensity: 2,
      scale: 1.5,
      position: [-8, 2, -6],
    },
  ],
};

export default dramaticPreset;
