import { Flex } from '@chakra-ui/react';

import React from 'react';

function Indicator3({ x, y, indicatorY }) {
  return (
    <>
      <Flex
        borderRadius="10px"
        border="2px solid blue"
        position="absolute"
        top={`${y}%`}
        left={`${x}%`}
        w="20px"
        h={`${indicatorY * 3.2}px`}
        justifyContent="center"
        alignItems="center"
        zIndex="1000"
        cursor="pointer"
        style={{
          scale: 0.7,
          transformOrigin: 'top left'
        }}
      ></Flex>
    </>
  );
}

export default React.memo(Indicator3, (prevProps, nextProps) => {
  return prevProps.x === nextProps.x && prevProps.y === nextProps.y;
});
