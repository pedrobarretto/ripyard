'use client';
import { CustomButton, Phrase } from '@/components';
import { Message } from '@/interfaces';
import { useUser } from '@/store';
import { Container, Text, VStack } from '@chakra-ui/react';
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
          text='Ir para meus grupos'
          onClick={() => router.push('/graveyard')}
        />
      );
    }

    return (
      <CustomButton
        text='Crie agora sua conta'
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
        mt={4}
      >
        Eternize suas frases e as de seus amigos na lápide!
      </Text>
      <VStack spacing={4} mt={8}>
        <Phrase
          message={{
            ...mockMsg,
            message:
              'Escreva as frases mais marcantes suas e de seus amigos aqui!',
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
              'Crie um grupo, adicione seus amigos, e salve seus momentos em texto!',
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
              'Crie agora sua conta, e convide seus amigos para colecionar frases e risadas!',
            createdAt: Timestamp.fromDate(new Date()),
            author: 'Pablo',
          }}
          img={'/ripyard-logo.png'}
          isFromUser={false}
        />
        {handleButton()}
      </VStack>
    </Container>
  );
}
