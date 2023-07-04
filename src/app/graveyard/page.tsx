'use client';
import { GroupsBar, MessagesContainer } from '@/components';
import { Box } from '@chakra-ui/react';

export default function Graveyard() {
  return (
    <Box margin={4}>
      <GroupsBar />
      <MessagesContainer />
    </Box>
  );
}
