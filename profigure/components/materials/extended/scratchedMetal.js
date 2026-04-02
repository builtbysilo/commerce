import metal from '../presets/metal';

const scratchedMetal = {
  name: 'scratchedMetal',
  extends: 'metal',
  type: metal.type,
  params: {...metal.params, roughness: 0.85},
  textures: {...metal.textures, roughnessMap: 'scratches'},
  description: 'Heavy-scratch variant of base metal',
};

export default scratchedMetal;
