'use client';

import {useMemo, useEffect, useRef} from 'react';
import {useControls, button} from 'leva';
import * as proceduralPresets from '../components/lighting/presets';
import * as hdriPresets from '../components/lighting/hdri';

const allPresets = {...proceduralPresets, ...hdriPresets};
const presetNames = Object.keys(allPresets);

export function useLightingControls() {
  const prevPresetRef = useRef(presetNames[0]);

  // Preset selector
  const [{preset}, setPreset] = useControls('Preset', () => ({
    preset: {value: presetNames[0], options: presetNames},
  }), []);

  const config = allPresets[preset];
  const isProcedural = config?.type === 'procedural';
  const isHdri = config?.type === 'hdri';

  // Light selector + per-light controls (procedural only)
  const lightIndices = isProcedural ? config.lights.map((_, i) => String(i)) : ['0'];
  const defaultLight = isProcedural ? config.lights[0] : {};

  const [{selectedLight}, setLightSelector] = useControls('Light', () => ({
    selectedLight: {value: '0', options: lightIndices, render: () => isProcedural},
  }), [isProcedural, lightIndices.length]);

  const currentLight = isProcedural ? (config.lights[Number(selectedLight)] || config.lights[0]) : {};

  const [lightParams, setLightParams] = useControls('Light', () => ({
    form: {value: currentLight.form || 'rect', options: ['rect', 'ring', 'circle', 'sphere'], render: () => isProcedural},
    intensity: {value: currentLight.intensity ?? 5, min: 0, max: 30, step: 0.1, render: () => isProcedural},
    color: {value: currentLight.color || '#ffffff', render: () => isProcedural},
    posX: {value: currentLight.position?.[0] ?? 0, min: -20, max: 20, step: 0.1, render: () => isProcedural},
    posY: {value: currentLight.position?.[1] ?? 5, min: -20, max: 20, step: 0.1, render: () => isProcedural},
    posZ: {value: currentLight.position?.[2] ?? 0, min: -20, max: 20, step: 0.1, render: () => isProcedural},
    scale: {value: typeof currentLight.scale === 'number' ? currentLight.scale : 1, min: 0.1, max: 10, step: 0.1, render: () => isProcedural},
    rotationX: {value: currentLight.rotationX ?? 0, min: 0, max: 6.28, step: 0.01, render: () => isProcedural},
  }), [isProcedural]);

  // HDRI controls
  const [hdriParams, setHdriParams] = useControls('HDRI', () => ({
    backgroundBlurriness: {value: config?.backgroundBlurriness ?? 0.4, min: 0, max: 1, step: 0.01, render: () => isHdri},
    environmentIntensity: {value: config?.environmentIntensity ?? 1, min: 0, max: 5, step: 0.01, render: () => isHdri},
  }), [isHdri]);

  // Actions
  useControls('Actions', () => ({
    'Copy Config': button(() => {
      const output = buildConfig();
      navigator.clipboard.writeText(JSON.stringify(output, null, 2));
    }),
    'Reset': button(() => {
      resetToPreset(allPresets[preset]);
    }),
  }), [preset, lightParams, hdriParams]);

  // Track which light index we had, reset per-light controls when selectedLight changes
  const prevLightRef = useRef(selectedLight);
  useEffect(() => {
    if (selectedLight !== prevLightRef.current && isProcedural) {
      prevLightRef.current = selectedLight;
      const light = config.lights[Number(selectedLight)] || config.lights[0];
      setLightParams({
        form: light.form || 'rect',
        intensity: light.intensity ?? 5,
        color: light.color || '#ffffff',
        posX: light.position?.[0] ?? 0,
        posY: light.position?.[1] ?? 5,
        posZ: light.position?.[2] ?? 0,
        scale: typeof light.scale === 'number' ? light.scale : 1,
        rotationX: light.rotationX ?? 0,
      });
    }
  }, [selectedLight, isProcedural, config, setLightParams]);

  // When preset changes, reset all controls
  useEffect(() => {
    if (preset !== prevPresetRef.current) {
      prevPresetRef.current = preset;
      resetToPreset(allPresets[preset]);
    }
  }, [preset]);

  function resetToPreset(cfg) {
    if (!cfg) return;
    if (cfg.type === 'procedural') {
      setLightSelector({selectedLight: '0'});
      const light = cfg.lights[0];
      setLightParams({
        form: light.form || 'rect',
        intensity: light.intensity ?? 5,
        color: light.color || '#ffffff',
        posX: light.position?.[0] ?? 0,
        posY: light.position?.[1] ?? 5,
        posZ: light.position?.[2] ?? 0,
        scale: typeof light.scale === 'number' ? light.scale : 1,
        rotationX: light.rotationX ?? 0,
      });
    } else if (cfg.type === 'hdri') {
      setHdriParams({
        backgroundBlurriness: cfg.backgroundBlurriness ?? 0.4,
        environmentIntensity: cfg.environmentIntensity ?? 1,
      });
    }
  }

  // Build config object for clipboard/consumption
  function buildConfig() {
    if (isHdri) {
      return {
        type: 'hdri',
        path: config.path,
        backgroundBlurriness: hdriParams.backgroundBlurriness,
        environmentIntensity: hdriParams.environmentIntensity,
      };
    }
    // For procedural, we return the full lights array with the currently-edited light patched in
    const lights = config.lights.map((light, i) => {
      if (i === Number(selectedLight)) {
        return {
          form: lightParams.form,
          intensity: lightParams.intensity,
          color: lightParams.color,
          position: [lightParams.posX, lightParams.posY, lightParams.posZ],
          scale: lightParams.scale,
          rotationX: lightParams.rotationX,
        };
      }
      return {...light};
    });
    return {
      type: 'procedural',
      resolution: config.resolution || 512,
      lights,
    };
  }

  // Listen for sidebar clicks
  useEffect(() => {
    const handler = (e) => {
      if (allPresets[e.detail]) setPreset({preset: e.detail});
    };
    window.addEventListener('lighting-lab-select', handler);
    return () => window.removeEventListener('lighting-lab-select', handler);
  }, [setPreset]);

  // Build active lighting config for SceneLighting consumption
  const activeLighting = useMemo(() => {
    return buildConfig();
  }, [preset, lightParams, hdriParams, selectedLight, config]);

  return {activeLighting, selectedPreset: preset};
}

export {allPresets, presetNames};
