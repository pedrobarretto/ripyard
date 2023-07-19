'use client';
import { CustomButton, Phrase } from '@/components';
import { Message } from '@/interfaces';
import { useUser } from '@/store';
import { Container, Stack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { Timestamp } from 'firebase/firestore';

export default function Page() {
  const { rawUser } = useUser();
  const router = useRouter();

  const mockMsg: Message = {
    author: '',
    authorEmail: '',
    createdAt: Timestamp.fromDate(new Date()),
    groupId: '',
    message: '',
    messageId: '',
    reactions: [],
  };

  const handleButton = () => {
    if (rawUser?.email) {
      return (
        <CustomButton
          marginBottom={10}
          text='Go to My Groups'
          onClick={() => router.push('/graveyard')}
        />
      );
    }

    return (
      <CustomButton
        marginBottom={10}
        text='Create Your Account Now'
        onClick={() => router.push('/register')}
      />
    );
  };

  return (
    <Container centerContent pt={10}>
      <img
        src='/ripyard-name-logo.png'
        alt='ripyard-logo'
        width={320}
        height={320}
      />
      <Text
        fontSize={['2xl', '3xl', '4xl']}
        color='gray.text'
        textAlign='center'
      >
        Eternalize your own and your friends&apos; phrases on the tombstone!
      </Text>
      <Stack spacing={4} mt={8} marginBottom={4}>
        <Phrase
          message={{
            ...mockMsg,
            message: 'Write your most memorable phrases here!',
            createdAt: Timestamp.fromDate(new Date()),
            author: 'Pedro',
          }}
          img={'/ripyard-logo.png'}
          isFromUser={false}
        />
        <Phrase
          message={{
            ...mockMsg,
            message:
              'Create a group, add your friends, and save your moments in text!',
            createdAt: Timestamp.fromDate(new Date()),
            author: 'Diego',
          }}
          img={'/ripyard-logo.png'}
          isFromUser={true}
        />
        <Phrase
          message={{
            ...mockMsg,
            message:
              'Create your account now and invite your friends to collect phrases and laughter!',
            createdAt: Timestamp.fromDate(new Date()),
            author: 'Pablo',
          }}
          img={'/ripyard-logo.png'}
          isFromUser={false}
        />
      </Stack>
      {handleButton()}
    </Container>
  );
}
