import { create } from 'zustand';
import * as userApi from '../api/user';
import type { ProfileReport, User } from '../types';

interface UserState {
  profile: User | null;
  report: ProfileReport | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
  loadReport: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  report: null,
  loading: false,
  loadProfile: async () => {
    set({ loading: true });
    try {
      const profile = await userApi.getMe();
      set({ profile });
    } finally {
      set({ loading: false });
    }
  },
  loadReport: async () => {
    set({ loading: true });
    try {
      const report = await userApi.getProfileReport();
      set({ report, profile: report.user });
    } finally {
      set({ loading: false });
    }
  },
  updateProfile: async (payload) => {
    const profile = await userApi.updateMe(payload);
    set({ profile });
  },
}));

