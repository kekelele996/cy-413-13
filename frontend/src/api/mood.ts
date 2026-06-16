import type { Mood, MoodPayload, MoodTrendPoint } from '../types';
import { request } from '../utils/request';

export function getMoods(params?: { start_date?: string; end_date?: string }) {
  const search = new URLSearchParams();
  if (params?.start_date) search.set('start_date', params.start_date);
  if (params?.end_date) search.set('end_date', params.end_date);
  return request<Mood[]>(`/moods${search.size ? `?${search}` : ''}`);
}

export function createMood(payload: MoodPayload) {
  return request<Mood>('/moods', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateMood(id: number, payload: Partial<MoodPayload>) {
  return request<Mood>(`/moods/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteMood(id: number) {
  return request<{ message: string }>(`/moods/${id}`, {
    method: 'DELETE',
  });
}

export function getMoodTrend() {
  return request<MoodTrendPoint[]>('/moods/stats/trend');
}

