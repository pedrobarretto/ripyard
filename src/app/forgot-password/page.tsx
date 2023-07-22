/* eslint-disable @next/next/no-img-element */
'use client';
import { useState } from 'react';
import {
  Box,
  Container,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { auth } from '@/config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { CustomInput, LoadingButton } from '@/components';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleResetPassword = async () => {
    if (!email) {
      toast({
        description: 'Please enter your email address.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        description: 'Password reset email sent! Please check your inbox.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
    } catch (error) {
      console.error(error);
      toast({
        description: 'Failed to send password reset email. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    setIsLoading(false);
  };

  return (
    <Box display='flex' alignItems='center' justifyContent='center' height='calc(90vh - 30px)'>
      <Container backgroundColor='gray.background' style={{ boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', borderRadius: 10, padding: 15 }}>
        <Stack spacing={4}>
          <Stack spacing={3} direction={'row'}>
            <img src='/ripyard-logo.png' width={40} height={30} alt='ripyard-logo' />
            <Text fontSize='2xl' fontWeight='bold' color='gray.text'>Forgot Password</Text>
          </Stack>
          <Text color='gray.text'>
            When you fill in your email, and click on the button, you will receive an email with a link to reset your password.
          </Text>
          <CustomInput
            placeholder='Enter your email'
            value={email}
            setValue={setEmail}
            type='email'
          />
          <LoadingButton
            isDisabled={email.length === 0}
            isLoading={isLoading}
            onClick={handleResetPassword}
            text='Get reset link'
          />
        </Stack>
      </Container>
    </Box>
  );
}
