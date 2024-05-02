'use client';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { motion } from 'framer-motion';
import { Product } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';
import { VariantSelector } from './variant-selector';

export default function ProductInfoBar({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  // First, call useRouter at the top level of your component.

  const pathname = usePathname();
  // Parse the URL using a separate function outside of any conditionals.
  const parseURL = (pathname: string) => {
    const parts = pathname.split('/');
    if (parts.length > 2) {
      const productDetails = parts[2]?.split('-'); // Assuming URL is /product/city-areacode-color
      if (productDetails?.length === 3) {
        return {
          city: productDetails[0],
          areacode: productDetails[1],
          color: productDetails[2]
        };
      }
    }
    return { city: '', areacode: '', color: '' }; // Return defaults or handle errors as needed
  };

  // Extract values right away
  const { city, areacode, color } = parseURL(pathname);

  const colors = [
    { name: 'black', hex: '#171b1e' },
    { name: 'blue', hex: '#19469d' },
    { name: 'green', hex: '#0b524d' },
    { name: 'orange', hex: '#eb5e24' },
    { name: 'purple', hex: '#594782' },
    { name: 'red', hex: '#c21f3d' },
    { name: 'yellow', hex: '#e4e51e' }
  ];

  const getColorHex = (colorName: string) => {
    const colorObject = colors.find((c) => c.name === colorName);
    return colorObject ? colorObject.hex : undefined;
  };

  const colorHex = getColorHex(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="grid w-full grid-cols-2 justify-between bg-white lg:grid-cols-8"
    >
      <div className="col-span-2 flex flex-row gap-2 py-4 lg:px-4 ">
        <div className="relative h-16 w-16 bg-neutral-100">
          <Image
            src={product.images[4]?.url}
            alt={product.featuredImage.altText}
            fill
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-medium text-black ">{product.title}</h1>
          <div className="mr-auto w-auto text-sm text-black">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
      </div>

      <div className="border-stone-20 col-span-2 flex items-center justify-between  border-l-[1px] px-4 py-4 lg:px-8">
        <p className="text-md text-black">Size:</p>
        <VariantSelector options={product.options} variants={product.variants} />
      </div>

      <div
        className=" border-stone-20 col-span-2 flex h-full cursor-pointer flex-row items-center justify-between gap-2 border-l-[1px] px-4 py-4 hover:bg-slate-100 lg:px-8"
        onClick={() => setOpen(true)}
      >
        <p className="text-md text-black">Color:</p>
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: colorHex }} />
          <p className="text-md capitalize text-black">{color}</p>
        </div>
      </div>

      <div className=" col-span-2 flex w-full items-center justify-center border-l-[1px] border-stone-200 px-4 py-4 lg:px-4">
        <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
      </div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative " onClose={setOpen}>
          <div className="fixed inset-0 " />

          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md ">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl ">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            Poster Color
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 grid grid-cols-2 gap-2 px-4 sm:px-6">
                        {colors.map((c) => (
                          <Link href={`/product/${city}-${areacode}-${c.name}`} key={c.name}>
                            <motion.div
                              key={c.name}
                              whileHover={{
                                scale: 0.95,
                                transition: { duration: 0.5 }
                              }}
                              style={{ backgroundColor: c.hex }}
                              className={`flex aspect-square flex-row items-end justify-between gap-2 rounded-xl p-2`}
                            >
                              <p className="text-sm capitalize text-white">{c.name}</p>
                              {c.name === color ? (
                                <CheckCircleIcon className="h-6 w-6 text-white" />
                              ) : null}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </motion.div>
  );
}
