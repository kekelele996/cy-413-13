import { MoodTag } from '../constants/mood';

export const MOOD_TAG_COLORS: Record<MoodTag, string> = {
  [MoodTag.HAPPY]: '#f2a541',
  [MoodTag.ANXIOUS]: '#d96c75',
  [MoodTag.TIRED]: '#7e8aa2',
  [MoodTag.ANGRY]: '#bf4a3c',
  [MoodTag.CALM]: '#4b9b8f',
};

export function moodLevelColor(level: number): string {
  if (level <= 3) return '#bf4a3c';
  if (level <= 6) return '#d69c41';
  return '#4b9b8f';
}

export function moodLevelText(level: number): string {
  if (level <= 3) return '需要照顾';
  if (level <= 6) return '正在恢复';
  return '状态稳定';
}

