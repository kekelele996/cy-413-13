import type { Assessment, UserAssessment } from '../types';
import type { AssessmentCategory } from '../constants/assessment';
import { request } from '../utils/request';

export function getAssessments(category?: AssessmentCategory) {
  return request<Assessment[]>(`/assessments${category ? `?category=${category}` : ''}`);
}

export function submitAssessment(id: number, answers: Record<string, number>) {
  return request<UserAssessment>(`/assessments/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers }),
  });
}
