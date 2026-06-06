import { useState } from 'react';
import { googleLogin, getCurrentUser, logout } from '@/services/auth.service';

import type { GoogleLoginRequest, User } from '@/types/user';

function useAuth() {
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<User | undefined | null>(null);

  const login = async (googleLoginRequest: GoogleLoginRequest) => {
    setLoading(true);
    try {
      const data = await googleLogin(googleLoginRequest);
      await getUser();
      return data;
    } catch {
      throw new Error('error');
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const data = await getCurrentUser();

      setUser(data);
      return data;
    } catch {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    user,
    login,
    getUser,
    handleLogout,
  };
}

export { useAuth };
