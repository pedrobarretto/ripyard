'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { Button, useToast } from '@chakra-ui/react';
import { auth, db } from '@/config/firebase';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useGroups, useInvites, useMessages, useUser } from '@/store';
import { Group, Message, User } from '@/interfaces';
import { getDoc, doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import { useDrawerDisclosure } from '@/context';

export function NavBar() {
  const { rawUser, setRawUser, setUser } = useUser();
  const { setGroups, groups } = useGroups();
  const { mountMessage, setRawMessages } = useMessages();
  const { setInvites } = useInvites();
  const { onOpenDrawer } = useDrawerDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setRawUser(user);

        const userData = (
          await getDoc(doc(db, 'users', user.uid))
        ).data() as User;
        setUser(userData);

        const grpPromises = userData.groups.map((group) => {
          return getDoc(doc(db, 'groups', group.groupId));
        });
        const grpData = await Promise.all(grpPromises);
        const grpLst = grpData.map(
          (groupData) => JSON.parse(JSON.stringify(groupData.data())) as Group
        );
        setGroups(grpLst);

        const messagesPromises = grpLst.map((group) => {
          return group.messages.map((msg) => {
            if (msg) return getDoc(doc(db, 'messages', msg));
            return Promise.resolve(undefined);
          });
        });

        const msgData = await Promise.all(messagesPromises.flat());
        if (msgData) {
          const msgLst = msgData
            .filter((listData) => listData?.exists())
            .map(
              (listData) =>
                JSON.parse(JSON.stringify(listData?.data())) as Message
            );
          mountMessage(msgLst, groups);
          setRawMessages(msgLst);
        }

        const invitesData = (
          await getDoc(doc(db, 'invites', userData.id))
        ).data();
        setInvites(invitesData ? invitesData.invites : []);
      } else {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, []);

  const handlesignOut = () => {
    setRawUser({} as FirebaseUser);
    setUser({} as User);
    setGroups([]);
    signOut(auth);
  };

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
      {rawUser.email ? (
        <div className={styles.buttonContainer}>
          {pathname === '/graveyard' && (
            <Button
              colorScheme='custom'
              _hover={{
                backgroundColor: 'dark.grpBrnHover',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
              }}
              backgroundColor='dark.grpBtn'
              color='text.antiWhite'
              marginRight={3}
              onClick={onOpenDrawer}
            >
              Grupos
            </Button>
          )}

          <Link href='/' passHref>
            <Button
              colorScheme='custom'
              _hover={{
                backgroundColor: 'gray.buttonHover',
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
              }}
              backgroundColor='gray.button'
              color='text.white'
              onClick={handlesignOut}
            >
              Logout
            </Button>
          </Link>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <Link href='/login' passHref>
            <Button
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
          </Link>
        </div>
      )}
    </nav>
  );
}
