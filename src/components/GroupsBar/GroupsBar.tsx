'use client';
import { AddIcon, EmailIcon, BellIcon } from '@chakra-ui/icons';
import { Button, Flex, Stack, Text, useDisclosure } from '@chakra-ui/react';
import { CreateGroupModal, InviteModal, NoneData } from '..';
import { useGroups, useInvites } from '@/store';
import { GroupComponent } from './Group';
import { CheckInvites } from '../InviteModal/CheckInvites';

export function GroupsBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inviteModal = useDisclosure();
  const checkInviteModal = useDisclosure();
  const { groups, setSelectedGroup } = useGroups();
  const { invites } = useInvites();

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

        <Stack spacing={3} direction={'row'}>
          {invites.length > 0 && (
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
              onClick={checkInviteModal.onOpen}
            >
              <BellIcon boxSize={5} />
            </Button>
          )}

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
            onClick={inviteModal.onOpen}
          >
            <EmailIcon boxSize={5} />
          </Button>

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
        </Stack>
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

      <CheckInvites
        isOpen={checkInviteModal.isOpen}
        onClose={checkInviteModal.onClose}
      />
      <CreateGroupModal isOpen={isOpen} onClose={onClose} />
      <InviteModal isOpen={inviteModal.isOpen} onClose={inviteModal.onClose} />
    </div>
  );
}
