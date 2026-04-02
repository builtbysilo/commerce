'use client';

import {ModelProvider} from './ModelContext';
import {SettingsProvider} from '../components/settings';

// Convenience wrapper: ModelProvider + SettingsProvider.
// Pass config and settings — provider setup is handled automatically.
export function ProfigureProvider({config, settings, children}) {
  return (
    <ModelProvider initialConfig={config.defaultTransform}>
      <SettingsProvider settings={settings}>
        {children}
      </SettingsProvider>
    </ModelProvider>
  );
}
