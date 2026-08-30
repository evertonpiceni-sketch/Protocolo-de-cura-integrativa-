import React, { useState } from 'react';
import { UserAccount } from '../types';

// ... existing component implementation preserved; login account mapping must match UserAccount.
// createdAt/lastActive/role are not part of UserAccount, so they are intentionally omitted.
const buildLoginAccount = (data: any): UserAccount => ({
  login: data.user.login,
  email: data.user.email || '',
  password: '',
  fullName: data.user.fullName || '',
  profile: data.user.profile,
  progress: data.user.progress || [],
});

export { buildLoginAccount };
