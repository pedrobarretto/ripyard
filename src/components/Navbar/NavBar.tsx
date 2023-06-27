'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { Button } from '@chakra-ui/react';
import { auth, db } from '@/config/firebase';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useGroups, useMessages, useUser } from '@/store';
import { Group, Message, User } from '@/interfaces';
import { getDoc, doc } from 'firebase/firestore';

export function NavBar() {
  const { rawUser, setRawUser, setUser } = useUser();
  const { setGroups, groups } = useGroups();
  const { mountMessage, messages, setRawMessages } = useMessages();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
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
        const msgLst = msgData
          .filter((listData) => listData !== undefined)
          .map(
            (listData) =>
              JSON.parse(JSON.stringify(listData?.data())) as Message
          );
        console.log('msgLst: ', msgLst);

        mountMessage(msgLst, groups);
        setRawMessages(msgLst);
        console.log(`Setting user ${user.email}`);
      } else {
        console.log('Not logged in');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log('new msgs: ', messages);
  }, [messages]);

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
