import { Bars2Icon } from '@heroicons/react/24/outline';
import Cart from 'components/cart';
import OpenCart from 'components/cart/open-cart';
import LogoSquare from 'components/logo-square';
import { getMenu } from 'lib/shopify';
import Link from 'next/link';
import { Suspense } from 'react';
// const { SITE_NAME } = process.env;

export default async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');

  return (
    <nav className="absolute z-30 flex w-full items-center justify-center p-4 lg:px-6">
      {/* <div className="flex-none block md:hidden">
        <MobileMenu menu={menu} />
      </div> */}
      <div className="flex w-full items-center justify-between">
        {/* <div className="flex w-full md:w-1/3">
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div> */}
        <div className="flex w-full justify-center">
          <Suspense fallback={<OpenCart />}>
            <div className="align-center flex items-center rounded-xl border border-black bg-zinc-800 p-2">
              <div className="relative flex h-20 w-20 items-center justify-center text-white transition-colors">
                <Bars2Icon className="h-6 w-6 text-white" />
              </div>
              <Link href="/" className="flex items-center justify-center">
                <LogoSquare />
              </Link>
              <Cart />
            </div>
          </Suspense>
        </div>
      </div>
    </nav>
  );
}
