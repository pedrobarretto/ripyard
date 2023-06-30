import { Timestamp } from 'firebase/firestore';

export interface User {
  email: string;
  username: string;
  createdAt: Timestamp;
  id: string;
  groups: UserGroup[];
}

export interface UserGroup {
  groupId: string;
  groupName: string;
}