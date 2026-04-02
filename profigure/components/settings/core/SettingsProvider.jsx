'use client';

import {createContext, useContext, useMemo} from 'react';

const SettingsContext = createContext(null);

export function SettingsProvider({settings, children}) {
  const value = useMemo(() => ({
    meta: settings.meta,
    defaults: settings.defaults,
    sections: settings.sections,
  }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
}
