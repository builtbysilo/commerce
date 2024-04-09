'use client';
import Poster from 'components/poster';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import indicators2 from 'utils/indicators2';

export default function Gallery({ scale }: { scale: number }) {
  //? Framer Motion
  //   const [positionX, setPositionX] = useState<number>(3);
  //   const [positionY, setPositionY] = useState<number>(55);

  const [ref, { width }] = useMeasure();

  const [constraints, setConstraints] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  useEffect(() => {
    const calculatedConstraints = {
      top: -width * 0.1,
      right: width * 0.4,
      bottom: width * 0.11,
      left: -width * 0.4
    };

    setConstraints(calculatedConstraints);
    console.log(calculatedConstraints);
  }, [width]);

  return (
    <div className="flex h-screen w-screen cursor-none items-center justify-center overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: '200%',
          y: '-60%',
          scale: scale
        }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut', type: 'tween' }}
        drag
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.5}
        dragConstraints={constraints}
        onAnimationComplete={() => {
          const calculatedConstraints = {
            top: -width * 0.1 * 5,
            right: width * 0.4 * 5,
            bottom: width * 0.1 * 5,
            left: -width * 0.4 * 5
          };

          setConstraints(calculatedConstraints);
          console.log(calculatedConstraints);
        }}
      >
        {/* <Poster x={positionX} y={positionY} poster={[]} /> */}

        {indicators2.map((poster, index) => (
          <div key={index} className="z-200">
            <Poster x={poster.x} y={poster.y} poster={poster} />
          </div>
        ))}

        <Image
          className="pointer-events-none"
          src="/LokalGallery-FINAL-Test.svg"
          width={5000}
          height={0}
          alt="Lokal Poster Gallery"
        />
      </motion.div>

      <div className="absolute bottom-10 right-[50%] z-40">
        {/* <div className="mt-2">
          <input
            type="number"
            name="positionX"
            id="positionX"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="10"
            step="0.1"
            onChange={(e) => {
              setPositionX(parseFloat(parseFloat(e.target.value).toFixed(2)));
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                setPositionX((prevState) => parseFloat((prevState + 0.1).toFixed(2)));
              } else if (e.key === 'ArrowDown') {
                setPositionX((prevState) => parseFloat((prevState - 0.1).toFixed(2)));
              }
            }}
          />

          <input
            type="number"
            name="positionY"
            id="positionY"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="10"
            step="0.1"
            onChange={(e) => {
              setPositionY(parseFloat(parseFloat(e.target.value).toFixed(2)));
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') {
                setPositionY((prevState) => parseFloat((prevState + 0.1).toFixed(2)));
              } else if (e.key === 'ArrowDown') {
                setPositionY((prevState) => parseFloat((prevState - 0.1).toFixed(2)));
              }
            }}
          />
        </div> */}
      </div>

      {/* <div id="Top Left"  className="z-200">
        <Indicator x={15} y={15} />
      </div>

      <div id="Top Right" className="z-200">
        <Indicator x={85} y={15} />
      </div>

      <div id="Bottom Right" className="z-200">
        <Indicator x={85} y={85} />
      </div>

      <div id="Bottom Left" className="z-200">
        <Indicator x={15} y={85} />
      </div> */}
    </div>
  );
}
