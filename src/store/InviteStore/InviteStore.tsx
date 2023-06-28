import { Invite } from '@/interfaces';
import { create } from 'zustand';

interface InvitesState {
  invites: Invite[];
  setInvites: (invites: Invite[]) => void;
}

export const useInvites = create<InvitesState>((set) => ({
  invites: [],
  setInvites: (newInvites) => set(() => ({ invites: newInvites })),
}));
