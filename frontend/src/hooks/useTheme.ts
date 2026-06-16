import { THEME_OPTIONS } from '../constants/themes';
import { useThemeStore } from '../stores/themeStore';

export function useTheme() {
  const themeName = useThemeStore((state) => state.themeName);
  const setTheme = useThemeStore((state) => state.setTheme);
  return {
    themeName,
    setTheme,
    theme: THEME_OPTIONS[themeName],
    options: THEME_OPTIONS,
  };
}

