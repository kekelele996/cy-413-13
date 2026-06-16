import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export function useAuth() {
  const auth = useAuthStore();

  useEffect(() => {
    if (!auth.token && !auth.bootstrapped) {
      auth.demoLogin().catch(() => {
        auth.logout();
      });
    }
  }, [auth]);

  return auth;
}

