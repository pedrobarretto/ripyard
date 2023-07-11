'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { CustomInput, LoadingButton } from '..';
import { useState } from 'react';
import { useGroups } from '@/store';
import { auth, db, rtdb } from '@/config/firebase';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Invite, User } from '@/interfaces';
import { child, get, push, ref, set } from 'firebase/database';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [groupId, setGroupId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const { groups } = useGroups();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const closeModal = () => {
    setEmail('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  const getUserByEmail = async (email: string) => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        return userData as User;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao obter usuário por email:', error);
      return null;
    }
  };

  const handleInvite = async () => {
    setIsLoading(true);
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length <= 0) {
      setError('Email não existe!');
      return;
    }

    const invitedUser = await getUserByEmail(email);

    if (invitedUser !== null) {
      const inviteRef = ref(rtdb, `${invitedUser.id}/invites`);
      const newInviteRef = push(inviteRef);

      const grpAlreadyExists = invitedUser.groups.map((grp) => {
        if (grp.groupId === groupId) {
          setError('Usuário já está nesse grupo.');
          return true;
        }

        return false;
      });

      if (grpAlreadyExists?.find((x) => x === true)) {
        setIsLoading(false);
        return;
      }

      const inviteAlreadyExists = await get(
        child(ref(rtdb), `${invitedUser.id}/invites`)
      ).then((snapshot) => {
        if (snapshot.exists()) {
          const userInvites: Invite[] = Object.values(snapshot.val());
          console.log(userInvites);
          return userInvites.map((invite) => {
            if (invite.groupId === groupId) {
              setError('O usuário já possui um invite para esse grupo.');
              return true;
            }
            return false;
          });
        }
      });

      if (inviteAlreadyExists?.find((x) => x === true)) {
        setIsLoading(false);
        return;
      }

      const [group] = groups.filter((grp) => grp.groupId === groupId);

      const newInvite: Invite = {
        groupId: group.groupId,
        groupName: group.name,
        groupOwner: group.ownerName,
        groupOwnerEmail: group.ownerEmail,
        inviteMessage,
        invitedUserId: invitedUser.id,
        inviteId: newInviteRef?.key || 'none',
      };

      await set(newInviteRef, newInvite);

      setError('');
      setIsLoading(false);
      closeModal();
    } else {
      setIsLoading(false);
      setError('Erro ao enviar convite, tente novamente mais tarde.');
    }
  };

  return (
    <Modal onClose={closeModal} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Convidar Participante</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <CustomInput
              value={email}
              placeholder='Email do convidado'
              setValue={setEmail}
            />
            <Select
              variant='filled'
              width={'sm'}
              placeholder='Escolha um grupo'
              onChange={(event) => setGroupId(event.target.value)}
            >
              {groups.map((grp) => {
                return (
                  <option value={grp.groupId} key={grp.groupId}>
                    {grp.name}
                  </option>
                );
              })}
            </Select>
            <Textarea
              placeholder='Deixe uma mensagem em seu convite!'
              value={inviteMessage}
              onChange={(event) => setInviteMessage(event.target.value)}
              width={'sm'}
              variant='filled'
              lineHeight={3}
            />
            {error.length > 0 && <span>{error}</span>}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            isLoading={isLoading}
            isDisabled={email.length === 0 || groupId.length === 0}
            text='Convidar participante'
            onClick={handleInvite}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
