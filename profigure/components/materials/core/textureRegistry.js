// Maps texture keys to file paths in /public/models/textures/
const textureRegistry = {
  roughness: '/models/textures/D_Rubber_ROUGH.jpg',
  normal: '/models/textures/D_Rubber_NORM_OGL.jpg',
  baseColor: '/models/textures/Smileys.png',
  baseColor2: '/models/textures/Mat01_BaseColor0003.jpg',
  scratches: '/models/textures/GSG_SI_Scratches_22.jpg',
};

// Ordered array of texture keys for useTexture loading
export const textureKeys = ['roughness', 'normal', 'baseColor', 'baseColor2', 'scratches'];

// Returns the ordered array of paths for useTexture
export function getTexturePaths() {
  return textureKeys.map((key) => textureRegistry[key]);
}

// Resolves a preset's texture map to the loaded texture object
export function resolveTextures(presetTextures, loadedTextures) {
  const resolved = {};
  for (const [mapKey, textureKey] of Object.entries(presetTextures)) {
    const index = textureKeys.indexOf(textureKey);
    if (index !== -1 && loadedTextures[index]) {
      resolved[mapKey] = loadedTextures[index];
    }
  }
  return resolved;
}

export default textureRegistry;
