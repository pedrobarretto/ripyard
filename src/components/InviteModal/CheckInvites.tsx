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
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useGroups, useInvites, useUser } from '@/store';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, rtdb } from '@/config/firebase';
import { Group, Invite } from '@/interfaces';
import { useState } from 'react';
import { ref, remove } from 'firebase/database';

interface CheckInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
  setLocalGroups: (groups: Group[]) => void;
}

export function CheckInvites({
  onClose,
  isOpen,
  setLocalGroups,
}: CheckInvitesModalProps) {
  const { invites } = useInvites();
  const { user, setUser } = useUser();
  const { setGroups, groups } = useGroups();
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);

  const removeInviteFromRTD = async (invite: Invite) => {
    const inviteRef = ref(
      rtdb,
      `${invite.invitedUserId}/invites/${invite.inviteId}`
    );
    await remove(inviteRef);
  };

  const handleAccept = async (invite: Invite) => {
    setIsLoadingAccept(true);
    try {
      const newUserGroups = [
        ...user.groups,
        { groupId: invite.groupId, groupName: invite.groupName },
      ];

      await updateDoc(doc(db, 'users', user.id), { groups: newUserGroups });
      setUser({ ...user, groups: newUserGroups });

      const newGroup = await getDoc(doc(db, 'groups', invite.groupId));
      const grpLst = newGroup.exists()
        ? [...groups, newGroup.data() as Group]
        : [...groups];

      await removeInviteFromRTD(invite);

      setGroups(grpLst);
      setLocalGroups(grpLst);
      setIsLoadingAccept(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingAccept(false);
  };

  const handleDecline = async (invite: Invite) => {
    setIsLoadingReject(true);
    try {
      await removeInviteFromRTD(invite);
      setIsLoadingReject(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoadingReject(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Convites Pendentes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {invites.length === 0 && (
            <Text>Você não tem nenhum convite pendente.</Text>
          )}
          {invites.map((invite) => {
            return (
              <Card
                key={invite.groupId}
                padding={5}
                marginBottom={invites?.length > 0 ? 5 : 0}
              >
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
                      isDisabled={isLoadingAccept}
                    >
                      {isLoadingAccept ? (
                        <Spinner />
                      ) : (
                        <CheckIcon boxSize={4} />
                      )}
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
                      onClick={() => handleDecline(invite)}
                      isDisabled={isLoadingReject}
                    >
                      {isLoadingReject ? (
                        <Spinner />
                      ) : (
                        <CloseIcon boxSize={4} />
                      )}
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
