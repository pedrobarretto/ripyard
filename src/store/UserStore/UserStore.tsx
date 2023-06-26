import { User as FirebaseUser } from '@firebase/auth';
import { User } from '@/interfaces';
import { create } from 'zustand';

interface UserState {
  user: User;
  rawUser: FirebaseUser;
  setUser: (newUser: User) => void;
  setRawUser: (newRawUser: FirebaseUser) => void;
}

export const useUser = create<UserState>((set) => ({
  user: {} as User,
  rawUser: {} as FirebaseUser,
  setUser: (newUser) => set(() => ({ user: newUser })),
  setRawUser: (newRawUser) => set(() => ({ rawUser: newRawUser })),
}));
