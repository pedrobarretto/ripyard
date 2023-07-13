'use client';
import {
  Box,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
import { Group } from '@/interfaces';
import { motion } from 'framer-motion';
import { DeleteGroupModal } from './DeleteGroupModal';

const MotionBox = motion(Box);

interface GroupProps {
  group: Group;
  onClick: (group: Group) => void;
  isEditMode: boolean;
}

export function GroupComponent({ group, onClick, isEditMode }: GroupProps) {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const toast = useToast();

  const clickableProps = isEditMode
    ? {
        cursor: 'blocked',
      }
    : {
        onClick: () => onClick(group),
        cursor: 'pointer',
        _hover: { backgroundColor: 'gray.buttonHover' },
        transition: 'background-color 0.5s ease',
        whileTap: { scale: 0.95 },
      };

  return (
    <MotionBox
      padding={isEditMode ? 3 : 15}
      height='fit-content'
      borderRadius='10px'
      background='gray.phrase'
      boxShadow='0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      marginLeft={2}
      marginRight={2}
      {...clickableProps}
    >
      <Text>{group.name}</Text>
      {isEditMode ? (
        <IconButton
          icon={<DeleteIcon boxSize={6} color='red.reject' />}
          aria-label='Trash Can'
          size='sm'
          background={'#fff'}
          _hover={{ backgroundColor: 'gray.button' }}
          onClick={onOpen}
        />
      ) : (
        <ArrowForwardIcon boxSize={6} color='gray.button' />
      )}

      <DeleteGroupModal group={group} isOpen={isOpen} onClose={onClose} />
    </MotionBox>
  );
}
