'use client';

import {useMemo, useRef, useEffect} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {useGLTF, PerspectiveCamera, Text, Environment} from '@react-three/drei';
import * as THREE from 'three';
import {useModel} from '../../../../context/ModelContext';

const MODEL_LERP = 2.5;
const FADE_LERP  = 3.5;

// Camera is at z=5, fov=40 → visible half-size = tan(20°)×5 ≈ 1.82
// Logo corner target: 75% toward the bottom-right edge
const CORNER_X =  1.35;
const CORNER_Y = -1.35;

// ── Shared sin-wave text stack ────────────────────────────────────────────────
// Bold words stacked vertically. Each word gently bobs on Y via sin wave
// with a staggered phase — creates a smooth left-to-right ripple through the stack.
function TextSlide({words, color, opacityRef}) {
  const r0 = useRef(), r1 = useRef(), r2 = useRef(), r3 = useRef();
  const refs = [r0, r1, r2, r3];

  const n       = words.length;
  const spacing = n <= 3 ? 1.0 : 0.82;
  const fontSize = n <= 3 ? 0.88 : 0.72;

  useFrame(({clock}) => {
    const t  = clock.elapsedTime;
    const op = opacityRef.current;

    refs.forEach((r, i) => {
      if (!r.current) return;
      if (i >= n) {
        // unused slot — keep invisible
        r.current.fillOpacity = 0;
        return;
      }
      const baseY = (n / 2 - 0.5 - i) * spacing;
      // Sin ripple: stagger phase by 0.55 rad per word
      r.current.position.y = baseY + Math.sin(t * 1.7 + i * 0.55) * 0.06;
      r.current.fillOpacity = op;
    });
  });

  // Compute base Y positions for JSX initial placement
  const baseYs = [0, 1, 2, 3].map(i => (n / 2 - 0.5 - i) * spacing);

  return (
    <>
      {[0, 1, 2, 3].map(i => (
        <Text
          key={i}
          ref={refs[i]}
          position={[0, baseYs[i], 0]}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0}
          renderOrder={-1}
        >
          {words[i] ?? ''}
        </Text>
      ))}
    </>
  );
}

// ── Word lists ────────────────────────────────────────────────────────────────
const WORDS_CONFIGURE = ['Your.', 'Product.', 'Your.', 'Rules.'];
const WORDS_VISUALIZE = ['Real.', 'Time.', '3D.'];
const WORDS_CUSTOMIZE = ['Make.', 'It.', 'Yours.'];
const WORDS_PRESENT   = ['Build.', 'Ship.', 'Present.', 'Profigure.'];

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MacbookScreenContent() {
  const {scene}     = useGLTF('/models/Profigure.gltf');
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const modelRef    = useRef();
  const cameraRef   = useRef();
  const {scene: innerScene} = useThree();

  // Glass material for the spinning Profigure logo
  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:           new THREE.Color('#c8e0ff'),
    roughness:       0.05,
    metalness:       0.1,
    transparent:     true,
    opacity:         0.65,
    transmission:    0.85,
    thickness:       0.5,
    envMapIntensity: 1.8,
  }), []);

  const {screenParams} = useModel();
  const {
    backgroundColor = '#0a0a0a',
    scale           = 0.3,
    rotationSpeed   = 0.3,
    type            = 'showcase',
  } = screenParams || {};

  // Per-mode crossfade opacities
  const configureOpacity = useRef(0);
  const visualizeOpacity = useRef(0);
  const customizeOpacity = useRef(0);
  const presentOpacity   = useRef(0);

  // Lerped scene state
  const currentScale = useRef(scale);
  const currentSpeed = useRef(rotationSpeed);
  const currentColor = useRef(new THREE.Color(backgroundColor));
  const targetColor  = useRef(new THREE.Color(backgroundColor));
  const modelX       = useRef(0);
  const modelY       = useRef(0);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material    = glassMat;
        child.renderOrder = 1;
      }
    });
  }, [clonedScene, glassMat]);

  useEffect(() => { targetColor.current.set(backgroundColor); }, [backgroundColor]);
  useEffect(() => { innerScene.background = currentColor.current; }, [innerScene]);

  useFrame((state, delta) => {
    const mt = MODEL_LERP * delta;
    const ft = FADE_LERP  * delta;

    currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, rotationSpeed, mt);
    currentColor.current.lerp(targetColor.current, mt);
    innerScene.background = currentColor.current;

    configureOpacity.current = THREE.MathUtils.lerp(configureOpacity.current, type === 'configure' ? 1 : 0, ft);
    visualizeOpacity.current = THREE.MathUtils.lerp(visualizeOpacity.current, type === 'visualize' ? 1 : 0, ft);
    customizeOpacity.current = THREE.MathUtils.lerp(customizeOpacity.current, type === 'customize' ? 1 : 0, ft);
    presentOpacity.current   = THREE.MathUtils.lerp(presentOpacity.current,   type === 'present'   ? 1 : 0, ft);

    // Logo: center for showcase, bottom-right corner for all text modes
    const isShowcase  = type === 'showcase';
    const targetX     = isShowcase ? 0 : CORNER_X;
    const targetY     = isShowcase ? 0 : CORNER_Y;
    const targetScale = isShowcase ? scale : 0.07;

    modelX.current       = THREE.MathUtils.lerp(modelX.current, targetX, mt);
    modelY.current       = THREE.MathUtils.lerp(modelY.current, targetY, mt);
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, mt);

    if (modelRef.current) {
      modelRef.current.position.set(modelX.current, modelY.current, 0);
      modelRef.current.scale.setScalar(currentScale.current);
      modelRef.current.rotation.y = state.clock.elapsedTime * currentSpeed.current;
    }
    if (cameraRef.current) {
      cameraRef.current.updateProjectionMatrix();
    }
  });

  // Text color: dark on light background, white everywhere else
  const textColor = backgroundColor === '#f1f1f1' ? '#111111' : '#ffffff';

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault manual aspect={1} position={[0, 0, 5]} fov={40} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color="#8ab4f8" />
      <Environment preset="city" background={false} />

      <primitive ref={modelRef} object={clonedScene} rotation={[90, 0, 90]} />

      <TextSlide words={WORDS_CONFIGURE} color="#ffffff" opacityRef={configureOpacity} />
      <TextSlide words={WORDS_VISUALIZE} color="#111111" opacityRef={visualizeOpacity} />
      <TextSlide words={WORDS_CUSTOMIZE} color="#ffffff" opacityRef={customizeOpacity} />
      <TextSlide words={WORDS_PRESENT}   color="#ffffff" opacityRef={presentOpacity}   />
    </>
  );
}
