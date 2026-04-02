import Link from 'next/link';

const cards = [
  {
    title: 'Models',
    description: 'Position and rotate 3D models with live Leva controls. Copy transforms directly into settings files.',
    href: '/profigure/models',
  },
  {
    title: 'Materials',
    description: 'Tweak material parameters like roughness, metalness, and color in real time. Export preset configs.',
    href: '/profigure/materials',
  },
  {
    title: 'Lighting',
    description: 'Experiment with procedural lighting setups and HDRI environments. Fine-tune per-light parameters.',
    href: '/profigure/lighting',
  },
];

export default function ProfigureLanding() {
  return (
    <div className="flex flex-col justify-center items-center p-8 w-full h-full bg-gray-50">
      <h1 className="mb-2 text-2xl font-medium text-black">Profigure Dev Tools</h1>
      <p className="mb-8 text-sm text-gray-500">Select a lab to get started</p>

      <div className="grid gap-4 w-full max-w-2xl md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-2 p-5 bg-white rounded-lg border border-gray-200 transition-colors hover:border-black"
          >
            <span className="text-xs font-medium tracking-[0.1em] uppercase text-black">{card.title}</span>
            <span className="text-[10px] leading-normal text-gray-500">{card.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
