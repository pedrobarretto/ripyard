'use client';
import { Button, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

interface ButtonProps extends ChakraButtonProps {
  text: string;
  onClick: () => void;
}

export function CustomButton({ text, onClick, ...rest }: ButtonProps) {
  return (
    <Button
      colorScheme='custom'
      _hover={
        rest._hover
          ? rest._hover
          : {
              background: 'gray.buttonHover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            }
      }
      background={rest.background ? rest.background : 'gray.button'}
      color='text.white'
      onClick={onClick}
      {...rest}
      isDisabled={rest.disabled || false}
    >
      {text}
    </Button>
  );
}
