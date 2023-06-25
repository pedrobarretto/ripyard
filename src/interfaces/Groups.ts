export interface Group {
  name: string;
  ownerName: string;
  ownerEmail: string;
  ownerId: string;
  members: Members[];
}

export interface Members {
  email: string;
  userId: string;
  username: string;
}