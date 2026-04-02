import plastic from '../presets/plastic';

const glowColor = {
  name: 'glowColor',
  type: 'standard',
  accentColorDriven: true,
  params: {
    ...plastic.params,
    emissiveIntensity: 10,
    transparent: true,
  },
  textures: {},
  description: 'High-intensity emissive glow using accent color',
};

export default glowColor;
