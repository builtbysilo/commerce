'use client';
import Poster from 'components/Poster';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import indicators2 from 'utils/indicators2';

export default function Home() {
  //? Framer Motion
  const galleryPositionControls = useAnimation();
  const [positionX, setPositionX] = useState<number>(3);
  const [positionY, setPositionY] = useState<number>(55);

  const [indicatorX, setIndicatorX] = useState<number>(0);
  const [indicatorY, setIndicatorY] = useState<number>(0);
  const [posterWidth, setPosterWidth] = useState<number>(0);
  const [posterHeight, setPosterHeight] = useState<number>(0);

  const [ref, { width }] = useMeasure();

  useEffect(() => {
    setIndicatorX(width / 200);
    setIndicatorY(width / 100);
  }, [width]);

  interface IndicatorType {
    id: number;
    x: number;
    y: number;
    poster: object;
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden">
      <motion.div
        ref={ref}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{ x: 3000, y: 0, scale: 5 }}
        transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
        drag
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.5}
        whileTap={{ cursor: 'grabbing' }}
        dragConstraints={{
          top: -800,
          right: 4000,
          bottom: 1100,
          left: -4000
        }}
      >
        <Poster x={positionX} y={positionY} poster={[]} />

        {indicators2.map((poster: IndicatorType, index: number) => (
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
        <div className="mt-2">
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
        </div>
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
