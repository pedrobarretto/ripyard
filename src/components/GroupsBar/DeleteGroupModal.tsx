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
} from '@chakra-ui/react';
import { CustomButton, LoadingButton } from '..';
import { useState } from 'react';
import { Group } from '@/interfaces';

interface DeleteGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
}

export function DeleteGroupModal({
  onClose,
  isOpen,
  group,
}: DeleteGroupModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleDeleteGroup = async () => {
    setIsLoading(true);
    try {
      // deletar col do grupo
      // deletar mensagens do grupo
      // deletar grupo de todos os membros
    } catch (error) {
      toast({
        status: 'error',
        duration: 9000,
        isClosable: true,
        description: `Erro ao deletar grupo ${group.name}, tente novamente mais tarde.`,
      });
    }
    setIsLoading(false);
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deletar Grupo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            <strong>Certeza</strong> que quer <strong>deletar</strong> o grupo{' '}
            {group.name}?
          </Text>
        </ModalBody>
        <ModalFooter>
          <LoadingButton
            width={'xm'}
            isLoading={isLoading}
            text='Sim, deletar'
            onClick={handleDeleteGroup}
            isDisabled={isLoading}
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
            text='Não quero deletar'
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
