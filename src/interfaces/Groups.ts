import { Timestamp } from 'firebase/firestore';

export interface Group {
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  members: Members[];
  createdAt: Timestamp;
  groupId: string;
  messages: string[];
}

export interface Members {
  email: string;
  userId: string;
  username: string;
}