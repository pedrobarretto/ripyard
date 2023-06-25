export interface User {
  email: string;
  username: string;
  createdAt: Date;
  id: string;
  groups: UserGroup[];
}

export interface UserGroup {
  groupId: string;
  username: string;
}