import type { Journal, JournalPayload } from '../types';
import { request } from '../utils/request';

export function getJournals(moodLevel?: number) {
  return request<Journal[]>(`/journals${moodLevel ? `?mood_level=${moodLevel}` : ''}`);
}

export function createJournal(payload: JournalPayload) {
  return request<Journal>('/journals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateJournal(id: number, payload: Partial<JournalPayload>) {
  return request<Journal>(`/journals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteJournal(id: number) {
  return request<{ message: string }>(`/journals/${id}`, {
    method: 'DELETE',
  });
}

