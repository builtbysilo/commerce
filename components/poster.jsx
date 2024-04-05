import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useState } from 'react';

export default function Poster({ x, y, poster }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        className="absolute cursor-pointer"
        style={{ top: `${y}%`, left: `${x}%`, width: `0.8%`, height: `4%` }}
        whileHover={{
          y: -2,
          transition: { duration: 0.2, ease: 'easeOut' }
        }}
        onClick={() => setOpen(true)}
      >
        <Image
          priority={true}
          src="/GalleryPosters/702-O.svg"
          fill={true}
          style={{ objectFit: 'contain' }}
          alt="alt"
        />
      </motion.div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 md:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-4xl">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            {poster.city} - {poster.handle}
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
                      <div className="mt-6 flex w-full p-4 sm:p-6">
                        <div className="flex w-2/3 flex-col justify-between">
                          <div className="flex flex-row items-center justify-between">
                            <div className="w-1/2">
                              <p className="text-xl text-gray-900">12.1234 NT</p>
                            </div>
                            <div className="w-1/2">
                              <p className="text-xl text-gray-900">43.4321 W</p>
                            </div>
                          </div>
                          <p className="text-6xl text-gray-900">{poster.city}</p>
                        </div>
                        <div className="flex w-1/3 flex-col gap-4">
                          <div className="flex flex-col">
                            <p className="text-lg font-bold text-gray-900">Area:</p>
                            <p className="text-xl text-gray-900">123.4 sq Miles</p>
                          </div>
                          <div className="flex flex-col">
                            <p className="text-lg font-bold text-gray-900">Population:</p>
                            <p className="text-xl text-gray-900">1,234,232</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <Image
                          src="/214-Edge.jpg"
                          alt={`${poster.city} - Color`}
                          width={1000}
                          height={0}
                        />
                        <Image
                          src="/214-Scatter.jpg"
                          alt={`${poster.city} - Color`}
                          width={1000}
                          height={0}
                        />
                        <Image
                          src="/214-Wall.jpg"
                          alt={`${poster.city} - Color`}
                          width={1000}
                          height={0}
                        />
                        <Image
                          src="/214-Wave.jpg"
                          alt={`${poster.city} - Color`}
                          width={1000}
                          height={0}
                        />
                      </div>
                      <Link href={`/product/${poster.handle}`}>
                        <div className="absolute bottom-0 flex h-24 w-full flex-col items-center justify-center rounded-lg bg-black">
                          <p className="text-lg text-white">Shop Poster</p>
                        </div>
                      </Link>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
