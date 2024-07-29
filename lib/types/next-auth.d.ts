import "next-auth";
export interface Session {
  accessToken?: string;
  user?: User;
}

export interface User {
  owId?: string;
  subId: string;
  name: string;
  role?: "admin" | "user";
  email: string;
  phone?: string;
  grade?: number;
  committees?: string[];
  isCommittee: boolean;
}
