"use client";

import kbirdConfig from "../../profigure/components/models/kbird/KBird.profig";
import { ModelScene } from "../../profigure/components/scenes";
import kbirdSettings from "../../profigure/components/settings/configs/kbird.settings";
import ConfigurationPanel from "../../profigure/components/ui/ConfigurationPanel";
import { ProfigureProvider } from "../../profigure/context/ProfigureProvider";

export default function DemoClient({ productImages }) {
  return (
    <ProfigureProvider config={kbirdConfig} settings={kbirdSettings}>
      <main className="grid overflow-hidden grid-cols-3 grid-rows-3 w-full h-screen">
        <div className="relative col-span-3 row-span-1 max-h-screen bg-white lg:row-span-3 lg:col-span-2">
          <ModelScene config={kbirdConfig} settings={kbirdSettings} />
        </div>
        <ConfigurationPanel
          settings={kbirdSettings}
          productImages={productImages}
        />
      </main>
    </ProfigureProvider>
  );
}
