'use client';

import {Suspense, useState} from 'react';
import {Leva} from 'leva';
import {ModelProvider} from '../../../profigure/context/ModelContext';
import SceneCore from '../../../profigure/components/scenes/core/SceneCore';
import {
  HeadingXS,
  HeadingSM,
  HeadingXSFooter,
  ParagraphAlt,
} from '../../../profigure/components/uiComponents';
import {useLightingControls, allPresets} from '../../../profigure/hooks/useLightingControls';
import LightingPreview from './LightingPreview';
import Image from 'next/image';

const categories = [
  {label: 'Procedural', names: ['studio', 'dramatic', 'soft', 'custom']},
  {label: 'HDRI', names: ['warehouse', 'sunset', 'neutral']},
];

const typeBadgeColors = {
  procedural: 'bg-blue-100 text-blue-700',
  hdri: 'bg-purple-100 text-purple-700',
};

function LightingLabContent() {
  const {activeLighting, selectedPreset} = useLightingControls();
  const [useSphere, setUseSphere] = useState(false);

  return (
    <>
      <Leva collapsed={false} />
      <main className="grid overflow-hidden grid-cols-3 grid-rows-3 w-full h-full">
        {/* Scene */}
        <div className="relative col-span-3 row-span-1 max-h-screen bg-white lg:row-span-3 lg:col-span-2">
          <div className="absolute top-3 right-3 z-10 flex gap-1 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm p-1">
            <button
              onClick={() => setUseSphere(false)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                !useSphere ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Logo
            </button>
            <button
              onClick={() => setUseSphere(true)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                useSphere ? 'bg-black text-white' : 'text-gray-500 hover:text-black'
              }`}
            >
              Sphere
            </button>
          </div>
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full h-full">
                <p>Loading...</p>
              </div>
            }
          >
            <SceneCore lighting={activeLighting}>
              <LightingPreview useSphere={useSphere} />
            </SceneCore>
          </Suspense>
        </div>

        {/* Side panel */}
        <div className="flex overflow-y-scroll relative flex-col col-span-3 row-span-2 gap-4 p-4 h-full bg-gray-100 lg:row-span-3 lg:col-span-1">

          {/* Guide Card */}
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <HeadingSM>Lighting Lab</HeadingSM>
                <HeadingXSFooter className="text-gray-400">Development Environment</HeadingXSFooter>
              </div>
              <div className="overflow-hidden relative w-10 h-10 rounded-full bg-brandPrimary">
                <Image src="/ProfigureIcon.svg" alt="icon" fill className="object-contain" />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-3 space-y-3">
              <div>
                <HeadingXS className="mb-1">Getting Started</HeadingXS>
                <ParagraphAlt className="text-gray-500">
                  Select a lighting preset from the library below or the Leva dropdown on the canvas,
                  then adjust parameters like intensity, color, and position in real time.
                </ParagraphAlt>
              </div>

              <div>
                <HeadingXS className="mb-1">Copy Config</HeadingXS>
                <ParagraphAlt className="text-gray-500">
                  Click <span className="text-black font-medium">Copy Config</span> in the Leva panel
                  to copy the full lighting config to your clipboard, ready to paste into a preset file.
                </ParagraphAlt>
              </div>

              <div>
                <HeadingXS className="mb-1">Where to Paste</HeadingXS>
                <div className="px-3 py-2 bg-white rounded-lg border border-gray-200">
                  <code className="text-[10px] text-black leading-relaxed block">
                    app/components/lighting/presets/&lt;name&gt;.js<br />
                    app/components/lighting/hdri/&lt;name&gt;.js
                  </code>
                </div>
                <ParagraphAlt className="text-gray-500 mt-1">
                  Replace the existing config object in the preset file with the copied values.
                </ParagraphAlt>
              </div>
            </div>
          </div>

          {/* Preset Library */}
          <div className="flex flex-col gap-3">
            <HeadingXS className="text-gray-400">Preset Library</HeadingXS>

            {categories.map((category) => (
              <div key={category.label} className="flex flex-col gap-2">
                <HeadingXSFooter className="text-gray-400">{category.label}</HeadingXSFooter>
                {category.names.map((name) => {
                  const cfg = allPresets[name];
                  if (!cfg) return null;
                  const isActive = name === selectedPreset;
                  return (
                    <button
                      key={name}
                      onClick={() => window.dispatchEvent(new CustomEvent('lighting-lab-select', {detail: name}))}
                      className={`flex flex-col gap-1 p-3 rounded-lg border text-left transition-colors ${
                        isActive
                          ? 'border-black bg-white'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className="text-xs font-medium text-black">{name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${typeBadgeColors[cfg.type] || typeBadgeColors.procedural}`}>
                          {cfg.type}
                        </span>
                      </div>
                      <ParagraphAlt className="text-gray-500">{cfg.name}</ParagraphAlt>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function LightingLabPage() {
  return (
    <ModelProvider>
      <LightingLabContent />
    </ModelProvider>
  );
}

export default LightingLabPage;
