'use client';
import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Indicator2 from '/components/Indicator2';
import indicators2 from '/utils/indicators2';

interface MousePosition {
  x: number;
  y: number;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [xPos, setXPos] = useState<number>(-10);
  const [yPos, setYPos] = useState<number>(-30);

  const [topLeft, setTopLeft] = useState<boolean>(false);
  const [topRight, setTopRight] = useState<boolean>(false);
  const [bottomLeft, setBottomLeft] = useState<boolean>(false);
  const [bottomRight, setBottomRight] = useState<boolean>(false);
  const [top, setTop] = useState<boolean>(false);
  const [bottom, setBottom] = useState<boolean>(false);
  const [left, setLeft] = useState<boolean>(false);
  const [right, setRight] = useState<boolean>(false);

  const [topLeftRun, setTopLeftRun] = useState<boolean>(false);
  const [topRightRun, setTopRightRun] = useState<boolean>(false);
  const [bottomLeftRun, setBottomLeftRun] = useState<boolean>(false);
  const [bottomRightRun, setBottomRightRun] = useState<boolean>(false);

  const [topLeftRunTimer, setTopLeftRunTimer] = useState<NodeJS.Timeout | null>(null);
  const [topRightRunTimer, setTopRightRunTimer] = useState<NodeJS.Timeout | null>(null);
  const [bottomLeftRunTimer, setBottomLeftRunTimer] = useState<NodeJS.Timeout | null>(null);
  const [bottomRightRunTimer, setBottomRightRunTimer] = useState<NodeJS.Timeout | null>(null);

  const [runningWarning, setRunningWarning] = useState<number>(0);
  const [galleryClosed, setGalleryClosed] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAlert = (position: string) => {
    if (runningWarning < 2) {
      setRunningWarning((r) => r + 1);
      onOpen();
    } else if (runningWarning >= 2) {
      setGalleryClosed(true);
      setRunningWarning((r) => r + 1);
      onOpen();
    } else {
      setRunningWarning(0);
    }
  };

  const updatePosition = () => {
    const walkSpeed = 0.3;
    const runSpeed = 0.6;

    if (topLeft && topLeftRun) {
      setXPos((x) => x + runSpeed);
      setYPos((y) => y + runSpeed);
    } else if (topLeft) {
      setXPos((x) => x + walkSpeed);
      setYPos((y) => y + walkSpeed);
    }
    if (topRight && topRightRun) {
      setXPos((x) => x - runSpeed);
      setYPos((y) => y + runSpeed);
    } else if (topRight) {
      setXPos((x) => x - walkSpeed);
      setYPos((y) => y + walkSpeed);
    }
    if (bottomRight && bottomRightRun) {
      setXPos((x) => x - runSpeed);
      setYPos((y) => y - runSpeed);
    } else if (bottomRight) {
      setXPos((x) => x - walkSpeed);
      setYPos((y) => y - walkSpeed);
    }
    if (bottomLeft && bottomLeftRun) {
      setXPos((x) => x + runSpeed);
      setYPos((y) => y - runSpeed);
    } else if (bottomLeft) {
      setXPos((x) => x + walkSpeed);
      setYPos((y) => y - walkSpeed);
    }
  };

  const mousePosition = useRef<MousePosition>({ x: 0, y: 0 });

  const [mousePositionTrigger, setMousePositionTrigger] = useState<number>(0);
  let lastUpdateTime = Date.now();

  const handleMouseMove = (e: MouseEvent) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };

    if (Date.now() - lastUpdateTime > 100) {
      setMousePositionTrigger((t) => t + 1);
      lastUpdateTime = Date.now();
    }

    const walkSpaceSize = window.innerWidth / 6;
    const runSpaceSize = walkSpaceSize / 10;

    setTopLeft(e.clientX <= walkSpaceSize && e.clientY <= walkSpaceSize);
    setTopRight(e.clientX >= window.innerWidth - walkSpaceSize && e.clientY <= walkSpaceSize);
    setBottomLeft(e.clientX <= walkSpaceSize && e.clientY >= window.innerHeight - walkSpaceSize);
    setBottomRight(
      e.clientX >= window.innerWidth - walkSpaceSize &&
        e.clientY >= window.innerHeight - walkSpaceSize
    );

    setTopLeftRun(e.clientX <= runSpaceSize && e.clientY <= walkSpaceSize / 4);
    setTopRightRun(e.clientX >= window.innerWidth - runSpaceSize && e.clientY <= runSpaceSize);
    setBottomLeftRun(e.clientX <= runSpaceSize && e.clientY >= window.innerHeight - runSpaceSize);
    setBottomRightRun(
      e.clientX >= window.innerWidth - runSpaceSize &&
        e.clientY >= window.innerHeight - runSpaceSize
    );
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (topLeft || topRight || bottomLeft || bottomRight) {
      intervalId = setInterval(updatePosition, 10);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    topLeft,
    topLeftRun,
    topRight,
    topRightRun,
    bottomLeft,
    bottomLeftRun,
    bottomRight,
    bottomRightRun
  ]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (topLeftRun) {
      const timer = setTimeout(() => handleAlert('Top Left'), 1250);
      setTopLeftRunTimer(timer);
    } else if (topLeftRunTimer) {
      clearTimeout(topLeftRunTimer);
      setTopLeftRunTimer(null);
    }

    if (topRightRun) {
      const timer = setTimeout(() => handleAlert('Top Right'), 1250);
      setTopRightRunTimer(timer);
    } else if (topRightRunTimer) {
      clearTimeout(topRightRunTimer);
      setTopRightRunTimer(null);
    }

    if (bottomLeftRun) {
      const timer = setTimeout(() => handleAlert('Bottom Left'), 1250);
      setBottomLeftRunTimer(timer);
    } else if (bottomLeftRunTimer) {
      clearTimeout(bottomLeftRunTimer);
      setBottomLeftRunTimer(null);
    }

    if (bottomRightRun) {
      const timer = setTimeout(() => handleAlert('Bottom Right'), 1250);
      setBottomRightRunTimer(timer);
    } else if (bottomRightRunTimer) {
      clearTimeout(bottomRightRunTimer);
      setBottomRightRunTimer(null);
    }
  }, [topLeftRun, topRightRun, bottomLeftRun, bottomRightRun]);

  const imageRef = useRef<HTMLImageElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(4.5);
  const [imageX, setImageX] = useState<number>(0);
  const [imageY, setImageY] = useState<number>(0);
  const [indicatorX, setIndicatorX] = useState<number>(0);
  const [indicatorY, setIndicatorY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      // Debugging - make sure this logs when you scroll
      console.log('Scrolling...');

      const scrollY = window.scrollY;
      const newScale = 4.5 + (scrollY / (window.innerHeight * 0.5)) * 3.5; // Adjust for a more noticeable effect

      // Ensure scale is between 4.5 and 8
      const clampedScale = Math.min(Math.max(newScale, 4.5), 8);
      setScale(clampedScale);

      // Debugging - log the new scale
      console.log('New Scale:', clampedScale);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scaleValue = useBreakpointValue({ base: '14', sm: '5', md: '4', lg: '4.5' });

  return (
    <>
      <Flex
        ref={containerRef}
        onMouseMove={handleMouseMove as any}
        w="100vw"
        h="100vh"
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        position="relative"
      >
        <Flex
          p="0"
          m="0"
          ref={parentRef}
          w="100%"
          h="fit-content"
          position="relative"
          style={{
            zIndex: '2',
            top: `${yPos}%`,
            left: `${xPos}%`,
            transform: `scale(${scale})`,
            objectFit: 'contain',
            transformOrigin: 'left center'
          }}
        >
          <Image
            src="/LokalGallery3.svg"
            priority={true}
            width={5000}
            height={0}
            alt="Lokal Poster Gallery"
          />
          {indicators2.map((ind, index) => (
            <Indicator2
              key={index}
              x={ind.x * indicatorX}
              y={ind.y * indicatorY}
              city={ind.city}
              angle={ind.angle}
              indicatorX={indicatorX}
              indicatorY={indicatorY}
            />
          ))}
        </Flex>

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
      </Flex>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent="center" alignItems="center">
            {runningWarning === 1 ? (
              <Heading size="sm" color="black">
                NO RUNNING IN THE GALLERY
              </Heading>
            ) : null}
            {runningWarning === 2 ? (
              <Heading size="sm" color="black">
                WE WILL NOT WARN YOU AGAIN
              </Heading>
            ) : null}
            {runningWarning === 3 ? (
              <Heading size="sm" color="black">
                THE GALLERY IS NOW CLOSED DUE TO YOUR ACTIONS
              </Heading>
            ) : null}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
