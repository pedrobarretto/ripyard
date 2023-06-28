'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Card,
  Flex,
  Stack,
  Button,
} from '@chakra-ui/react';
import { useGroups, useInvites, useUser } from '@/store';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Group, Invite } from '@/interfaces';

interface CheckInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckInvites({ onClose, isOpen }: CheckInvitesModalProps) {
  const { invites, setInvites } = useInvites();
  const { user, setUser } = useUser();
  const { setGroups } = useGroups();

  const handleAccept = async (invite: Invite) => {
    const newUserGroups = [
      ...user.groups,
      { groupId: invite.groupId, groupName: invite.groupName },
    ];

    await updateDoc(doc(db, 'users', user.id), { groups: newUserGroups });
    setUser({ ...user, groups: newUserGroups });

    const grpPromises = user.groups.map((group) => {
      return getDoc(doc(db, 'groups', group.groupId));
    });
    const grpData = await Promise.all(grpPromises);
    const grpLst = grpData.map(
      (groupData) => JSON.parse(JSON.stringify(groupData.data())) as Group
    );
    setGroups(grpLst);
  };

  const handleDecline = (groupId: string) => {
    const newInvites = invites.filter((invite) => invite.groupId !== groupId);
    setInvites(newInvites);

    if (newInvites.length === 0) {
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Convites Pendentes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {invites.map((invite) => {
            return (
              <Card key={invite.groupId} padding={5}>
                <Flex align={'center'} justify={'space-between'}>
                  <Stack>
                    <span>Convite para: {invite.groupName}</span>
                    <span>Enviado por: {invite.groupOwnerEmail}</span>
                    <span>Mensagem: {invite.inviteMessage}</span>
                  </Stack>
                  <Stack>
                    <Button
                      colorScheme='custom'
                      _hover={{
                        backgroundColor: 'green.hover',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      backgroundColor='green.accept'
                      color='text.white'
                      style={{
                        flexShrink: '0',
                        height: '40px',
                        overflow: 'hidden',
                        width: '40px',
                        borderRadius: 50,
                      }}
                      onClick={() => handleAccept(invite)}
                    >
                      <CheckIcon boxSize={4} />
                    </Button>

                    <Button
                      colorScheme='custom'
                      _hover={{
                        backgroundColor: 'red.hover',
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
                      }}
                      backgroundColor='red.reject'
                      color='text.white'
                      style={{
                        flexShrink: '0',
                        height: '40px',
                        overflow: 'hidden',
                        width: '40px',
                        borderRadius: 50,
                      }}
                      onClick={() => handleDecline(invite.groupId)}
                    >
                      <CloseIcon boxSize={4} />
                    </Button>
                  </Stack>
                </Flex>
              </Card>
            );
          })}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
