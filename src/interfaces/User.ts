import { Timestamp } from 'firebase/firestore';

export interface User {
  email: string;
  username: string;
  createdAt: Timestamp;
  id: string;
  groups: UserGroup[];
  profileImageURL?: string;
}

export interface UserGroup {
  groupId: string;
  groupName: string;
}