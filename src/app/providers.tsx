'use client';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, withDefaultColorScheme } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

const colors = {
  gray: {
    button: '#969696',
    buttonHover: '#646464',
    text: '#717171',
    input: '#EBEBEB',
    phrase: '#BEBEBE',
  },
  text: {
    white: '#fff',
  },
  green: {
    accept: '#66ed8a',
    hover: '#82e89d',
  },
  red: {
    reject: '#de5757',
    hover: '#ed6f6f',
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
    <CacheProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
