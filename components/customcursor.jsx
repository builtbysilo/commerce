'use client';
import { motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  useEffect(() => {
    // Store the current scale

    const initialX = window.innerWidth / 2 - cursorRef.current.clientWidth / 2;
    const initialY = window.innerHeight / 2 - cursorRef.current.clientHeight / 2;

    cursorX.set(initialX);
    cursorY.set(initialY);
    let currentScale = 1;

    const handleMouseMove = (event) => {
      if (cursorRef.current) {
        const { clientX, clientY } = event;
        const x = clientX - cursorRef.current.clientWidth / 2;
        const y = clientY - cursorRef.current.clientHeight / 2;
        // Apply both the translation and the current scale
        cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${currentScale})`;
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        currentScale = 0.5;
        cursorRef.current.style.transform = cursorRef.current.style.transform.replace(
          /scale\(.*?\)/,
          `scale(${currentScale})`
        );
      }
    };

    const handleMouseUp = () => {
      if (cursorRef.current) {
        currentScale = 1;
        cursorRef.current.style.transform = cursorRef.current.style.transform.replace(
          /scale\(.*?\)/,
          `scale(${currentScale})`
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]); // Ensure this effect runs only once

  return (
    <motion.div
      ref={cursorRef}
      style={{ x: cursorX, y: cursorY }}
      initial={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 5, damping: 100 }}
      className="skew-y-40 pointer-events-none fixed z-50 h-12 w-12 transform rounded-full border-2 border-black bg-transparent transition-transform duration-200 ease-out"
    />
  );
};

export default CustomCursor;
