'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CustomButton, CustomInput } from '..';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useUser } from '@/hooks';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const { rawUser, user } = useUser();

  const createGroup = async () => {
    console.log(user);
    await setDoc(
      doc(
        db,
        'groups',
        `${rawUser.uid}-${groupName.trim().replace(/\s/g, '')}`
      ),
      {
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
      }
    );
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
          <CustomButton text='Criar Grupo' onClick={createGroup} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
