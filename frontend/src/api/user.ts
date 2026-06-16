import { request } from '../utils/request';
import type { AuthToken, ProfileReport, User } from '../types';

export function register(payload: {
  email: string;
  password: string;
  nickname: string;
  avatar?: string;
  birth_date?: string;
  gender?: string;
}) {
  return request<AuthToken>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<AuthToken>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request<User>('/users/me');
}

export function updateMe(payload: Partial<User>) {
  return request<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export function getProfileReport() {
  return request<ProfileReport>('/users/report');
}

