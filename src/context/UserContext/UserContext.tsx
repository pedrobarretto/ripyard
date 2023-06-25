import { createContext, ReactNode, useContext, useState } from 'react';
import { User as FirebaseUser } from '@firebase/auth';
import { User } from '@/interfaces';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  rawUser: FirebaseUser;
  setRawUser: (user: FirebaseUser) => void;
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [rawUser, setRawUser] = useState({} as FirebaseUser);
  const [user, setUser] = useState({} as User);

  return (
    <UserContext.Provider value={{ rawUser, setRawUser, user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
