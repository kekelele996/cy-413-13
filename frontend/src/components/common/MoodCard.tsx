import type { ReactNode } from 'react';
import { Tag } from 'antd';
import { MOOD_LEVEL_LABELS, MOOD_TAG_LABELS } from '../../constants/mood';
import type { Mood } from '../../types';
import { displayDate } from '../../utils/dateRange';
import { moodLevelColor, MOOD_TAG_COLORS } from '../../utils/moodColor';

interface Props {
  mood: Mood;
  footer?: ReactNode;
}

export function MoodCard({ mood, footer }: Props) {
  return (
    <article className="mood-card">
      <div className="mood-card-head">
        <div>
          <strong>{displayDate(mood.record_date)}</strong>
          <div className="muted">等级 {mood.mood_level} · {MOOD_LEVEL_LABELS[mood.mood_level]}</div>
        </div>
        <div>
          {mood.mood_tags.map((tag) => (
            <Tag key={tag} color={MOOD_TAG_COLORS[tag]}>
              {MOOD_TAG_LABELS[tag]}
            </Tag>
          ))}
        </div>
      </div>
      {mood.note && <p>{mood.note}</p>}
      <div className="tone-strip" style={{ background: moodLevelColor(mood.mood_level) }} />
      {footer}
    </article>
  );
}
