import Link from "next/link";

export const metadata = {
  description: "Profigure — interactive 3D product configurators powered by Shopify.",
  openGraph: {
    type: "website",
  },
};

const links = [
  {
    href: "/demo",
    label: "Demo",
    description: "Live KBird configurator — explore the 3D product experience.",
  },
  {
    href: "/profigure",
    label: "Dev Tools",
    description: "Adjust model transforms, materials, and lighting with live controls.",
  },
  {
    href: "/search",
    label: "Shop",
    description: "Browse the full product catalog and collections.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-black dark:text-white">
          Profigure
        </h1>
        <p className="mb-12 text-lg text-neutral-500 dark:text-neutral-400">
          Interactive 3D product configurators, powered by Shopify.
        </p>

        <div className="flex flex-col gap-3">
          {links.map(({ href, label, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-6 py-5 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-600"
            >
              <div>
                <p className="font-semibold text-black dark:text-white">{label}</p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {description}
                </p>
              </div>
              <span className="ml-4 text-neutral-400 transition-transform group-hover:translate-x-1 dark:text-neutral-600">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
