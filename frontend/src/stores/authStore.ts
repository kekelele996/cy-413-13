import { create } from 'zustand';
import type { User } from '../types';
import * as userApi from '../api/user';

interface AuthState {
  token: string | null;
  user: User | null;
  bootstrapped: boolean;
  setAuth: (token: string, user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const savedToken = localStorage.getItem('mindgarden_token');
const savedUser = localStorage.getItem('mindgarden_user');

export const useAuthStore = create<AuthState>((set) => ({
  token: savedToken,
  user: savedUser ? (JSON.parse(savedUser) as User) : null,
  bootstrapped: Boolean(savedToken),
  setAuth: (token, user) => {
    localStorage.setItem('mindgarden_token', token);
    localStorage.setItem('mindgarden_user', JSON.stringify(user));
    set({ token, user, bootstrapped: true });
  },
  login: async (email, password) => {
    const result = await userApi.login({ email, password });
    localStorage.setItem('mindgarden_token', result.access_token);
    localStorage.setItem('mindgarden_user', JSON.stringify(result.user));
    set({ token: result.access_token, user: result.user, bootstrapped: true });
  },
  demoLogin: async () => {
    const result = await userApi.login({ email: 'demo@mindgarden.example.com', password: 'mindgarden123' });
    localStorage.setItem('mindgarden_token', result.access_token);
    localStorage.setItem('mindgarden_user', JSON.stringify(result.user));
    set({ token: result.access_token, user: result.user, bootstrapped: true });
  },
  logout: () => {
    localStorage.removeItem('mindgarden_token');
    localStorage.removeItem('mindgarden_user');
    set({ token: null, user: null, bootstrapped: false });
  },
}));
