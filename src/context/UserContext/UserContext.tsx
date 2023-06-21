import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '@firebase/auth';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  rawUser: User;
  setRawUser: (user: User) => void;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [rawUser, setRawUser] = useState({} as User);

  return (
    <UserContext.Provider value={{ rawUser, setRawUser }}>
      {children}
    </UserContext.Provider>
  );
}
