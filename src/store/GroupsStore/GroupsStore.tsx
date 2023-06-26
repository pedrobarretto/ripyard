import { Group } from '@/interfaces';
import { create } from 'zustand';

interface GroupsState {
  groups: Group[];
  setGroups: (newGrp: Group[]) => void;
  selectedGroup: Group;
  setSelectedGroup: (sGroup: Group) => void;
}

export const useGroups = create<GroupsState>((set) => ({
  groups: [],
  selectedGroup: {} as Group,
  setGroups: (newGrp) => set(() => ({ groups: newGrp })),
  setSelectedGroup: (sGroup) => set(() => ({ selectedGroup: sGroup })),
}));
