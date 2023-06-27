export interface Group {
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  members: Members[];
  createdAt: Date;
  groupId: string;
  messages: string[];
}

export interface Members {
  email: string;
  userId: string;
  username: string;
}