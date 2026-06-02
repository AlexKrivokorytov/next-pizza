'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

export const NextAuthSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
