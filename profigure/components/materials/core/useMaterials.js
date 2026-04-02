import {useTexture} from '@react-three/drei';
import {useMemo} from 'react';
import {createMaterial} from './createMaterial';
import {getTexturePaths, resolveTextures} from './textureRegistry';

// Preset configs
import * as presets from '../presets';
import * as extended from '../extended';
import * as special from '../special';

// Build material from a preset config + loaded textures, with optional accent color
function buildMaterial(config, loadedTextures, accentColor) {
  const resolved = resolveTextures(config.textures || {}, loadedTextures);
  const params = {...config.params, ...resolved};

  // Inject accent color for accent-driven materials
  if (config.accentColorDriven && accentColor) {
    params.color = accentColor;
    params.emissive = accentColor;
  }

  return createMaterial(params, config.type);
}

export const useMaterials = (accentColor = '#ff6b00') => {
  const loadedTextures = useTexture(getTexturePaths());

  return useMemo(() => ({
    // Base presets
    baseMetal: buildMaterial(presets.metal, loadedTextures, accentColor),
    chrome: buildMaterial(presets.chrome, loadedTextures, accentColor),
    plastic: buildMaterial(presets.plastic, loadedTextures, accentColor),
    glass: buildMaterial(presets.glass, loadedTextures, accentColor),
    toon: buildMaterial(presets.toon, loadedTextures, accentColor),
    matte: buildMaterial(presets.matte, loadedTextures, accentColor),
    glossy: buildMaterial(presets.glossy, loadedTextures, accentColor),

    // Extended presets
    scratchedMetal: buildMaterial(extended.scratchedMetal, loadedTextures, accentColor),
    brushedChrome: buildMaterial(extended.brushedChrome, loadedTextures, accentColor),

    // Special / accent-driven
    accentColor: buildMaterial(special.accentColor, loadedTextures, accentColor),
    glowColor: buildMaterial(special.glowColor, loadedTextures, accentColor),
    hologram: buildMaterial(special.hologram, loadedTextures, accentColor),
    neon: buildMaterial(special.neon, loadedTextures, accentColor),
    iridescent: buildMaterial(special.iridescent, loadedTextures, accentColor),

    // Key materials (kept for backward compat with Kbird)
    keyWhite: createMaterial({
      ...presets.plastic.params,
      color: '#ffffff',
      emissive: '#ffffff',
      emissiveIntensity: 0.1,
    }),
    keyGray: createMaterial({
      ...presets.plastic.params,
      color: '#808080',
    }),
  }), [loadedTextures, accentColor]);
};
