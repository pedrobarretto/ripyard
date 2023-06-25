'use client';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { Text } from '@chakra-ui/react';

interface NoneDataProps {
  text: string;
}

export function NoneData({ text }: NoneDataProps) {
  return (
    <>
      <div
        style={{
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          flexGrow: 1,
          overflowWrap: 'break-word',
          wordWrap: 'break-word',
          hyphens: 'auto',
        }}
      >
        <InfoOutlineIcon boxSize={6} color='gray.button' />
        <Text
          noOfLines={[1, 2, 3]}
          fontSize={['2sm', '3sm', '4sm']}
          color='gray.text'
          textAlign='center'
          mt={4}
        >
          {text}
        </Text>
      </div>
    </>
  );
}
