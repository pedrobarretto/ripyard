'use client';
import { useState, useEffect } from 'react';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
import { useGroups, useMessages, useUser } from '@/store';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Message, MessagesContext } from '@/interfaces';
import { Phrase } from '..';

export function MessagesContainer() {
  const [msg, setMsg] = useState('');
  const { selectedGroup } = useGroups();
  const { user } = useUser();
  const { messages, setMessages, rawMessages, setRawMessages } = useMessages();
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([]);

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
    const colRef = collection(db, 'messages');
    const data: Message = {
      message: msg,
      author: user.username,
      authorEmail: user.email,
      groupId: selectedGroup.groupId,
      createdAt: new Date(),
      messageId: '',
      reactions: [],
    };
    const msgData = await addDoc(colRef, data);
    await updateDoc(doc(db, 'messages', msgData.id), { messageId: msgData.id });
    await updateDoc(doc(db, 'groups', selectedGroup.groupId), {
      messages: [...selectedGroup.messages, msgData.id],
    });
    setMessages(mountMessage());
    setRawMessages([...rawMessages, data]);
    setMsg('');
  };

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
      <div>
        {selectedGroup ? (
          filteredMessages.length === 0 ? (
            <Text>Não há frases neste grupo.</Text>
          ) : (
            filteredMessages.map((message) => (
              <div key={`${message.messageId}-${message.message}`}>
                <Phrase
                  img={'/ripyard-logo.png'}
                  isFromUser={message.author === user.username}
                  text={`${message.author}: ${message.message}`}
                  key={message.messageId}
                />
              </div>
            ))
          )
        ) : (
          <Text>Selecione um grupo para ver as mensagens.</Text>
        )}
      </div>
      <InputGroup size='md'>
        <Input
          backgroundColor='gray.input'
          variant='filled'
          pr='4.5rem'
          type='text'
          placeholder='Escreva sua frase aqui!'
          value={msg}
          onChange={(event) => setMsg(event.target.value)}
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
