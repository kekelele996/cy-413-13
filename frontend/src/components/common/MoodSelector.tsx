import { Button, Input, Slider, Tag } from 'antd';
import { useState } from 'react';
import { MOOD_LEVEL_LABELS, MOOD_TAG_LABELS, MoodTag } from '../../constants/mood';
import type { MoodPayload } from '../../types';
import { today } from '../../utils/dateRange';
import { MOOD_TAG_COLORS } from '../../utils/moodColor';

interface Props {
  compact?: boolean;
  onSubmit: (payload: MoodPayload) => Promise<void> | void;
}

export function MoodSelector({ compact = false, onSubmit }: Props) {
  const [level, setLevel] = useState(7);
  const [tags, setTags] = useState<MoodTag[]>([MoodTag.CALM]);
  const [note, setNote] = useState('');

  const toggleTag = (tag: MoodTag) => {
    setTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  };

  return (
    <div className="mood-selector">
      <div>
        <strong>情绪等级 {level}</strong>
        <span className="muted"> · {MOOD_LEVEL_LABELS[level]}</span>
        <Slider min={1} max={10} value={level} onChange={setLevel} />
      </div>
      <div className="mood-tag-row">
        {Object.values(MoodTag).map((tag) => (
          <Tag.CheckableTag
            key={tag}
            checked={tags.includes(tag)}
            onChange={() => toggleTag(tag)}
            style={{
              borderColor: MOOD_TAG_COLORS[tag],
              color: tags.includes(tag) ? '#fff' : MOOD_TAG_COLORS[tag],
              background: tags.includes(tag) ? MOOD_TAG_COLORS[tag] : 'transparent',
              padding: '6px 10px',
            }}
          >
            {MOOD_TAG_LABELS[tag]}
          </Tag.CheckableTag>
        ))}
      </div>
      {!compact && <Input.TextArea rows={3} value={note} onChange={(event) => setNote(event.target.value)} placeholder="记录此刻的身体感受或触发事件" />}
      <Button
        type="primary"
        onClick={() => onSubmit({ mood_level: level, mood_tags: tags, note, record_date: today() })}
      >
        记录心情
      </Button>
    </div>
  );
}

