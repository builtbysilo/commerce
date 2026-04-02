import plastic from '../presets/plastic';

const accentColor = {
  name: 'accentColor',
  type: 'standard',
  accentColorDriven: true,
  params: {
    ...plastic.params,
    emissiveIntensity: 0.4,
    transparent: true,
    opacity: 0.98,
  },
  textures: {},
  description: 'Accent-color driven plastic with emissive glow',
};

export default accentColor;
