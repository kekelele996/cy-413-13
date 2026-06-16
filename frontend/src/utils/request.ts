import { message } from 'antd';
import { useAuthStore } from '../stores/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export class RequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    detail: string,
  ) {
    super(detail);
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ code: 'HTTP_ERROR', message: response.statusText }));
    const detail = payload.detail || payload.message || response.statusText;
    message.error(String(detail));
    throw new RequestError(response.status, payload.code || 'HTTP_ERROR', String(detail));
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

