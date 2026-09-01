import './types';

declare module './types' {
  interface UserAccount {
    birthDate: string;
    createdAt?: string;
    lastActive?: string;
    role?: 'user' | 'admin';
  }
}
