import type { AssessmentCategory } from '../constants/assessment';
import type { MoodTag } from '../constants/mood';

export interface User {
  id: number;
  email: string;
  nickname: string;
  avatar?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  role: 'admin' | 'member' | 'guest';
  created_at: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Mood {
  id: number;
  user_id: number;
  mood_level: number;
  mood_tags: string[];
  note?: string | null;
  record_date: string;
  created_at: string;
}

export interface MoodPayload {
  mood_level: number;
  mood_tags: string[];
  note?: string;
  record_date: string;
}

export interface MoodTrendPoint {
  date: string;
  mood_level: number;
  dominant_tag: string;
}

export interface UserMoodTag {
  id: number;
  user_id: number;
  tag_key: string;
  label: string;
  color: string;
  created_at: string;
}

export interface UserMoodTagWithStats extends UserMoodTag {
  usage_count: number;
}

export interface SystemMoodTagMeta {
  tag_key: string;
  label: string;
  color: string;
  usage_count: number;
  is_system: boolean;
}

export interface AllMoodTagsResponse {
  system_tags: SystemMoodTagMeta[];
  custom_tags: UserMoodTagWithStats[];
}

export interface UserMoodTagCreatePayload {
  tag_key: string;
  label: string;
  color?: string;
}

export interface UserMoodTagUpdatePayload {
  label?: string;
  color?: string;
}

export interface MoodTagMeta {
  tag_key: string;
  label: string;
  color: string;
  is_system: boolean;
  usage_count?: number;
  id?: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  category: AssessmentCategory;
  questions: AssessmentQuestion[];
  scoring_rule: Record<string, { max: number; text: string }>;
  created_at: string;
}

export interface UserAssessment {
  id: number;
  user_id: number;
  assessment_id: number;
  answers: Record<string, number>;
  score: number;
  result_level: 'low' | 'medium' | 'high' | string;
  suggestion: string;
  created_at: string;
}

export interface Journal {
  id: number;
  user_id: number;
  title: string;
  content: string;
  mood_level: number;
  weather?: string | null;
  is_private: boolean;
  created_at: string;
}

export interface JournalPayload {
  title: string;
  content: string;
  mood_level: number;
  weather?: string;
  is_private: boolean;
}

export interface ProfileReport {
  user: User;
  avg_mood: number;
  mood_count: number;
  assessment_count: number;
  journal_count: number;
}

