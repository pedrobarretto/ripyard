'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { Button } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href='/'>
          <div className={styles.link}>
            <Image
              src={'/ripyard-logo.png'}
              alt='ripyard-logo'
              className={styles.logoImage}
              width={40}
              height={40}
            />
          </div>
        </Link>
      </div>
      {pathname !== '/login' && (
        <div className={styles.buttonContainer}>
          <Button
            as={'a'}
            href='/login'
            colorScheme='custom'
            _hover={{
              backgroundColor: 'gray.buttonHover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            }}
            backgroundColor='gray.button'
            color='text.white'
          >
            Entrar
          </Button>
        </div>
      )}
    </nav>
  );
}
