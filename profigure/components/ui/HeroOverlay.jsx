'use client';

// Full-scene hero overlay: nav, headline, CTA, and description text.
// All content is passed as props — no scene or settings coupling.
function HeroOverlay({nav, headline, subheadline, tagline, cta, description, brand}) {
  return (
    <div className="flex absolute inset-0 z-10 flex-col justify-end pointer-events-none">
      {/* Bottom gradient — improves text legibility over the scene */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent from-black/60 via-black/20" />



      {/* Bottom: two rows separated by a border */}
      <div className="relative px-8 pb-8">
        {/* Row 1: headline left, CTA right */}
        <div className="flex justify-between items-center pb-4 border-b border-white/20">
          <div className="flex flex-col gap-1">
            {headline && (
              <h1 className="text-5xl font-semibold tracking-tight leading-tight text-white">
                {headline}
              </h1>
            )}
            {subheadline && (
              <p className="text-3xl font-light leading-snug text-white/60">
                {subheadline}
              </p>
            )}
          </div>
          {cta && (
            <button
              onClick={cta.onClick}
              className="px-6 py-2.5 text-sm text-white rounded-full border transition-colors pointer-events-auto shrink-0 border-white/40 hover:bg-white/10"
            >
              {cta.label}
            </button>
          )}
        </div>

        {/* Row 2: tagline left, brand center, description right */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="flex items-start">
            {tagline && (
              <p className="text-sm text-white/35">{tagline}</p>
            )}
          </div>
          <div className="flex justify-center items-start">
            {brand && (
              <p className="text-sm text-white/25">{brand}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            {description && (Array.isArray(description) ? description : [description]).map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-white/50">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroOverlay;
