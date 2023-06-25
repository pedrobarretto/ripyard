'use client';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateGroupModal, NoneData } from '..';
import { useGroups, useUser } from '@/hooks';
import { GroupComponent } from './Group';
import { doc, getDoc } from 'firebase/firestore';
import { Group } from '@/interfaces';
import { db } from '@/config/firebase';
import { useEffect } from 'react';

export function GroupsBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { groups, setGroups } = useGroups();
  const { user } = useUser();

  const onStart = async () => {
    setGroups([]);
    user.groups.map(async (group) => {
      const groupData = await getDoc(doc(db, 'groups', group.groupId));
      console.log('groupData: ', groupData.data());
      setGroups((state: Group[]) => {
        return [...state, groupData.data() as Group];
      });
    });
  };

  useEffect(() => {
    onStart();
  }, []);

  return (
    <div
      style={{
        width: '400px',
        height: '846px',
        flexShrink: '0',
        borderRadius: '10px',
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Flex
        align={'center'}
        justify={'space-between'}
        padding={4}
        // marginBottom={5}
      >
        <Text fontSize={'xl'} color='gray.text' textAlign='center'>
          Grupos
        </Text>
        <Button
          colorScheme='custom'
          _hover={{
            backgroundColor: 'gray.buttonHover',
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
          }}
          backgroundColor='gray.button'
          color='text.white'
          style={{
            flexShrink: '0',
            height: '40px',
            overflow: 'hidden',
            width: '40px',
            borderRadius: 50,
          }}
          onClick={onOpen}
        >
          <AddIcon boxSize={5} />
        </Button>
      </Flex>

      {groups.length === 0 ? (
        <NoneData text='Crie um grupo e convide seus amigos!' />
      ) : (
        groups.map((group) => {
          return <GroupComponent group={group} key={group.name} />;
        })
      )}

      <CreateGroupModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
