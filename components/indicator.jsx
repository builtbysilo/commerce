import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';

function Indicator({ x, y, ind }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <motion.div
        onClick={() => setOpen(true)}
        className="absolute z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-2 border-black"
        style={{
          top: `${y}%`,
          left: `${x}%`,
          scale: 0.15,
          transformOrigin: 'top left'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black">
          <motion.div
            initial={{ width: '10px', height: '10px' }}
            animate={{ width: '20px', height: '20px' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="cursor-pointer rounded-full bg-white"
          />
        </div>
      </motion.div>

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              {ind.id === 1 && <WelcomeSign setOpen={setOpen} />}
              {ind.id === 2 && <WelcomeSign setOpen={setOpen} />}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default React.memo(Indicator, (prevProps, nextProps) => {
  return prevProps.x === nextProps.x && prevProps.y === nextProps.y;
});

function WelcomeSign({ setOpen }) {
  const isSmallScreen = window.innerWidth < 640; // sm breakpoint
  const isMediumScreen = window.innerWidth >= 640 && window.innerWidth < 768; // md breakpoint

  const columnStyle = {
    columnGap: '1rem',
    columnCount: isSmallScreen ? 1 : isMediumScreen ? 2 : 4
  };

  return (
    <div
      id="Container"
      className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 "
    >
      <Transition.Child
        as={Fragment}
        enter="transform transition ease-in-out duration-500 sm:duration-700"
        enterFrom="translate-y-full"
        enterTo="translate-y-0"
        leave="transform transition ease-in-out duration-500 sm:duration-700"
        leaveFrom="translate-y-0"
        leaveTo="translate-y-full"
      >
        <Dialog.Panel className="pointer-events-auto w-screen">
          <div className="flex h-screen flex-col overflow-y-scroll bg-white pt-6 shadow-xl">
            <div className="h-[90vh] px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                  Indicator
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
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-5">
                <div className="col-span-1">
                  <Image src="/GalleryPosters/702-O.svg" width={1000} height={0} alt="alt" />
                </div>
                <div style={columnStyle} className="col-span-4">
                  <p className="text-lg">
                    Welcome to our show room. Here you can peruse our current 6 color collection of
                    area code posters. This project did not begin with some “accessibility driven by
                    design & culture” mission statement, it started as a scam. In fall of 2023 a
                    conversation about Airbnb owners quickly furnishing their spaces with as little
                    thought as possible lead us to asking the age old entrepre neurial question “how
                    fun would it be to exploit these people?” We felt it was fun enough to entertain
                    for the rest of that afternoon. We explored a couple directions; some messy,
                    some kitschy, and one that was initially just lazy. Despite being lazy it had a
                    couple things going for it. It was in the inter national style, making it con
                    textually versatile, and perfect for covering a wide range of cities. It used
                    Helvetica, a font so ubiquitous and unopinion ated that the only people who have
                    strong feelings about it are other designers. This lead to more thinking… “Can
                    we make this modular?” “What about procedural?” “What if we make a custom
                    typeface?” “what if the website was actually cool?” “Is Joe Biden alive?” etc.
                    With all the mental athleticism we put into this project our pitch has gone
                    from, mindless posters for mindless decorators, to something a little more accu-
                    rate, and a little less morally bankrupt: We think a lot about what looks good
                    on walls, so you don’t have to.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}
