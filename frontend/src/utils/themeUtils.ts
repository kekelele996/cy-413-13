import type { ThemeConfig } from 'antd';
import { THEME_OPTIONS, type ThemeName } from '../constants/themes';

export function syncThemeClassName(themeName: ThemeName): void {
  document.documentElement.classList.remove('theme-sage', 'theme-forest', 'theme-sunrise');
  document.documentElement.classList.add(`theme-${themeName}`);
}

export function themeToAntdConfig(themeName: ThemeName): ThemeConfig {
  const theme = THEME_OPTIONS[themeName];
  return {
    token: {
      colorPrimary: theme.primary,
      colorInfo: theme.primary,
      colorWarning: theme.accent,
      borderRadius: 8,
      fontFamily: '"Avenir Next", "Helvetica Neue", Arial, sans-serif',
    },
    components: {
      Card: {
        colorBgContainer: 'var(--surface)',
      },
      Layout: {
        bodyBg: 'var(--bg)',
      },
    },
  };
}

export function themeNameFromHex(color: string): ThemeName {
  if (color === '#86bcae') return 'forest';
  if (color === '#d37757') return 'sunrise';
  return 'sage';
}

