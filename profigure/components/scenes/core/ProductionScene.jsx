'use client';

import {Leva} from 'leva';
import SceneCore from './SceneCore';

// Production-ready scene: LEVA hidden, no debug tools
function ProductionScene({children, ...sceneProps}) {
  return (
    <>
      <Leva hidden />
      <SceneCore {...sceneProps}>
        {children}
      </SceneCore>
    </>
  );
}

export default ProductionScene;
