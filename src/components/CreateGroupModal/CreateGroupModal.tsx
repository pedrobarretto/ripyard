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
import { useGroups, useUser } from '@/hooks';
import { Group, User } from '@/interfaces';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const { rawUser, user } = useUser();
  const { groups, setGroups } = useGroups();

  const createGroup = async () => {
    console.log(user);
    const userRef = doc(db, 'users', rawUser.uid);
    const groupData: Group = {
      members: [
        {
          email: user.email,
          userId: rawUser.uid,
          username: user.username,
        },
      ],
      name: groupName,
      ownerName: user.username,
      ownerEmail: user.email,
      ownerId: rawUser.uid,
      createdAt: new Date(),
    };
    const group = await addDoc(collection(db, 'groups'), groupData);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as User;
    console.log(userData);
    await updateDoc(userRef, {
      groups: [
        ...userData.groups,
        {
          groupName,
          groupId: group.id,
        },
      ],
    });
    setGroups([...groups, groupData]);
    onClose();
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
