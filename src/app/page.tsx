'use client';
import { auth } from '@/config/firebase';
import { useUser } from '@/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Page() {
  const { rawUser, setRawUser } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        setRawUser(user);
        console.log(`Setting user ${user.email}`);
      } else {
        console.log('Not logged in');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      {rawUser?.email ? (
        <div>
          <h1>Logado como {rawUser.email}</h1>
        </div>
      ) : (
        <div>
          <h1>Não logado!</h1>
        </div>
      )}
    </>
  );
}
