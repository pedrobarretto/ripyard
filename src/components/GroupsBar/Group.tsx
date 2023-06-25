'use client';

import { Group } from '@/interfaces';
import { ArrowForwardIcon } from '@chakra-ui/icons';

interface GroupProps {
  group: Group;
}

export function GroupComponent({ group }: GroupProps) {
  return (
    <div
      style={{
        padding: 15,
        height: 'fit-content',
        borderRadius: '10px',
        background: 'gray.phrase',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        margin: 10,
      }}
    >
      {group.name}
      <ArrowForwardIcon boxSize={6} color='gray.button' />
    </div>
  );
}
