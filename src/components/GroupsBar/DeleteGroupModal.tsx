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
  Text,
  Button,
  Select,
  Stack,
} from '@chakra-ui/react';
import { CustomButton, LoadingButton } from '..';
import { useState } from 'react';
import { Group } from '@/interfaces';
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, rtdb } from '@/config/firebase';
import { ref, remove } from 'firebase/database';
import { useGroups, useUser } from '@/store';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  setLocalGroups: (groups: Group[]) => void;
  setSelectedGroup: (group: Group) => void;
}

export function DeleteGroupModal({
  onClose,
  isOpen,
  group,
  setLocalGroups,
}: DeleteGroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const { groups, setGroups } = useGroups();
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleDeleteGroup = async () => {
    setIsLoading(true);
    try {
      const groupRef = doc(db, 'groups', group.groupId);
      const groupData = await getDoc(groupRef);

      const newOwner = group.members.find((x) => x.email === email);

      if (groupData.exists()) {
        const data = groupData.data() as Group;

        if (data.members.length === 1) {
          await deleteDoc(groupRef);

          const msgsRef = ref(rtdb, group.groupId);
          await remove(msgsRef);
        } else {
          const newMembers = data.members.filter((x) => x.userId !== user.id);

          await updateDoc(groupRef, {
            members: newMembers,
            ownerEmail: email,
            ownerId: newOwner?.userId,
            ownerName: newOwner?.username,
          });
        }
      }

      const newUserGroups = user.groups.filter(
        (x) => x.groupId !== group.groupId
      );

      await updateDoc(doc(db, 'users', user.id), {
        groups: newUserGroups,
      });

      setUser({ ...user, groups: newUserGroups });

      const newGroups = groups.filter((x) => x.groupId !== group.groupId);
      setGroups(newGroups);
      setLocalGroups(newGroups);
    } catch (error) {
      toast({
        status: 'error',
        duration: 9000,
        isClosable: true,
        description: `Error deleting group ${group.name}, please try again later.`,
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Group</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <Text>
              Are you <strong>sure</strong> you want to{' '}
              <strong style={{ color: '#de5757' }}>
                {group.members.length > 1 ? 'leave ' : 'delete '}
              </strong>
              {group.members.length > 1 ? 'the ' : 'this '}
              group <strong>{group.name}</strong>?
            </Text>
            {group.members.length > 1 && (
              <>
                <Text>
                  Choose someone to be the new group administrator:
                </Text>
                <Select
                  variant='filled'
                  width={['20rem', 'sm']}
                  placeholder='Choose a member'
                  onChange={(event) => setEmail(event.target.value)}
                >
                  {group.members.map((member) => {
                    if (member.userId !== user.id)
                      return (
                        <option value={member.email} key={member.userId}>
                          {member.email}
                        </option>
                      );
                  })}
                </Select>
              </>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            width={'xm'}
            isLoading={isLoading}
            text='Yes, delete'
            onClick={handleDeleteGroup}
            isDisabled={isLoading || email.length === 0}
            background={'red.reject'}
            _hover={{
              background: 'red.hover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            }}
            marginRight={5}
          />
          <CustomButton
            width={'xm'}
            isLoading={isLoading}
            onClick={onClose}
            isDisabled={isLoading}
            background={'green.accept'}
            text="I don't want to delete"
            _hover={{
              background: 'green.hover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
