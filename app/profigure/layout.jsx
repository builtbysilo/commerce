'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';

const tabs = [
  {label: 'Models', href: '/profigure/models'},
  {label: 'Materials', href: '/profigure/materials'},
  {label: 'Lighting', href: '/profigure/lighting'},
  {label: 'Landing Header', href: '/profigure/landing-page-header'},
];

export default function ProfigureLayout({children}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full h-screen">
      {/* Nav bar */}
      <nav className="flex items-center gap-6 px-4 h-10 bg-white border-b border-gray-200 shrink-0">
        <Link href="/profigure" className="flex items-center gap-2">
          <div className="overflow-hidden relative w-6 h-6 rounded-full bg-brandPrimary">
            <Image src="/ProfigureIcon.svg" alt="icon" fill className="object-contain" />
          </div>
          <span className="text-xs font-medium tracking-[0.1em] uppercase text-black">Profigure</span>
        </Link>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase rounded-md transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
