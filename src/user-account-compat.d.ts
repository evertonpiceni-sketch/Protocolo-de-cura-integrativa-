import './types';

declare module './types' {
  interface UserAccount {
    createdAt?: string;
    lastActive?: string;
    role?: 'user' | 'admin';
  }
}
