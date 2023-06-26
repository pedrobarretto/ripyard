'use client';
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useGroups } from '@/store';
import { doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export function MessagesContainer() {
  const [message, setMessage] = useState('');
  const { selectedGroup } = useGroups();

  const handleSendMessage = async () => {};

  return (
    <div
      style={{
        width: '970px',
        height: '846px',
        flexShrink: '0',
        borderRadius: '10px',
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>{/* Mensagens vão ficar aqui */}</div>
      <InputGroup size='md'>
        <Input
          backgroundColor='gray.input'
          variant='filled'
          pr='4.5rem'
          type='text'
          placeholder='Escreva sua frase aqui!'
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <InputRightElement width='4.5rem'>
          <Button h='1.75rem' size='sm' onClick={handleSendMessage}>
            <ArrowRightIcon color='gray.button' />
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
}
