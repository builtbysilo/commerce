'use client';

import {Suspense} from 'react';
import ProductionScene from './ProductionScene';
import {ModelRenderer} from '../../models';

// Convenience wrapper: Suspense + ProductionScene + ModelRenderer
// Pass config and settings — scene props are derived automatically.
function ModelScene({config, settings, ...sceneProps}) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center w-full h-full bg-[#090909]">
          <p className="font-mono text-xs text-white/30">Loading...</p>
        </div>
      }
    >
      <ProductionScene
        backgroundColor={settings.defaults.background}
        lighting={settings.defaults.lighting}
        {...sceneProps}
      >
        <ModelRenderer config={config} />
      </ProductionScene>
    </Suspense>
  );
}

export default ModelScene;
