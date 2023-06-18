'use client';
import { CustomButton } from '@/components';
import { Container, Input, Link } from '@chakra-ui/react';

export default function Page() {
  return (
    <div
      style={{
        padding: 0,
        margin: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh', // Optional: Set a height to center vertically
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
        <Input variant='filled' placeholder='Email' width='sm' />
        <Input variant='filled' placeholder='Senha' width='sm' />
        <CustomButton text='Criar' onClick={() => console.log()} width={'sm'} />
        <div style={{ textAlign: 'center' }}>
          <p>Ainda não criou sua conta?</p>
          <Link href='/register'>Registrar</Link>
        </div>
      </Container>
    </div>
  );
}
