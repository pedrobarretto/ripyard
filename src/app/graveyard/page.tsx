'use client';
import { GroupsBar, MessagesContainer } from '@/components';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';

export default function Graveyard() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex pt={10} direction={'row'} align={'center'} justify={'center'}>
      <GroupsBar isOpenDrawer={isOpen} onCloseDrawer={onClose} />
      <MessagesContainer />
      <Button onClick={onOpen}>Abrir</Button>
    </Flex>
  );
}
