'use client';
import { CustomButton } from '@/components';
import { Container, Input, Link } from '@chakra-ui/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth, db } from '../../config/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useUser } from '@/hooks';

export default function Page() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setUser, setRawUser } = useUser();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const info = await createUserWithEmailAndPassword(auth, email, password);
      const createdAt = new Date();
      await setDoc(doc(db, 'users', info.user.uid), {
        email,
        username,
        groups: [],
        createdAt,
        id: info.user.uid,
      });
      setUser({ email, username, createdAt, groups: [], id: info.user.uid });
      setRawUser(info.user);
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
          placeholder='Usuário'
          width='sm'
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          variant='filled'
          placeholder='Senha'
          width='sm'
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <CustomButton text='Criar' onClick={handleRegister} width={'sm'} />
        <div style={{ textAlign: 'center' }}>
          <p>Já tem uma conta?</p>
          <Link href='/login'>Faça o login aqui!</Link>
        </div>
      </Container>
    </div>
  );
}
