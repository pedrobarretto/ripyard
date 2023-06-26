'use client';
import { Box, Text } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Group } from '@/interfaces';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface GroupProps {
  group: Group;
  onClick: (group: Group) => void;
}

export function GroupComponent({ group, onClick }: GroupProps) {
  return (
    <MotionBox
      padding={15}
      height='fit-content'
      borderRadius='10px'
      background='gray.phrase'
      boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      gap={10}
      margin={10}
      onClick={() => onClick(group)}
      cursor='pointer'
      _hover={{ backgroundColor: 'gray.buttonHover' }}
      transition='background-color 0.5s ease'
      whileTap={{ scale: 0.95 }}
    >
      <Text>{group.name}</Text>
      <ArrowForwardIcon boxSize={6} color='gray.button' />
    </MotionBox>
  );
}
