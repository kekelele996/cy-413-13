import { create } from 'zustand';
import type { ThemeName } from '../constants/themes';

interface ThemeState {
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

const savedTheme = (localStorage.getItem('mindgarden_theme') as ThemeName | null) || 'sage';

export const useThemeStore = create<ThemeState>((set) => ({
  themeName: savedTheme,
  setTheme: (themeName) => {
    localStorage.setItem('mindgarden_theme', themeName);
    set({ themeName });
  },
}));

