'use client';
import Indicator from 'components/Indicator';
import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  //? Framer Motion
  const galleryPositionControls = useAnimation();

  // Define your initial positions
  const initialX = 195; // for example
  const initialY = -65; // for example

  const handleMoveClick = (x: number, y: number) => {
    galleryPositionControls.start({
      x: `${x}%`,
      y: `${y}%`
    });
  };

  const imageRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(5);
  const [imageX, setImageX] = useState<number>(0);
  const [imageY, setImageY] = useState<number>(0);
  const [indicatorX, setIndicatorX] = useState<number>(0);
  const [indicatorY, setIndicatorY] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        setImageX(imageRef.current.offsetWidth);
        setImageY(imageRef.current.offsetHeight);
        setIndicatorX(imageRef.current.offsetWidth / 200);
        setIndicatorY(imageRef.current.offsetHeight / 100);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (imageRef.current) {
      setImageX(imageRef.current.offsetWidth);
      setImageY(imageRef.current.offsetHeight);
      setIndicatorX(imageRef.current.offsetWidth / 200);
      setIndicatorY(imageRef.current.offsetHeight / 100);
    }
  }, []);

  // const scaleValue = useBreakpointValue({ base: '14', sm: '5', md: '4', lg: '4.5' });

  interface IndicatorType {
    id: number;
    x: number;
    y: number;
    city: string;
    angle: number;
    indicatorX: number;
    indicatorY: number;
    drawer: boolean;
    test: boolean;
  }

  const [valueX, setValueX] = useState<number>(4);
  const [valueY, setValueY] = useState<number>(55);

  const handleChangeX = (valueAsString: string, valueAsNumber: number) => setValueX(valueAsNumber);
  const handleChangeY = (valueAsString: string, valueAsNumber: number) => setValueY(valueAsNumber);
  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
      <motion.div
        animate={galleryPositionControls}
        transition={{ ease: 'linear', duration: 1 }}
        className="h-fit-content relative m-0 w-full overflow-hidden p-0"
        style={{
          scale: scale,
          zIndex: '2',
          objectFit: 'contain',
          transformOrigin: 'center center',
          x: `${initialX}%`,
          y: `${initialY}%`
        }}
      >
        <Image
          src="/LokalGallery-FINAL.svg"
          priority={true}
          width={5000}
          height={0}
          alt="Lokal Poster Gallery"
        />
        {/* {indicators2.map((ind: IndicatorType, index: number) => (
          <Indicator2
            key={index}
            x={ind.x * indicatorX}
            y={ind.y * indicatorY}
            city={ind.city}
            angle={ind.angle}
            indicatorX={indicatorX}
            indicatorY={indicatorY}
            drawer={ind.drawer}
            test={false}
          />
        ))} */}

        {/* <Indicator2
          x={valueX * indicatorX}
          y={valueY * indicatorY}
          city={'Test'}
          angle={-30}
          indicatorX={indicatorX}
          indicatorY={indicatorY}
          drawer={true}
          test={true}
        />

        <Link href="/shop" className="flex items-center justify-center">
          <Indicator2
            x={15 * indicatorX}
            y={66 * indicatorY}
            city=""
            angle="0"
            indicatorX={indicatorX}
            indicatorY={indicatorY}
            drawer={false}
            test={false}
          />
        </Link> */}
      </motion.div>

      <div id="Top Left" onClick={() => handleMoveClick(160, 20)} className="z-200">
        <Indicator x={15} y={15} />
      </div>

      <div id="Top Right" onClick={() => handleMoveClick(120, 40)} className="z-200">
        <Indicator x={85} y={15} />
      </div>

      <div id="Bottom Right" onClick={() => handleMoveClick(160, 0)} className="z-200">
        <Indicator x={85} y={85} />
      </div>

      <div id="Bottom Left" onClick={() => handleMoveClick(-205, 120)} className="z-200">
        <Indicator x={15} y={85} />
      </div>

      <Image
        ref={imageRef}
        src="/GallerySize.svg"
        priority={true}
        width={5000}
        height={0}
        alt="Lokal Poster Gallery"
        style={{
          position: 'absolute',
          zIndex: '1',
          opacity: '0',
          objectFit: 'contain',
          transformOrigin: 'left center'
        }}
      />
    </div>
  );
}
