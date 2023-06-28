import { Group, Message, MessagesContext } from '@/interfaces';
import { create } from 'zustand';

interface MessagesState {
  messages: MessagesContext[];
  rawMessages: Message[];
  setMessages: (msgs: MessagesContext[]) => void;
  setRawMessages: (rMsgs: Message[]) => void;
  mountMessage: (msgs: Message[], groups: Group[]) => void;
}

export const useMessages = create<MessagesState>((set) => ({
  messages: [],
  rawMessages: [],
  setRawMessages: (rMsgs: Message[]) => set(() => ({ rawMessages: rMsgs })),
  setMessages: (msgs) => set(() => ({ messages: msgs })),
  mountMessage: (msgs, groups) => {
    const messagesContext: MessagesContext[] = [];

    groups.forEach((group, index) => {
      const filteredMsgs = msgs.filter((msg) => {
        return msg.messageId === group.messages[index];
      });
      messagesContext.push({
        groupId: group.groupId,
        messages: filteredMsgs,
      });
    });

    set(() => ({ messages: messagesContext }));
  },
}));
