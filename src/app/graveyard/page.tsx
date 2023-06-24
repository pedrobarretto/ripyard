'use client';
import { GroupsBar, MessagesContainer } from '@/components';
import { Flex } from '@chakra-ui/react';

export default function Graveyard() {
  return (
    <Flex pt={10} direction={'row'} align={'center'} justify={'center'}>
      <GroupsBar />
      <MessagesContainer />
    </Flex>
  );
}
