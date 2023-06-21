import { useContext } from 'react';
import { UserContext } from '../context';

export function useUser() {
  const context = useContext(UserContext);
  return context;
}