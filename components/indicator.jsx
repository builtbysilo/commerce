import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { Fragment, useState } from 'react';
import LokalFont from '/public/LokalFont.svg';
import LokalIcon from '/public/LokalIcon.svg';
import LokalWordMark from '/public/LokalWordmark.svg';
import PosterKitschy from '/public/Poster-Kitschy.jpg';
import PosterLazy from '/public/Poster-Lazy.jpg';
import PosterMessy from '/public/Poster-Messy.jpg';

function Indicator({ x, y, ind }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      {ind.id === 2 ? (
        <Link href="/shop">
          <motion.div
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
        </Link>
      ) : (
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
      )}

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              {ind.id === 1 && <WelcomeSign setOpen={setOpen} />}
              {ind.id === 3 && <Font setOpen={setOpen} />}
              {ind.id === 4 && <PosterLayout setOpen={setOpen} />}
              {ind.id === 5 && <EverPresentBlack setOpen={setOpen} />}
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
  const [img, setImg] = useState(LokalIcon);
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
                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
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
              <div className="grid h-full grid-cols-1 gap-8 pt-8 xl:grid-cols-5">
                <div className="col-span-1 flex w-20 items-end lg:w-full">
                  <Image src={img} width={1000} height={0} alt="alt" />
                </div>
                <div className="col-span-4 flex flex-col justify-between gap-10">
                  <Image
                    src={LokalWordMark}
                    width={1400}
                    height={0}
                    alt="alt"
                    className="self-end pb-14 md:pb-0"
                  />

                  <div className="relative col-span-4">
                    <p className="columns-1 gap-4 pb-14 text-2xl sm:columns-2 md:columns-4 md:pb-0">
                      Welcome to our show room. Here you can peruse our current 6 color collection
                      of area code posters.
                      <br /> <span className="pl-24" /> This project did not begin with some
                      “accessibility driven by design & culture” mission statement, it started as a
                      scam. <br /> <span className="pl-24" /> In fall of 2023 a conversation about
                      Airbnb owners quickly furnishing their spaces with as little thought as
                      possible lead us to asking the age old entrepre neurial question “how fun
                      would it be to exploit these people?” We felt it was fun enough to entertain
                      for the rest of that afternoon. <br /> <span className="pl-24" />
                      We explored a couple directions; some{' '}
                      <span
                        className="underline"
                        onMouseOver={() => setImg(PosterMessy)}
                        onMouseLeave={() => setImg(LokalIcon)}
                      >
                        messy
                      </span>
                      , some{' '}
                      <span
                        className="underline"
                        onMouseOver={() => setImg(PosterKitschy)}
                        onMouseLeave={() => setImg(LokalIcon)}
                      >
                        kitschy
                      </span>
                      , and one that was initially just{' '}
                      <span
                        className="underline"
                        onMouseOver={() => setImg(PosterLazy)}
                        onMouseLeave={() => setImg(LokalIcon)}
                      >
                        lazy
                      </span>
                      . Despite being lazy it had a couple things going for it. It was in the inter
                      national style, making it con textually versatile, and perfect for covering a
                      wide range of cities. It used Helvetica, a font so ubiquitous and unopinion
                      ated that the only people who have strong feelings about it are other
                      designers. This lead to more thinking… “Can we make this modular?” “What about
                      procedural?” “What if we make a custom typeface?” “what if the website was
                      actually cool?” “Is Joe Biden alive?” etc. With all the mental athleticism we
                      put into this project our pitch has gone from, mindless posters for mindless
                      decorators, to something a little more accu- rate, and a little less morally
                      bankrupt: <br /> <br />{' '}
                      <span className="font-bold">
                        {' '}
                        We think a lot about what looks good on walls, so you don’t have to.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}

function Font({ setOpen }) {
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
                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
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
              <div id="Container" className="flex h-full flex-col justify-between gap-12 pt-8">
                <div className="flex justify-between pt-8 ">
                  <h2 className="text-6xl font-bold">KP Lokal</h2>
                  <p className="max-w-lg text-lg">
                    KP Lokal is a custom typeface designed by Ashton Henning. Sign up for our
                    newsletter to receive early access to beta releases throughout 2024.
                  </p>
                </div>
                <Image src={LokalFont} width={2000} height={0} alt="alt" />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}

function PosterLayout({ setOpen }) {
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
                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
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
              <div id="Container" className="flex h-full flex-col justify-between gap-12 pt-8">
                <div className="flex justify-between ">
                  <h2 className="text-6xl font-bold">Poster Layout</h2>
                  <p className="max-w-lg text-lg">xxx</p>
                </div>
                <Image src={LokalFont} width={2000} height={0} alt="alt" />
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}

function EverPresentBlack({ setOpen }) {
  const posters = [
    {
      areacode: '212',
      handle: ''
    },
    {
      areacode: '213',
      handle: ''
    },
    {
      areacode: '407',
      handle: ''
    },
    {
      areacode: '702',
      handle: ''
    },
    {
      areacode: '415',
      handle: ''
    },
    {
      areacode: '305',
      handle: ''
    },
    {
      areacode: '312',
      handle: ''
    },
    {
      areacode: '504',
      handle: ''
    },
    {
      areacode: '619',
      handle: ''
    },
    {
      areacode: '808',
      handle: ''
    },
    {
      areacode: '202',
      handle: ''
    },
    {
      areacode: '617',
      handle: ''
    },
    {
      areacode: '206',
      handle: ''
    },
    {
      areacode: '210',
      handle: ''
    },
    {
      areacode: '615',
      handle: ''
    },
    {
      areacode: '215',
      handle: ''
    },
    {
      areacode: '303',
      handle: ''
    },
    {
      areacode: '602',
      handle: ''
    },
    {
      areacode: '404',
      handle: ''
    },
    {
      areacode: '214',
      handle: ''
    }
  ];
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
          <div className="flex h-screen flex-col overflow-y-scroll bg-[#333333] pt-6 shadow-xl">
            <div className="h-[90vh] px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900"></Dialog.Title>
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
              <div id="Container" className="flex h-full flex-col justify-between gap-12 pt-8">
                <div className="flex justify-between pt-8">
                  <h2 className="text-6xl font-bold text-white">Ever-Present Black</h2>
                  <p className="max-w-lg text-lg text-white">
                    If it wasn’t clear already, we’re really into this whole versatility thing.
                    That’s why with each seasonal release of 6 new colors, black is the one we
                    always keep in stock.
                  </p>
                </div>
                <div className="flex flex-row gap-6 overflow-x-scroll">
                  {posters.map((poster, index) => (
                    <Image
                      key={index}
                      src={`/3DPosters/${poster.areacode}-K.png`}
                      width={2000}
                      height={0}
                      alt="alt"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Transition.Child>
    </div>
  );
}
