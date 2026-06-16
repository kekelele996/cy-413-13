export type ThemeName = 'sage' | 'forest' | 'sunrise';

export const THEME_OPTIONS: Record<ThemeName, { label: string; primary: string; accent: string; bg: string }> = {
  sage: {
    label: '鼠尾草',
    primary: '#4b9b8f',
    accent: '#f2a541',
    bg: '#f6f4ec',
  },
  forest: {
    label: '深林',
    primary: '#86bcae',
    accent: '#e6b65d',
    bg: '#17211b',
  },
  sunrise: {
    label: '晨光',
    primary: '#d37757',
    accent: '#4b9b8f',
    bg: '#f7eadb',
  },
};

export const THEME_ECHARTS_COLORS: Record<ThemeName, string[]> = {
  sage: ['#4b9b8f', '#f2a541', '#bf4a3c'],
  forest: ['#86bcae', '#e6b65d', '#d78372'],
  sunrise: ['#d37757', '#4b9b8f', '#ad4f45'],
};

