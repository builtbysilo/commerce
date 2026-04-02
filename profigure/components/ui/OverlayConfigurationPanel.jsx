'use client';

import {useModel} from '../../context/ModelContext';

// Overlay layout variant of ConfigurationPanel — floating light panel with radio lists
function OverlayConfigurationPanel({settings}) {
  const {meta, sections} = settings;
  const {handleOptionSelect, selectedOptions} = useModel();

  const allSelectedTitles = Object.values(selectedOptions)
    .map((opt) => opt?.title)
    .filter(Boolean);

  const statusText = allSelectedTitles.length > 0
    ? `${allSelectedTitles.join(' · ')} · ${meta.name}`
    : meta.name;

  return (
    <div className="flex flex-col w-56 font-mono text-xs bg-white border border-black/10 rounded-sm overflow-hidden shadow-[0_0_24px_rgba(99,102,241,0.35),0_0_48px_rgba(168,85,247,0.2),0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="px-3 pt-3 pb-2 border-b border-black/10">
        <div className="text-black/40 uppercase tracking-widest text-[11px]">Profigure</div>
        <div className="text-black uppercase tracking-widest text-[11px] mt-0.5">{meta.name}</div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-0">
        {sections.map((section, sectionIndex) => {
          const selectedOption = selectedOptions[section.title.toLowerCase()];

          return (
            <div key={sectionIndex} className="px-3 py-2 border-b border-black/10">
              <div className="mb-1.5 text-black/40 uppercase tracking-widest text-[11px]">
                {section.title}
              </div>
              <div className="flex flex-col gap-0.5">
                {section.options.map((option, optionIndex) => {
                  const isActive = selectedOption?.title === option.title;
                  return (
                    <button
                      key={optionIndex}
                      onClick={() => handleOptionSelect(section.title, option)}
                      className="flex items-center gap-2 py-0.5 w-full text-left group"
                    >
                      <span className={`shrink-0 text-[11px] leading-none ${isActive ? 'text-black' : 'text-black/25 group-hover:text-black/50'}`}>
                        {isActive ? '[■]' : '[□]'}
                      </span>
                      <span className={`text-[12px] leading-none ${isActive ? 'text-black' : 'text-black/40 group-hover:text-black/70'}`}>
                        {option.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="px-3 py-2 text-black/30 text-[11px] leading-tight tracking-wide">
        {statusText}
      </div>
    </div>
  );
}

export default OverlayConfigurationPanel;
