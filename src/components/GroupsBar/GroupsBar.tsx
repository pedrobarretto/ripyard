'use client';
import { AddIcon, EmailIcon, BellIcon } from '@chakra-ui/icons';
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { CreateGroupModal, InviteModal, NoneData } from '..';
import { useGroups, useInvites, useUser } from '@/store';
import { GroupComponent } from './Group';
import { CheckInvites } from '../InviteModal/CheckInvites';
import { useEffect, useState } from 'react';
import { Group, Invite } from '@/interfaces';
import { useDrawerDisclosure } from '@/context';
import { rtdb } from '@/config/firebase';
import { ref, onValue } from 'firebase/database';

export function GroupsBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inviteModal = useDisclosure();
  const checkInviteModal = useDisclosure();
  const { groups, setSelectedGroup } = useGroups();
  const { invites, setInvites } = useInvites();
  const [localGroups, setLocalGroups] = useState<Group[]>(groups);
  const { isOpenDrawer, onCloseDrawer } = useDrawerDisclosure();
  const { user } = useUser();

  useEffect(() => {
    const inviteRef = ref(rtdb, `${user.id}/invites`);
    onValue(inviteRef, (snapshot) => {
      if (snapshot.exists()) {
        const invites: Invite[] = Object.values(snapshot.val());
        setInvites(invites);
      } else {
        setInvites([]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenDrawer]);

  useEffect(() => {
    setLocalGroups(groups);
  }, [groups]);

  const onSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    onCloseDrawer();
  };

  return (
    <Drawer placement='left' isOpen={isOpenDrawer} onClose={onCloseDrawer}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Grupos</DrawerHeader>
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

        <Stack spacing={3} direction={'column'}>
          {localGroups.length === 0 ? (
            <NoneData text='Crie um grupo e convide seus amigos!' />
          ) : (
            localGroups.map((group) => {
              return (
                <GroupComponent
                  group={group}
                  key={group.groupId}
                  onClick={() => onSelectGroup(group)}
                />
              );
            })
          )}
        </Stack>

        <CheckInvites
          isOpen={checkInviteModal.isOpen}
          onClose={checkInviteModal.onClose}
          setLocalGroups={setLocalGroups}
        />
        <CreateGroupModal isOpen={isOpen} onClose={onClose} />
        <InviteModal
          isOpen={inviteModal.isOpen}
          onClose={inviteModal.onClose}
        />
      </DrawerContent>
    </Drawer>
  );
}
