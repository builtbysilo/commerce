'use client';

import {useSettings} from '../core/SettingsProvider';
import {
  HeadingXS,
  HeadingSM,
  HeadingXSFooter,
  ParagraphAlt,
} from '../../uiComponents';

function SettingsEditor() {
  const {meta, defaults, sections} = useSettings();

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-300">
      <div className="flex justify-between items-center">
        <HeadingSM>Settings: {meta.name}</HeadingSM>
        <HeadingXSFooter className="text-gray-400">v{meta.version}</HeadingXSFooter>
      </div>

      <div className="space-y-1">
        <ParagraphAlt className="text-gray-500">Model: <span className="text-black">{meta.model}</span></ParagraphAlt>
        <ParagraphAlt className="text-gray-500">Lighting: <span className="text-black">{defaults.lighting}</span></ParagraphAlt>
        <ParagraphAlt className="text-gray-500">Background: <span className="text-black">{defaults.background}</span></ParagraphAlt>
        <ParagraphAlt className="text-gray-500">
          Accent:{' '}
          <span className="inline-flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full border border-gray-300" style={{backgroundColor: defaults.accentColor}} />
            <span className="text-black">{defaults.accentColor}</span>
          </span>
        </ParagraphAlt>
      </div>

      <div className="border-t border-gray-200 pt-3 space-y-3">
        {sections.map((section) => (
          <div key={section.title}>
            <HeadingXS className="text-gray-500 mb-1">
              {section.title} ({section.options.length})
            </HeadingXS>
            <div className="flex flex-wrap gap-1">
              {section.options.map((option) => (
                <span key={option.title} className="text-[10px] px-2 py-0.5 bg-white rounded border border-gray-200 text-black">
                  {option.title}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsEditor;
