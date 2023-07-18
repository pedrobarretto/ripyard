'use client';
import { GroupsBar, MessagesContainer } from '@/components';
import { Box } from '@chakra-ui/react';

export default function Graveyard() {
  return (
    <Box margin={3}>
      <GroupsBar />
      <MessagesContainer />
    </Box>
  );
}
