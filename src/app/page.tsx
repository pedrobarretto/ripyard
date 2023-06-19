'use client';
import { auth } from '@/config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
      } else {
        console.log('Not logged in');
      }
    });
  }, []);

  return <h1>Hello, Home Page!</h1>;
}
