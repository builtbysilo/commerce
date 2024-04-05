import { Transition } from '@headlessui/react';
import Image from 'next/image';
import { useState } from 'react';

export default function Indicator2({ x, y, city, angle, indicatorX, indicatorY, drawer, test }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`flex ${test ? 'border-red-500' : 'border-blue-500'} border-0.5`}
        style={{
          width: `${indicatorY * 2}px`,
          height: `${indicatorY * 3.2}px`,
          borderRadius: '0.125rem',
          position: 'absolute',
          top: `${y}px`,
          left: `${x}px`,
          transform: `skew(0deg, ${angle}deg)`,
          filter: 'blur(0.5px)',
          cursor: drawer ? 'pointer' : 'default'
        }}
        onClick={toggleDrawer}
      />

      <Transition show={isOpen} as="div">
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative flex h-full flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
                  <h2 className="text-lg font-medium">{city}</h2>
                  <button
                    type="button"
                    className="text-gray-500 hover:text-gray-700"
                    onClick={toggleDrawer}
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-grow p-4">
                  <Image src="/214-Edge.jpg" width={1000} height={0} alt="214 Edge" />
                  <Image src="/214-Scatter.jpg" width={1000} height={0} alt="214 Edge" />
                  <Image src="/214-Wave.jpg" width={1000} height={0} alt="214 Edge" />
                  <Image src="/214-Wall.jpg" width={1000} height={0} alt="214 Edge" />
                </div>
                <div className="bg-gray-100 px-4 py-3">
                  <p className="text-sm text-gray-500">This is the end of the page</p>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </>
  );
}
