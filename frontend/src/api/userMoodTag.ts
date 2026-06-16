import type {
  AllMoodTagsResponse,
  UserMoodTag,
  UserMoodTagCreatePayload,
  UserMoodTagUpdatePayload,
  UserMoodTagWithStats,
} from '../types';
import { request } from '../utils/request';

export function getUserMoodTags() {
  return request<UserMoodTagWithStats[]>('/mood-tags');
}

export function getAllMoodTags() {
  return request<AllMoodTagsResponse>('/mood-tags/all');
}

export function createUserMoodTag(payload: UserMoodTagCreatePayload) {
  return request<UserMoodTag>('/mood-tags', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateUserMoodTag(id: number, payload: UserMoodTagUpdatePayload) {
  return request<UserMoodTag>(`/mood-tags/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function deleteUserMoodTag(id: number) {
  return request<{ message: string }>(`/mood-tags/${id}`, {
    method: 'DELETE',
  });
}
