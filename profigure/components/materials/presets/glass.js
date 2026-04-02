const glass = {
  name: 'glass',
  type: 'physical',
  params: {
    roughness: 0.1,
    metalness: 0.1,
    color: '#ffffff',
    transparent: true,
    opacity: 0.6,
    transmission: 0.9,
    thickness: 0.5,
  },
  textures: {roughnessMap: 'scratches'},
  description: 'Transparent glass with physical transmission',
};

export default glass;
