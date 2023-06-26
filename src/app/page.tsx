'use client';
import { CustomButton, Phrase } from '@/components';
import { useGroups, useUser } from '@/store';
import { Container, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const { rawUser } = useUser();
  const { groups } = useGroups();
  const router = useRouter();

  useEffect(() => {
    console.log('Updated groups:', groups);
  }, [groups]);

  const handleButton = () => {
    if (rawUser.email) {
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

  if (!rawUser.uid) {
    return <div>Carregando...</div>;
  }

  return (
    <Container centerContent pt={10}>
      <Image
        src={'/ripyard-name-logo.png'}
        alt='ripyard-logo'
        width={320}
        height={320}
      />
      <Text
        noOfLines={[1, 2, 3]}
        fontSize={['2xl', '3xl', '4xl']}
        color='gray.text'
        textAlign='center'
        mt={4}
      >
        Eternize suas frases e as de seus amigos na lápide!
      </Text>
      <VStack spacing={4} mt={8}>
        <Phrase
          text='Escreva as frases mais marcantes suas e de seus amigos aqui!'
          img={'/ripyard-logo.png'}
          isFromUser={false}
        />
        <Phrase
          text='Crie um grupo, adicione seus amigos, e salve seus momentos em texto!'
          img={'/ripyard-logo.png'}
          isFromUser={true}
        />
        <Phrase
          text='Crie agora sua conta, e convide seus amigos para colecionar frases e risadas!'
          img={'/ripyard-logo.png'}
          isFromUser={false}
        />
        {handleButton()}
      </VStack>
    </Container>
  );
}
