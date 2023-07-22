'use client';
import { LoadingButton } from '@/components';
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/store';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '@/interfaces';
import Link from 'next/link';
import { FirebaseError } from 'firebase/app';
import { generateUserProfileImage, mapErrorCodeToMessage } from '@/utils';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setRawUser } = useUser();
  const router = useRouter();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const info = await signInWithEmailAndPassword(auth, email, password);
      const user = await getDoc(doc(db, 'users', info.user.uid));
      let downloadURL = '';
      if (user.exists()) {
        const data = user.data() as User;
        if (!data.profileImageURL) {
          const profileImageURL = await generateUserProfileImage(data.username);
          const storageRef = ref(storage, `profileImages/${info.user.uid}`);
          if (profileImageURL) {
            await uploadBytes(storageRef, profileImageURL);
          }
          
          downloadURL = await getDownloadURL(storageRef);

          await updateDoc(doc(db, 'users', data.id), {
            profileImageURL: downloadURL
          });

          setUser({ ...data, profileImageURL: downloadURL });
        }

        setUser({
          ...user,
          createdAt: data.createdAt,
          email: data.email,
          groups: data.groups,
          id: data.id,
          username: data.username,
          profileImageURL: downloadURL
        });

      } else {
        setUser({} as User);
      }
      setRawUser(info.user);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        toast({
          description: mapErrorCodeToMessage(error.code),
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          description: 'Unexpected error occurred while logging in',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div
      style={{
        padding: 0,
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <Container
        centerContent
        style={{
          backgroundColor: '#D9D9D9',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          borderRadius: '10px',
          padding: '20px',
          gap: '10px',
        }}
      >
        <Input
          variant='filled'
          placeholder='Email'
          width='sm'
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <InputGroup width='sm'>
          <Input
            variant='filled'
            placeholder='Password'
            width='sm'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type={show ? 'text' : 'password'}
          />
          <InputRightElement width='5rem'>
            <Button
              h='1.75rem'
              size='sm'
              marginRight={1}
              onClick={handleClick}
              style={{ backgroundColor: '#969696' }}
            >
              {show ? 'Hide' : 'Show'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <LoadingButton
          text='Log In'
          onClick={handleLogin}
          width={'sm'}
          isLoading={isLoading}
        />
        <div style={{ textAlign: 'center' }}>
          <Link href='/forgot-password' passHref>
            <Text _hover={{ textDecoration: 'underline' }}>I forget my password</Text>
          </Link>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p>Don&apos;t have an account yet?</p>
          <Link href='/register' passHref>
            <Text _hover={{ textDecoration: 'underline' }}>Register</Text>
          </Link>
        </div>
      </Container>
    </div>
  );
}
