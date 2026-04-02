'use client';

import {ProfigureProvider} from '../../../profigure/context/ProfigureProvider';
import {ModelScene} from '../../../profigure/components/scenes';
import OverlayConfigurationPanel from '../../../profigure/components/ui/OverlayConfigurationPanel';
import HeroOverlay from '../../../profigure/components/ui/HeroOverlay';
import macbookConfig from '../../../profigure/components/models/macbook/MacBook.profig';
import macbookSettings from '../../../profigure/components/settings/configs/macbook.settings';

const heroContent = {
  nav: {
    logo: 'Profigure',
    links: [
      {label: 'How It Works', href: '#'},
      {label: 'Use Cases', href: '#'},
      {label: 'Pricing', href: '#'},
    ],
  },
  headline: 'Profigure ',
  subheadline: 'Your frontend workflow, extended into 3D.',
  tagline: 'Designed for the way you work.',
  cta: {label: 'Start Configuring'},
  description: [
    'Profigure is the starting point developers reach for when they want an interactive 3D configurator without weeks of R3F boilerplate.',
    ' Bring your model. Write a config. Ship.',
  ],
  brand: 'Profigure ©2025',
};

function HeroSection() {
  return (
    <section className="relative h-[calc(100vh-2.5rem)] shrink-0">
      <ModelScene
        config={macbookConfig}
        settings={macbookSettings}
        orbitControls={{enableZoom: false}}
      />
      <HeroOverlay {...heroContent} />
      <div className="absolute top-4 right-4 z-20 flex items-start gap-3">
        <div className="flex items-center gap-2 mt-3">
          <span className="text-white/50 text-xs font-light italic">Try me</span>
          <div className="w-6 h-px bg-white/30" />
        </div>
        <OverlayConfigurationPanel settings={macbookSettings} />
      </div>
    </section>
  );
}

function LandingPageHeaderContent() {
  return (
    <div className="overflow-y-auto h-full">
      <HeroSection />

      {/* Placeholder sections — replace with real content */}
      <section className="flex justify-center items-center h-screen bg-white">
        <p className="font-mono text-sm text-gray-400">Section 2</p>
      </section>

      <section className="flex justify-center items-center h-screen bg-gray-50">
        <p className="font-mono text-sm text-gray-400">Section 3</p>
      </section>
    </div>
  );
}

export default function LandingPageHeaderPage() {
  return (
    <ProfigureProvider config={macbookConfig} settings={macbookSettings}>
      <LandingPageHeaderContent />
    </ProfigureProvider>
  );
}
