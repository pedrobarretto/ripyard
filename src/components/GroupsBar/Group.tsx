'use client';
import { Box, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { ArrowForwardIcon, DeleteIcon } from '@chakra-ui/icons';
import { Group } from '@/interfaces';
import { motion } from 'framer-motion';
import { DeleteGroupModal } from './DeleteGroupModal';
import { useUser } from '@/store';

const MotionBox = motion(Box);

interface GroupProps {
  group: Group;
  onClick: (group: Group) => void;
  isEditMode: boolean;
  setLocalGroups: (groups: Group[]) => void;
  setSelectedGroup: (group: Group) => void;
}

export function GroupComponent({
  group,
  onClick,
  isEditMode,
  setLocalGroups,
  setSelectedGroup,
}: GroupProps) {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const { user } = useUser();

  const clickableProps = isEditMode
    ? {
        cursor: 'blocked',
      }
    : {
        onClick: () => group && onClick(group),
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
      {isEditMode && group.ownerEmail === user.email ? (
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

      <DeleteGroupModal
        group={group}
        isOpen={isOpen}
        onClose={onClose}
        setLocalGroups={setLocalGroups}
        setSelectedGroup={setSelectedGroup}
      />
    </MotionBox>
  );
}
