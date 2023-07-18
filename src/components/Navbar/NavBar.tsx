'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { auth, db } from '@/config/firebase';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useGroups, useInvites, useMessages, useUser } from '@/store';
import { Group, Message, User } from '@/interfaces';
import { getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setRawUser(user);

        const userData = (
          await getDoc(doc(db, 'users', user.uid))
        ).data() as User;
        setUser(userData);

        const grpPromises = userData.groups.map(async (group) => {
          const grpDoc = await getDoc(doc(db, 'groups', group.groupId));
          if (grpDoc.exists()) {
            return grpDoc;
          } else {
            const newUserGroups = userData.groups.filter(
              (x) => x.groupId !== group.groupId
            );
            await updateDoc(doc(db, 'users', userData.id), {
              groups: newUserGroups,
            });
          }
        });
        const grpData = await Promise.all(grpPromises);
        const grpLst = grpData
          .map(
            (groupData) =>
              groupData?.exists &&
              (JSON.parse(JSON.stringify(groupData.data())) as Group)
          )
          .filter((group) => group !== undefined) as Group[];
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

  const hoverBgColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <nav
      style={{
        background: '#D9D9D9',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px',
        margin: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Link href='/'>
          <div
            style={{
              cursor: 'pointer',
              textDecoration: 'underline',
              color: 'inherit',
            }}
          >
            <img
              src='/ripyard-logo.png'
              alt='ripyard-logo'
              style={{ maxHeight: 40 }}
              width={40}
              height={40}
            />
          </div>
        </Link>
        {pathname === '/graveyard' && (
          <Button
            colorScheme='custom'
            _hover={{
              backgroundColor: 'dark.grpBrnHover',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
            }}
            backgroundColor='dark.grpBtn'
            color='text.antiWhite'
            marginLeft={10}
            onClick={onOpenDrawer}
          >
            Grupos
          </Button>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginRight: 16,
        }}
      >
        {rawUser.email ? (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<HamburgerIcon boxSize={8} />}
              variant='ghost'
              aria-label='Menu'
              _hover={{
                backgroundColor: hoverBgColor,
              }}
              transition='background-color 0.3s'
            />
            <MenuList>
              {/* <MenuItem onClick={handlesignOut}>Configurações</MenuItem> */}
              <MenuItem onClick={handlesignOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ) : (
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
        )}
      </div>
    </nav>
  );
}
