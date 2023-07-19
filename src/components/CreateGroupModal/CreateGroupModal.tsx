'use client';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { CustomButton, CustomInput, LoadingButton } from '..';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useGroups, useUser } from '@/store';
import { Group, User } from '@/interfaces';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { rawUser, user } = useUser();
  const { groups, setGroups } = useGroups();
  const toast = useToast();

  const createGroup = async () => {
    setIsLoading(true);
    try {
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
        createdAt: Timestamp.fromDate(new Date()),
        groupId: '',
        messages: [],
      };
      const group = await addDoc(collection(db, 'groups'), groupData);
      groupData.groupId = group.id;
      await updateDoc(doc(db, 'groups', group.id), { groupId: group.id });
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
      setGroups([...groups, groupData]);
      setGroupName('');
      toast({
        description: `Group ${groupData.name} created successfully!`,
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        description: 'Sorry, an error occurred while creating your group. Please try again later.',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>New Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CustomInput
            value={groupName}
            placeholder='Group Name'
            setValue={setGroupName}
          />
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            width={'xm'}
            isLoading={isLoading}
            text='Create Group'
            onClick={createGroup}
            isDisabled={groupName.length === 0}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
