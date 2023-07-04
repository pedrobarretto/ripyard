'use client';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Stack,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useGroups, useMessages, useUser } from '@/store';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Message, MessagesContext } from '@/interfaces';
import { Phrase } from '..';

export function MessagesContainer() {
  const [msg, setMsg] = useState('');
  const { selectedGroup } = useGroups();
  const { user } = useUser();
  const { messages, setMessages, rawMessages, setRawMessages } = useMessages();
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedGroup) {
      const filteredMsgs = rawMessages.filter(
        (msg) => msg.groupId === selectedGroup.groupId
      );
      if (filteredMsgs) {
        setFilteredMessages(filteredMsgs);
      } else {
        setFilteredMessages([]);
      }
    } else {
      setFilteredMessages([]);
    }
  }, [selectedGroup, messages]);

  const mountMessage = (): MessagesContext[] => {
    const filteredMsgs = messages.filter(
      (x) => x.groupId === selectedGroup.groupId
    );
    const updatedContext = {
      groupId: selectedGroup.groupId,
      messages: [] as Message[],
    };

    filteredMsgs.forEach((msg) => {
      updatedContext.messages.push(...msg.messages);
    });

    return [updatedContext];
  };

  const handleSendMessage = async () => {
    setIsLoading(true);
    try {
      const colRef = collection(db, 'messages');
      const data: Message = {
        message: msg,
        author: user.username,
        authorEmail: user.email,
        groupId: selectedGroup.groupId,
        createdAt: Timestamp.fromDate(new Date()),
        messageId: '',
        reactions: [],
      };
      const msgData = await addDoc(colRef, data);
      await updateDoc(doc(db, 'messages', msgData.id), {
        messageId: msgData.id,
      });
      await updateDoc(doc(db, 'groups', selectedGroup.groupId), {
        messages: [...selectedGroup.messages, msgData.id],
      });
      setMessages(mountMessage());
      setRawMessages([...rawMessages, data]);
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
        direction={'column'}
        height='846px'
        overflowY='scroll'
        borderRadius='md'
        p={4}
      >
        {selectedGroup ? (
          filteredMessages.length === 0 ? (
            <Text>Não há frases neste grupo.</Text>
          ) : (
            filteredMessages.map((message) => (
              <Phrase
                img={'/ripyard-logo.png'}
                isFromUser={message.author === user.username}
                message={message}
                key={`${message.messageId}-${message.author}`}
              />
            ))
          )
        ) : (
          <Text>Selecione um grupo para ver as mensagens.</Text>
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
