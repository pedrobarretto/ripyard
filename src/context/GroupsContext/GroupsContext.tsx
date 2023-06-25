import { useState } from 'react';
import { Group } from '@/interfaces';
import { ReactNode, createContext } from 'react';

interface GroupsContextProps {
  children: ReactNode;
}

interface GroupsContextData {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
}

export const GroupsContext = createContext({} as GroupsContextData);

export function GroupsProvider({ children }: GroupsContextProps) {
  const [groups, setGroups] = useState<Group[]>([]);

  return (
    <GroupsContext.Provider value={{ groups, setGroups }}>
      {children}
    </GroupsContext.Provider>
  );
}
