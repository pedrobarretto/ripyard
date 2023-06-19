'use client';
import { CustomButton } from '@/components';
import { Container, Input, Link } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../../config/firebase';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
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
          placeholder='Senha'
          width='sm'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <CustomButton text='Entrar' onClick={handleLogin} width={'sm'} />
        <div style={{ textAlign: 'center' }}>
          <p>Ainda não criou sua conta?</p>
          <Link href='/register'>Registrar</Link>
        </div>
      </Container>
    </div>
  );
}
