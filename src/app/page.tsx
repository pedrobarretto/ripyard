'use client';
import { CustomButton, Phrase } from '@/components';
import { auth, db } from '@/config/firebase';
import { Group, User } from '@/interfaces';
import { useGroups, useUser } from '@/hooks';
import { Container, Text, VStack } from '@chakra-ui/react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { rawUser, setRawUser, setUser } = useUser();
  const { setGroups, groups } = useGroups();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        setRawUser(user);
        const userData = (
          await getDoc(doc(db, 'users', user.uid))
        ).data() as User;
        console.log(userData.groups);
        userData.groups.map(async (group) => {
          const groupData = await getDoc(doc(db, 'groups', group.groupId));
          console.log('groupData: ', groupData.data());
          setGroups((state: Group[]) => {
            return [...state, groupData.data() as Group];
          });
        });
        setUser(userData);
        console.log(`Setting user ${user.email}`);
      } else {
        console.log('Not logged in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  if (loading) {
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
