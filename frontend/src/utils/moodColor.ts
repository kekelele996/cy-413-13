import { MoodTag } from '../constants/mood';
import type { MoodTagMeta } from '../types';

const STATIC_COLORS: Record<string, string> = {
  [MoodTag.HAPPY]: '#f2a541',
  [MoodTag.ANXIOUS]: '#d96c75',
  [MoodTag.TIRED]: '#7e8aa2',
  [MoodTag.ANGRY]: '#bf4a3c',
  [MoodTag.CALM]: '#4b9b8f',
};

export const DEFAULT_COLOR_PALETTE = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#64748b',
];

export const MOOD_TAG_COLORS = STATIC_COLORS;

export function pickColorByIndex(index: number): string {
  return DEFAULT_COLOR_PALETTE[index % DEFAULT_COLOR_PALETTE.length];
}

let dynamicMetaMap: Record<string, MoodTagMeta> = {};

export function setMoodTagMeta(metaList: MoodTagMeta[]): void {
  dynamicMetaMap = {};
  for (const meta of metaList) {
    dynamicMetaMap[meta.tag_key] = meta;
  }
}

export function getMoodTagMeta(tagKey: string): MoodTagMeta | undefined {
  return dynamicMetaMap[tagKey];
}

export function getTagColor(tagKey: string): string {
  const meta = dynamicMetaMap[tagKey];
  if (meta?.color) return meta.color;
  if (STATIC_COLORS[tagKey]) return STATIC_COLORS[tagKey];
  let hash = 0;
  for (let i = 0; i < tagKey.length; i++) {
    hash = (hash << 5) - hash + tagKey.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % DEFAULT_COLOR_PALETTE.length;
  return DEFAULT_COLOR_PALETTE[index];
}

export function getTagLabel(tagKey: string): string {
  const meta = dynamicMetaMap[tagKey];
  if (meta?.label) return meta.label;
  if (tagKey === MoodTag.HAPPY) return '开心';
  if (tagKey === MoodTag.ANXIOUS) return '焦虑';
  if (tagKey === MoodTag.TIRED) return '疲惫';
  if (tagKey === MoodTag.ANGRY) return '愤怒';
  if (tagKey === MoodTag.CALM) return '平静';
  return tagKey.replace(/_/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
}

export function getAllTagMetaList(): MoodTagMeta[] {
  return Object.values(dynamicMetaMap);
}

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
