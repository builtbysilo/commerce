import { Flex } from '@chakra-ui/react';

import React from 'react';

import { motion } from 'framer-motion';

function Indicator({ x, y }) {
  const MotionFlex = motion(Flex);

  return (
    <>
      <Flex
        borderRadius="50px"
        border="2px solid black"
        position="absolute"
        top={`${y}%`}
        left={`${x}%`}
        w="50px"
        h="50px"
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
        cursor="pointer"
        style={{
          scale: 0.7,
          transformOrigin: 'top left'
        }}
      >
        <Flex
          borderRadius="50px"
          w="30px"
          h="30px"
          bgColor="black"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
        >
          <MotionFlex
            initial={{ width: '10px', height: '10px' }}
            animate={{ width: '20px', height: '20px' }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            borderRadius="50px"
            bgColor="white"
            cursor="pointer"
          />
        </Flex>
      </Flex>
    </>
  );
}

export default React.memo(Indicator, (prevProps, nextProps) => {
  return prevProps.x === nextProps.x && prevProps.y === nextProps.y;
});
