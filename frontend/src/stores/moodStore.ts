import { create } from 'zustand';
import * as moodApi from '../api/mood';
import type { Mood, MoodPayload, MoodTrendPoint } from '../types';

interface MoodState {
  moods: Mood[];
  trend: MoodTrendPoint[];
  loading: boolean;
  loadMoods: () => Promise<void>;
  loadTrend: () => Promise<void>;
  createMood: (payload: MoodPayload) => Promise<void>;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  moods: [],
  trend: [],
  loading: false,
  loadMoods: async () => {
    set({ loading: true });
    try {
      const moods = await moodApi.getMoods();
      set({ moods });
    } finally {
      set({ loading: false });
    }
  },
  loadTrend: async () => {
    const trend = await moodApi.getMoodTrend();
    set({ trend });
  },
  createMood: async (payload) => {
    const mood = await moodApi.createMood(payload);
    set({ moods: [mood, ...get().moods] });
    await get().loadTrend();
  },
}));

