import {Environment, Lightformer} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import {PerspectiveCamera} from "@react-three/drei";
import {Suspense} from "react";
import {ProfigureHelper} from "../../ui/ProfigureHelper";

// Default lighting setup
function DefaultLighting() {
  return (
    <Environment resolution={512}>
      {/* Ceiling */}
      <Lightformer
        intensity={2}
        rotation-x={Math.PI / 2}
        position={[0, 4, 0]}
        scale={[6, 2, 2]}
        color="white"
      />

      {/* Key light */}
      <Lightformer
        form="ring"
        color="white"
        intensity={10}
        scale={3}
        position={[10, 5, 10]}
      />

      {/* Fill light */}
      <Lightformer
        form="ring"
        color="white"
        intensity={5}
        scale={2}
        position={[-10, 3, -10]}
      />
    </Environment>
  );
}

// Base scene component
export function SceneBase({
  children,
  backgroundColor = "#888C89",
  cameraPosition = [0, 0, 4.5],
  cameraFov = 20,
  lighting = <DefaultLighting />,
  showProfigureHelper = true,
  sceneName = "Scene",
  selectedOptions = {},
  debugInfo = null,
  className = "",
  ...canvasProps
}) {
  return (
    <div
      className={`relative w-full h-full ${className}`}
      style={{position: "relative", width: "100%", height: "100%"}}
    >
      <Canvas
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 2]}
        performance={{min: 0.5}}
        {...canvasProps}
      >
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={cameraFov}
        />
        <color attach="background" args={[backgroundColor]} />

        <Suspense fallback={null}>
          {children}
          {lighting}
        </Suspense>
      </Canvas>

      {/* Profigure Helper - Global Debug Tool */}
      {showProfigureHelper && (
        <ProfigureHelper
          sceneName={sceneName}
          selectedOptions={selectedOptions}
          debugInfo={debugInfo}
        />
      )}
    </div>
  );
}

// Enhanced scene component with settings integration
export function SceneWithSettings({
  sceneName,
  ModelComponent,
  modelProps = {},
  ...sceneProps
}) {
  const {useSceneWithSettings} = require("../../../hooks");
  const controls = useSceneWithSettings(sceneName);

  return (
    <SceneBase
      sceneName={sceneName}
      selectedOptions={controls.selectedOptions}
      debugInfo={controls.debugInfo}
      {...sceneProps}
    >
      <ModelComponent {...modelProps} />
    </SceneBase>
  );
}
