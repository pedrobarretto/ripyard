'use client';

import { UserProvider } from '@/context';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, withDefaultColorScheme } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

const colors = {
  gray: {
    button: '#969696',
    buttonHover: '#646464',
  },
  text: {
    white: '#fff',
  },
};

const theme = extendTheme(
  {
    colors,
    components: {
      Button: {
        baseStyle: {
          transition:
            'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        },
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: 'custom',
    components: ['Button'],
  })
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </UserProvider>
  );
}
