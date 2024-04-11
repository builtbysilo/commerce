import { OrbitControls } from '@react-three/drei';
import { Canvas, useLoader } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

function Poster({ img }) {
  const texture = useLoader(TextureLoader, img);
  return (
    <mesh>
      <planeGeometry attach="geometry" args={[2, 3]} />
      <meshBasicMaterial attach="material" map={texture} toneMapped={false} />
    </mesh>
  );
}

const ThreeDPoster = () => {
  return (
    <Canvas>
      {/* <ambientLight intensity={Math.PI / 2} /> */}
      {/* <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
      {/* <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} /> */}
      <Poster img="/3DPosterTest.jpg" />
      <OrbitControls />
    </Canvas>
  );
};

export default dynamic(() => Promise.resolve(ThreeDPoster), {
  ssr: false
});
