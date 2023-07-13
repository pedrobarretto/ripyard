'use client';
import {
  Button,
  ButtonProps as ChakraButtonProps,
  Spinner,
} from '@chakra-ui/react';

interface ButtonProps extends ChakraButtonProps {
  text: string;
  onClick: () => Promise<void>;
  isLoading: boolean;
}

export function LoadingButton({
  text,
  onClick,
  isLoading,
  ...rest
}: ButtonProps) {
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
      backgroundColor={rest.background ? rest.background : 'gray.button'}
      color='text.white'
      onClick={onClick}
      {...rest}
      isDisabled={isLoading || rest.isDisabled}
    >
      {isLoading ? <Spinner size={'md'} /> : <>{text}</>}
    </Button>
  );
}
