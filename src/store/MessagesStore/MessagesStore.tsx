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
      console.log('group.messages[index]: ', group.messages[index]);
      const filteredMsgs = msgs.filter((msg) => {
        console.log('msg.messageId: ', msg.messageId);
        return msg.messageId === group.messages[index];
      });
      messagesContext.push({
        groupId: group.groupId,
        messages: filteredMsgs,
      });
    });

    console.log('messagesContext: ', messagesContext);

    set(() => ({ messages: messagesContext }));
  },
}));
