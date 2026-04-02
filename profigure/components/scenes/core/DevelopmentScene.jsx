'use client';

import {Leva} from 'leva';
import SceneCore from './SceneCore';

// Development scene: LEVA visible for tweaking model transforms
function DevelopmentScene({children, ...sceneProps}) {
  return (
    <>
      <Leva collapsed={false} />
      <SceneCore {...sceneProps}>
        {children}
      </SceneCore>
    </>
  );
}

export default DevelopmentScene;
