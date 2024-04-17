import { Float, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

function Poster({ img }) {
  const texture = useLoader(TextureLoader, img);
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const x = positions.getX(i);
      const waveX = 0.1 * Math.sin(x * 1.5 + elapsedTime);
      const waveY = 0.1 * Math.sin(y * 2 + elapsedTime);
      positions.setZ(i, waveX + waveY);
    }

    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry attach="geometry" args={[2, 3, 16, 16]} />
      <meshStandardMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
}

const ThreeDPoster = ({ poster }) => {
  return (
    <Canvas camera={{ fov: 75, position: [0, 0, 3] }}>
      {/* <ambientLight intensity={3} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={4} /> */}
      <pointLight position={[10, 10, 10]} decay={0} intensity={5} />
      <Float position={[0, 0.1, 0]} rotation={[-0.1, 0.2, 0.3]} floatIntensity={3} speed={2}>
        <Poster img={`/3DPosters/${poster.areacode}-${poster.color}.png`} />
      </Float>
      <OrbitControls
        minAzimuthAngle={-Math.PI / 3}
        maxAzimuthAngle={Math.PI / 3}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </Canvas>
  );
};

export default dynamic(() => Promise.resolve(ThreeDPoster), {
  ssr: false
});
