'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CustomButton, CustomInput } from '..';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useUser } from '@/hooks';
import { User } from '@/interfaces';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const { rawUser, user } = useUser();

  const createGroup = async () => {
    console.log(user);
    const userRef = doc(db, 'users', rawUser.uid);
    const group = await addDoc(collection(db, 'groups'), {
      members: [
        {
          email: rawUser.email,
          userId: rawUser.uid,
          username: user.username,
        },
      ],
      name: groupName,
      ownerUsername: user.username,
      ownerEmail: rawUser.email,
      ownerId: rawUser.uid,
      createdAt: new Date(),
    });
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as User;
    await updateDoc(userRef, {
      groups: [
        ...userData.groups,
        {
          groupName,
          groupId: group.id,
        },
      ],
    });
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Novo Grupo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CustomInput
            value={groupName}
            placeholder='Nome do grupo'
            setValue={setGroupName}
          />
        </ModalBody>
        <ModalFooter>
          <CustomButton
            disabled={groupName.length === 0}
            text='Criar Grupo'
            onClick={createGroup}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
