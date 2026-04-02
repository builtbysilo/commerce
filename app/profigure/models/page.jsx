'use client';

import {Suspense} from 'react';
import {ModelProvider} from '../../../profigure/context/ModelContext';
import {DevelopmentScene} from '../../../profigure/components/scenes';
import {ModelRenderer} from '../../../profigure/components/models';
import {MeshViewer} from '../../../profigure/components/settings';
import {
  HeadingXS,
  HeadingSM,
  HeadingXSFooter,
  ParagraphAlt,
} from '../../../profigure/components/uiComponents';
import {useLevaControls} from '../../../profigure/hooks/useLevaControls';
import macbookConfig from '../../../profigure/components/models/macbook/MacBook.profig';
import macbookSettings from '../../../profigure/components/settings/configs/macbook.settings';
import Image from 'next/image';

function ModelsContent() {
  useLevaControls(macbookConfig);

  return (
    <main className="grid overflow-hidden grid-cols-3 grid-rows-3 w-full h-full">
      {/* Canvas with LEVA overlay */}
      <div className="relative col-span-3 row-span-1 max-h-screen bg-white lg:row-span-3 lg:col-span-2">
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-full">
              <p>Loading...</p>
            </div>
          }
        >
          <DevelopmentScene
            backgroundColor={macbookSettings.defaults.background}
            lighting={macbookSettings.defaults.lighting}
          >
            <ModelRenderer config={macbookConfig} />
          </DevelopmentScene>
        </Suspense>
      </div>

      {/* Right column: guide + mesh viewer */}
      <div className="flex overflow-y-scroll relative flex-col col-span-3 row-span-2 gap-4 p-4 h-full bg-gray-100 lg:row-span-3 lg:col-span-1">

        {/* Pro Figure Guide Card */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1">
              <HeadingSM>Models</HeadingSM>
              <HeadingXSFooter className="text-gray-400">Development Environment</HeadingXSFooter>
            </div>
            <div className="overflow-hidden relative w-10 h-10 rounded-full bg-brandPrimary">
              <Image src="/ProfigureIcon.svg" alt="icon" fill className="object-contain" />
            </div>
          </div>

          <div className="pt-3 space-y-3 border-t border-gray-200">
            <div>
              <HeadingXS className="mb-1">Getting Started</HeadingXS>
              <ParagraphAlt className="text-gray-500">
                Use the draggable Leva panel on the canvas to adjust the model&apos;s position and rotation
                in real time. The sliders give you fine-grained control over how the model is framed
                for each configuration option.
              </ParagraphAlt>
            </div>

            <div>
              <HeadingXS className="mb-1">Copy Transform</HeadingXS>
              <ParagraphAlt className="text-gray-500">
                Once you&apos;ve found the right view, click <span className="font-medium text-black">Copy Transform</span> in
                the Leva panel. This copies the current position and rotation values to your clipboard.
                Paste them into the option object where you want this view to appear in your settings file.
              </ParagraphAlt>
            </div>

            <div>
              <HeadingXS className="mb-1">Where to Paste</HeadingXS>
              <div className="px-3 py-2 bg-white rounded-lg border border-gray-200">
                <code className="text-[10px] text-black leading-relaxed block">
                  app/components/settings/configs/<br />
                  &nbsp;&nbsp;&lt;model&gt;.settings.js
                </code>
              </div>
              <ParagraphAlt className="mt-1 text-gray-500">
                Each option in the sections array accepts <span className="text-black">position</span> and <span className="text-black">rotation</span> properties
                that control how the model is framed when the user selects that option.
              </ParagraphAlt>
            </div>
          </div>
        </div>

        {/* Mesh Viewer */}
        <MeshViewer />
      </div>
    </main>
  );
}

function toXYZ(val) {
  if (Array.isArray(val)) return {x: val[0] ?? 0, y: val[1] ?? 0, z: val[2] ?? 0};
  return {x: val?.x ?? 0, y: val?.y ?? 0, z: val?.z ?? 0};
}

function ModelsPage() {
  const {position, rotation} = macbookConfig.defaultTransform;
  return (
    <ModelProvider
      initialConfig={{
        position: toXYZ(position),
        rotation: toXYZ(rotation),
      }}
    >
      <ModelsContent />
    </ModelProvider>
  );
}

export default ModelsPage;
