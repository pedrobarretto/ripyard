export interface Message {
  message: string;
  author: string;
  authorEmail: string;
  groupId: string;
  createdAt: Date;
  reactions: Reactions[];
  messageId: string;
}

export interface Reactions {
  reactionAuthor: string;
  emoji: any;
  createdAt: Date;
}

export interface MessagesContext {
  groupId: string;
  messages: Message[];
}