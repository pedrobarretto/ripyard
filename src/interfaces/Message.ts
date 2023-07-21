import { Timestamp } from 'firebase/firestore';

export interface Message {
  message: string;
  author: string;
  authorEmail: string;
  groupId: string;
  createdAt: Timestamp;
  reactions: Reactions[];
  messageId: string;
  profileImageURL: string;
}

export interface Reactions {
  reactionAuthor: string;
  emoji: any;
  createdAt: Timestamp;
}

export interface MessagesContext {
  groupId: string;
  messages: Message[];
}