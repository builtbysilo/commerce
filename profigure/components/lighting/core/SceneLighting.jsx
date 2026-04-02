'use client';

import {Environment, Lightformer} from '@react-three/drei';
import * as proceduralPresets from '../presets';
import * as hdriPresets from '../hdri';

// Lookup table: name string → config object
const allPresets = {
  ...proceduralPresets,
  ...hdriPresets,
};

// Renders a procedural lighting setup from a preset config
function ProceduralLighting({config}) {
  return (
    <Environment resolution={config.resolution || 512}>
      {config.lights.map((light, i) => (
        <Lightformer
          key={i}
          form={light.form || 'rect'}
          intensity={light.intensity}
          color={light.color}
          position={light.position}
          scale={light.scale}
          {...(light.rotationX != null ? {'rotation-x': light.rotationX} : {})}
        />
      ))}
    </Environment>
  );
}

// Renders an HDRI environment map
function HdriLighting({config}) {
  return (
    <Environment
      files={config.path}
      backgroundBlurriness={config.backgroundBlurriness}
      environmentIntensity={config.environmentIntensity}
    />
  );
}

// Unified lighting component
// preset: string name (e.g. "studio") or a full config object
function SceneLighting({preset = 'studio'}) {
  const config = typeof preset === 'string' ? allPresets[preset] : preset;

  if (!config) {
    console.warn(`SceneLighting: unknown preset "${preset}", falling back to studio`);
    return <ProceduralLighting config={proceduralPresets.studio} />;
  }

  if (config.type === 'hdri') {
    return <HdriLighting config={config} />;
  }

  return <ProceduralLighting config={config} />;
}

export default SceneLighting;
