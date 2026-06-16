import { create } from 'zustand';
import * as moodApi from '../api/mood';
import * as tagApi from '../api/userMoodTag';
import type {
  AllMoodTagsResponse,
  Mood,
  MoodPayload,
  MoodTagMeta,
  MoodTrendPoint,
} from '../types';
import { setMoodTagMeta } from '../utils/moodColor';

interface MoodState {
  moods: Mood[];
  trend: MoodTrendPoint[];
  allTags: MoodTagMeta[];
  systemTags: MoodTagMeta[];
  customTags: MoodTagMeta[];
  loading: boolean;
  tagsLoading: boolean;
  loadMoods: () => Promise<void>;
  loadTrend: () => Promise<void>;
  loadAllTags: () => Promise<void>;
  createMood: (payload: MoodPayload) => Promise<void>;
  createCustomTag: (payload: { tag_key: string; label: string; color?: string }) => Promise<void>;
  updateCustomTag: (id: number, payload: { label?: string; color?: string }) => Promise<void>;
  deleteCustomTag: (id: number) => Promise<void>;
}

function flattenTags(resp: AllMoodTagsResponse): {
  all: MoodTagMeta[];
  system: MoodTagMeta[];
  custom: MoodTagMeta[];
} {
  const system: MoodTagMeta[] = resp.system_tags.map((t) => ({
    tag_key: t.tag_key,
    label: t.label,
    color: t.color,
    is_system: true,
    usage_count: t.usage_count,
  }));
  const custom: MoodTagMeta[] = resp.custom_tags.map((t) => ({
    id: t.id,
    tag_key: t.tag_key,
    label: t.label,
    color: t.color,
    is_system: false,
    usage_count: t.usage_count,
  }));
  return { all: [...system, ...custom], system, custom };
}

export const useMoodStore = create<MoodState>((set, get) => ({
  moods: [],
  trend: [],
  allTags: [],
  systemTags: [],
  customTags: [],
  loading: false,
  tagsLoading: false,
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
  loadAllTags: async () => {
    set({ tagsLoading: true });
    try {
      const resp = await tagApi.getAllMoodTags();
      const { all, system, custom } = flattenTags(resp);
      setMoodTagMeta(all);
      set({ allTags: all, systemTags: system, customTags: custom });
    } finally {
      set({ tagsLoading: false });
    }
  },
  createMood: async (payload) => {
    const mood = await moodApi.createMood(payload);
    set({ moods: [mood, ...get().moods] });
    await get().loadTrend();
    await get().loadAllTags();
  },
  createCustomTag: async (payload) => {
    await tagApi.createUserMoodTag(payload);
    await get().loadAllTags();
  },
  updateCustomTag: async (id, payload) => {
    await tagApi.updateUserMoodTag(id, payload);
    await get().loadAllTags();
  },
  deleteCustomTag: async (id) => {
    await tagApi.deleteUserMoodTag(id);
    await get().loadAllTags();
  },
}));
