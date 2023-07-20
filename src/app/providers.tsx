'use client';
import { DisclosureProvider } from '@/context';
import { CacheProvider } from '@chakra-ui/next-js';
import {
  ChakraProvider,
  useToast,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

const colors = {
  gray: {
    button: '#969696',
    buttonHover: '#646464',
    text: '#717171',
    input: '#EBEBEB',
    phrase: '#BEBEBE',
    background: '#D9D9D9'
  },
  text: {
    white: '#fff',
    antiWhite: '#EBEBEB',
  },
  green: {
    accept: '#66ed8a',
    hover: '#82e89d',
  },
  red: {
    reject: '#de5757',
    hover: '#ed6f6f',
  },
  dark: {
    grpBtn: '#454851',
    grpBrnHover: '#212529',
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
  const toast = useToast();

  return (
    <CacheProvider>
      <ChakraProvider
        theme={theme}
        toastOptions={{ defaultOptions: { position: 'top-right' } }}
      >
        <DisclosureProvider>{children}</DisclosureProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
