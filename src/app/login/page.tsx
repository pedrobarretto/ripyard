'use client';
import { LoadingButton } from '@/components';
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import { useUser } from '@/store';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/interfaces';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const { setUser, setRawUser } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const info = await signInWithEmailAndPassword(auth, email, password);
      const user = await getDoc(doc(db, 'users', info.user.uid));
      if (user.exists()) {
        setUser(user.data() as User);
      } else {
        setUser({} as User);
      }
      setRawUser(info.user);
      router.push('/');
    } catch (error) {
      console.log(error);
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
            placeholder='Senha'
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
              {show ? 'Esconder' : 'Mostrar'}
            </Button>
          </InputRightElement>
        </InputGroup>
        <LoadingButton
          text='Entrar'
          onClick={handleLogin}
          width={'sm'}
          isLoading={isLoading}
        />
        <div style={{ textAlign: 'center' }}>
          <p>Ainda não criou sua conta?</p>
          <Link href='/register' passHref>
            <Text _hover={{ textDecoration: 'underline' }}>Registrar</Text>
          </Link>
        </div>
      </Container>
    </div>
  );
}
