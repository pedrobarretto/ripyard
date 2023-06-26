'use client';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateGroupModal, NoneData } from '..';
import { useGroups } from '@/store';
import { GroupComponent } from './Group';
import { Group } from '@/interfaces';

export function GroupsBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { groups, setSelectedGroup } = useGroups();

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
      <Flex align={'center'} justify={'space-between'} padding={4}>
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
          return (
            <GroupComponent
              group={group}
              key={group.groupId}
              onClick={setSelectedGroup}
            />
          );
        })
      )}

      <CreateGroupModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
}
