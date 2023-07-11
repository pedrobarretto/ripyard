'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useGroups, useUser } from '@/store';
import { Timestamp } from 'firebase/firestore';
import { rtdb } from '@/config/firebase';
import { Message } from '@/interfaces';
import { Phrase } from '..';
import { onValue, push, ref, set } from 'firebase/database';
import { v4 as uuid } from 'uuid';

export function MessagesContainer() {
  const [msg, setMsg] = useState('');
  const { selectedGroup } = useGroups();
  const { user } = useUser();
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      const msgsRef = ref(rtdb, `${selectedGroup.groupId}/`);
      onValue(msgsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setFilteredMessages(Object.values(data));
        } else {
          setFilteredMessages([]);
        }
      });
    } else {
      setFilteredMessages([]);
    }
  }, [selectedGroup]);

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const messageRef = ref(rtdb, `${selectedGroup.groupId}/`);
      const newMessageRef = push(messageRef);
      const newMessage: Message = {
        message: msg,
        author: user.username,
        authorEmail: user.email,
        groupId: selectedGroup.groupId,
        createdAt: Timestamp.fromDate(new Date()),
        messageId: newMessageRef.key || 'none',
        reactions: [],
      };
      await set(newMessageRef, newMessage);
      setMsg('');
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '90vh',
        flexShrink: '0',
        borderRadius: '10px',
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 0,
      }}
    >
      <Stack
        direction='column'
        height='846px'
        overflowY='scroll'
        borderRadius='md'
        p={4}
      >
        {filteredMessages.length === 0 ? (
          <Text>Não há frases neste grupo.</Text>
        ) : (
          filteredMessages.map((message) => (
            <Phrase
              img={'/ripyard-logo.png'}
              isFromUser={message.author === user.username}
              message={message}
              key={message.messageId} // Make sure each message has a unique key
            />
          ))
        )}
      </Stack>
      <InputGroup size='md'>
        <Input
          backgroundColor='gray.input'
          variant='filled'
          pr='4.5rem'
          type='text'
          placeholder='Escreva sua frase aqui!'
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
          isDisabled={selectedGroup?.groupId === undefined}
        />
        <InputRightElement width='4.5rem'>
          <Button
            isDisabled={
              selectedGroup?.groupId === undefined || msg.length === 0
            }
            h='1.75rem'
            size='sm'
            onClick={handleSendMessage}
          >
            {isLoading ? (
              <Spinner size={'md'} />
            ) : (
              <ArrowRightIcon color='gray.button' />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
}
