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
export default function Home() {
  const containerRef = useRef(null);

  const [xPos, setXPos] = useState(-10);
  const [yPos, setYPos] = useState(-30);

  // const [xPos, setXPos] = useState(0);
  // const [yPos, setYPos] = useState(0);

  const [topLeft, setTopLeft] = useState(false);
  const [topRight, setTopRight] = useState(false);
  const [bottomLeft, setBottomLeft] = useState(false);
  const [bottomRight, setBottomRight] = useState(false);
  const [top, setTop] = useState(false);
  const [bottom, setBottom] = useState(false);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);

  const [topLeftRun, setTopLeftRun] = useState(false);
  const [topRightRun, setTopRightRun] = useState(false);
  const [bottomLeftRun, setBottomLeftRun] = useState(false);
  const [bottomRightRun, setBottomRightRun] = useState(false);

  const [topLeftRunTimer, setTopLeftRunTimer] = useState(null);
  const [topRightRunTimer, setTopRightRunTimer] = useState(null);
  const [bottomLeftRunTimer, setBottomLeftRunTimer] = useState(null);
  const [bottomRightRunTimer, setBottomRightRunTimer] = useState(null);

  const [runningWarning, setRunningWarning] = useState(0);
  const [galleryClosed, setGalleryClosed] = useState(false);

  //? Running Alert
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAlert = (position) => {
    if (runningWarning < 2) {
      setRunningWarning((r) => r + 1);
      onOpen();
    } else if (runningWarning >= 2) {
      setGalleryClosed(true);
      setRunningWarning((r) => r + 1);
      onOpen();
    } else {
      setRunningWarning(0);
      // onOpen();
    }
  };

  //? Updating Gallery Position Based on Mouse Position
  const updatePosition = () => {
    //? Setting Walk and Run Speed
    const walkSpeed = 0.3;
    const runSpeed = 0.6;
    const angle = 1.5;

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

  const mousePosition = useRef({ x: 0, y: 0 });

  const [mousePositionTrigger, setMousePositionTrigger] = useState(0);
  let lastUpdateTime = Date.now();

  //? Function to handle mouse move event
  const handleMouseMove = (e, containerRef) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };

    if (Date.now() - lastUpdateTime > 100) {
      setMousePositionTrigger((t) => t + 1);
      lastUpdateTime = Date.now();
    }

    //? Setting Walk and Run Space Size
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

  //? Watching Mouse Position and calling updatePosition
  useEffect(() => {
    let intervalId;

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

  //? Listening for Mouse Move
  useEffect(() => {
    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  //? Watching for Running in Gallery
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

  const handleSvgClick = (event, groupId) => {
    // Handle click event here
    alert('SVG Clicked');
  };

  const imageRef = useRef(null);
  const parentRef = useRef(null);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [indicatorX, setIndicatorX] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current) {
        console.log(imageRef.current.offsetWidth);
        console.log(imageRef.current.offsetHeight);
        console.log(imageRef.current.offsetWidth / 200);
        console.log(imageRef.current.offsetHeight / 100);

        setImageX(imageRef.current.offsetWidth);
        setImageY(imageRef.current.offsetHeight);
        setIndicatorX(imageRef.current.offsetWidth / 200);
        setIndicatorY(imageRef.current.offsetHeight / 100);
      }
    };

    // Call handleResize initially to set the initial state based on the current window size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaleValue = useBreakpointValue({ base: '14', sm: '5', md: '4', lg: '4.5' });

  return (
    <>
      <Flex
        ref={containerRef}
        onMouseMove={handleMouseMove}
        w="100vw" // Set the container's width to 100% of the viewport
        h="100vh" // Set the container's height to 100% of the viewport
        overflow="hidden"
        justifyContent="center"
        alignItems="center"
        flexDirection={'column'}
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
            top: `${yPos}%`, // Adjust these values to position the image
            left: `${xPos}%`, // Adjust these values to position the image
            transform: `scale(${scaleValue})`,
            objectFit: 'contain',
            transformOrigin: 'left center' // Setting the origin for scale
          }}
        >
          <Image
            // ref={imageRef}
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
            transformOrigin: 'left center' // Setting the origin for scale
          }}
        />
      </Flex>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent="center" alignItems="center">
            {runningWarning == 1 ? (
              <Heading size="sm" color="black">
                NO RUNNING IN THE GALLERY
              </Heading>
            ) : null}
            {runningWarning == 2 ? (
              <Heading size="sm" color="black">
                WE WILL NOT WARN YOU AGAIN
              </Heading>
            ) : null}
            {runningWarning == 3 ? (
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
