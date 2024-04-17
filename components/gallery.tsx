'use client';
import Indicator from 'components/indicator';
import Poster from 'components/poster';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import indicators from 'utils/indicators';
import indicators2 from 'utils/indicators2';
import LokalGallery from '/public/LokalGallery-FINAL.svg';
export default function Gallery({
  scale,
  topCon,
  bottomCon,
  leftCon,
  rightCon,
  startX,
  startY
}: {
  scale: number;
  topCon: number;
  bottomCon: number;
  leftCon: number;
  rightCon: number;
  startX: string;
  startY: string;
}) {
  //? Framer Motion
  const [positionX, setPositionX] = useState<number>(3);
  const [positionY, setPositionY] = useState<number>(55);

  const [ref, { width }] = useMeasure();

  const [constraints, setConstraints] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  useEffect(() => {
    const calculatedConstraints = {
      top: -width * topCon,
      right: width * rightCon,
      bottom: width * bottomCon,
      left: -width * leftCon
    };

    setConstraints(calculatedConstraints);
    console.log(calculatedConstraints);
  }, [width, topCon, bottomCon, leftCon, rightCon]);

  return (
    <div className="flex h-screen w-screen cursor-none items-center justify-center overflow-hidden">
      <motion.div
        className="bg-[#333333]"
        ref={ref}
        initial={{ x: 0, y: 0, scale: 1 }}
        animate={{
          x: startX,
          y: startY,
          scale: scale
        }}
        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut', type: 'tween' }}
        drag
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        dragElastic={0.5}
        dragConstraints={constraints}
        onAnimationComplete={() => {
          const calculatedConstraints = {
            top: -width * topCon * scale,
            right: width * rightCon * scale,
            bottom: width * bottomCon * scale,
            left: -width * leftCon * scale
          };

          setConstraints(calculatedConstraints);
        }}
      >
        {/* <Poster x={positionX} y={positionY} poster={{ areacode: '214', color: 'R' }} /> */}

        {indicators2.map((poster, index) => (
          <div key={index} className="z-200">
            <Poster x={poster.x} y={poster.y} poster={poster} />
          </div>
        ))}

        {indicators.map((ind, index) => (
          <div key={index} className="z-200">
            <Indicator x={ind.x} y={ind.y} ind={ind} />
          </div>
        ))}

        <Image
          className="pointer-events-none"
          src={LokalGallery}
          width={5000}
          height={0}
          alt="Lokal Poster Gallery"
        />
      </motion.div>

      {/* <div className="absolute bottom-10 right-[50%] z-40">
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
      </div> */}
    </div>
  );
}
