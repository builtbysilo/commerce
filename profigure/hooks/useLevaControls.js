'use client';

import {useControls, button} from 'leva';
import {useModel} from '../context/ModelContext';
import {useEffect, useRef} from 'react';

// LEVA-based position/rotation controls for the Pro Figure dev page.
// Slider values are in scale-normalized space (world / scale) so that the
// same slider movement produces proportional visual displacement regardless of
// model scale. Copy Transform outputs world-space values for settings files.
export function useLevaControls(config) {
  const scale = config?.defaultTransform?.scale ?? 1;

  const {
    modelPosition,
    modelRotation,
    setModelPosition,
    setModelRotation,
  } = useModel();

  const initialized = useRef(false);

  // Sliders show normalized position (world / scale); ranges scale inversely
  const [position, setPos] = useControls('Position', () => ({
    x: {value: (modelPosition?.x ?? 0) / scale, min: -2 / scale, max: 2 / scale, step: 0.001},
    y: {value: (modelPosition?.y ?? 0) / scale, min: -2 / scale, max: 2 / scale, step: 0.001},
    z: {value: (modelPosition?.z ?? 0) / scale, min: -2 / scale, max: 6 / scale, step: 0.001},
  }), []);

  const [rotation, setRot] = useControls('Rotation', () => ({
    x: {value: modelRotation?.x ?? 0, min: -360, max: 360, step: 1},
    y: {value: modelRotation?.y ?? 0, min: -360, max: 360, step: 1},
    z: {value: modelRotation?.z ?? 0, min: -360, max: 360, step: 1},
  }), []);

  // Copy Transform outputs world-space values so settings files are unchanged
  useControls('Actions', {
    'Copy Transform': button(() => {
      const text =
        `position: {x: ${position.x * scale}, y: ${position.y * scale}, z: ${position.z * scale}},\n` +
        `rotation: {x: ${rotation.x}, y: ${rotation.y}, z: ${rotation.z}},`;
      navigator.clipboard.writeText(text);
    }),
    'Reset': button(() => {
      setPos({x: 0, y: 0, z: 0});
      setRot({x: 0, y: 0, z: 0});
    }),
  }, [position, rotation, scale]);

  // Skip the initial render (values match context already), then sync slider → context
  // Convert normalized slider value back to world space before writing context
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return;
    }
    setModelPosition({x: position.x * scale, y: position.y * scale, z: position.z * scale});
  }, [position.x, position.y, position.z, setModelPosition, scale]);

  useEffect(() => {
    if (!initialized.current) return;
    setModelRotation({x: rotation.x, y: rotation.y, z: rotation.z});
  }, [rotation.x, rotation.y, rotation.z, setModelRotation]);

  return {position, rotation};
}
