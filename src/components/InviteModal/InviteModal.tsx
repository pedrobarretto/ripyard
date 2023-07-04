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
import { CustomButton, CustomInput, LoadingButton } from '..';
import { useState } from 'react';
import { useGroups, useInvites, useUser } from '@/store';
import { auth, db } from '@/config/firebase';
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Invite, User } from '@/interfaces';

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

    const [group] = groups.filter((grp) => grp.groupId === groupId);

    const newInvite: Invite = {
      groupId: group.groupId,
      groupName: group.name,
      groupOwner: group.ownerName,
      groupOwnerEmail: group.ownerEmail,
      inviteMessage,
    };

    const invitedUserId = await getUserByEmail(email);
    if (invitedUserId !== null) {
      const invitesData = (
        await getDoc(doc(db, 'invites', invitedUserId.id))
      ).data();

      const invitesLst = invitesData?.invites ? invitesData?.invites : [];

      const updatedInvites: Invite[] =
        invitesLst.length > 0 ? [...invitesLst, newInvite] : [newInvite];

      const oldInvites = (
        await getDoc(doc(db, 'invites', invitedUserId.id))
      ).data() as Invite[];

      if (oldInvites === undefined) {
        await setDoc(doc(db, 'invites', invitedUserId.id), {
          invites: [newInvite],
        });
      } else {
        await setDoc(doc(db, 'invites', invitedUserId.id), {
          invites: updatedInvites,
        });
      }

      setError('');
      setIsLoading(false);
      onClose();
    } else {
      setIsLoading(false);
      setError('Erro ao enviar convite, tente novamente mais tarde.');
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
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
