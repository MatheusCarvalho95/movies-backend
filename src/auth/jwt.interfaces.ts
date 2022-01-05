import { User } from '@prisma/client';

export interface JwtPayload {
  userName: string;
  sub: number;
}
export interface LoginReponse {
  access_token: string;
  userName: string;
  confirmedEmail: boolean;
}
export interface Session {
  user: User;
}
