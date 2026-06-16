import { useMemo } from 'react';
import { MoodTag } from '../constants/mood';
import type { Mood } from '../types';

export function useMoodStats(moods: Mood[]) {
  return useMemo(() => {
    const avg = moods.length ? moods.reduce((sum, mood) => sum + mood.mood_level, 0) / moods.length : 0;
    const tagCounts = moods.reduce<Record<string, number>>((acc, mood) => {
      mood.mood_tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});
    const dominantTag = (Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || MoodTag.CALM) as MoodTag;

    return {
      avgMood: Number(avg.toFixed(1)),
      total: moods.length,
      dominantTag,
      tagCounts,
    };
  }, [moods]);
}

