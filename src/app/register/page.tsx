'use client';
import { LoadingButton } from '@/components';
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  useToast,
} from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth, db, storage } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { useUser } from '@/store';
import { FirebaseError } from 'firebase/app';
import { generateUserProfileImage, mapErrorCodeToMessage } from '@/utils';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';

export default function Page() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { setUser, setRawUser } = useUser();
  const router = useRouter();
  const toast = useToast();

  const handleClick = () => setShow(!show);

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      const info = await createUserWithEmailAndPassword(auth, email, password);

      const profileImageURL = await generateUserProfileImage(username);
      const storageRef = ref(storage, `profileImages/${info.user.uid}`);
      if (profileImageURL) {
        await uploadBytes(storageRef, profileImageURL);
      }
      
      const downloadURL = await getDownloadURL(storageRef);
      const createdAt = Timestamp.fromDate(new Date());
      await setDoc(doc(db, 'users', info.user.uid), {
        email,
        username,
        groups: [],
        createdAt,
        id: info.user.uid,
        profileImageURL: downloadURL
      });
      setUser({ email, username, createdAt, groups: [], id: info.user.uid, profileImageURL: downloadURL });
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
          description: 'Sorry, an unexpected error occurred while creating your account',
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
        <Input
          variant='filled'
          placeholder='Username'
          width='sm'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
          isLoading={isLoading}
          text='Create'
          onClick={handleRegister}
          width={'sm'}
        />
        <div style={{ textAlign: 'center' }}>
          <p>Already have an account?</p>
          <Link href='/login'>Log in here!</Link>
        </div>
      </Container>
    </div>
  );
}
