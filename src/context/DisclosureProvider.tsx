import React, { ReactNode, createContext, useContext } from 'react';
import { useDisclosure } from '@chakra-ui/react';

interface DisclosureContextProps {
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
}

interface DisclosureProviderProps {
  children: ReactNode;
}

const DisclosureContext = createContext<DisclosureContextProps>(
  {} as DisclosureContextProps
);

export const DisclosureProvider = ({ children }: DisclosureProviderProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <DisclosureContext.Provider
      value={{
        isOpenDrawer: isOpen,
        onCloseDrawer: onClose,
        onOpenDrawer: onOpen,
      }}
    >
      {children}
    </DisclosureContext.Provider>
  );
};

export const useDrawerDisclosure = () => {
  const context = useContext(DisclosureContext);

  return context;
};
