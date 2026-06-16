export enum MoodTag {
  HAPPY = 'happy',
  ANXIOUS = 'anxious',
  TIRED = 'tired',
  ANGRY = 'angry',
  CALM = 'calm',
}

export const MOOD_TAG_LABELS: Record<MoodTag, string> = {
  [MoodTag.HAPPY]: '开心',
  [MoodTag.ANXIOUS]: '焦虑',
  [MoodTag.TIRED]: '疲惫',
  [MoodTag.ANGRY]: '愤怒',
  [MoodTag.CALM]: '平静',
};

export const MOOD_LEVEL_LABELS: Record<number, string> = {
  1: '低落',
  2: '沉重',
  3: '紧张',
  4: '波动',
  5: '普通',
  6: '稳定',
  7: '舒展',
  8: '轻盈',
  9: '明亮',
  10: '丰盛',
};

export const MOOD_LOG_TEMPLATE =
  'Mood[user_id={user_id}] create mood_level={mood_level} mood_tags={mood_tags} record_date={record_date}';

