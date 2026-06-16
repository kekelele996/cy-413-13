import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Slider, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { MOOD_LEVEL_LABELS } from '../../constants/mood';
import type { MoodPayload } from '../../types';
import { today } from '../../utils/dateRange';
import { getTagColor, getTagLabel } from '../../utils/moodColor';
import { useMoodStore } from '../../stores/moodStore';

interface Props {
  compact?: boolean;
  onSubmit: (payload: MoodPayload) => Promise<void> | void;
}

function sanitizeTagKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\u4e00-\u9fff\u3400-\u4dbfa-z0-9_]/g, '')
    .slice(0, 64);
}

function isLabelValid(label: string): boolean {
  const trimmed = label.trim();
  return trimmed.length > 0 && trimmed.length <= 64;
}

export function MoodSelector({ compact = false, onSubmit }: Props) {
  const [level, setLevel] = useState(7);
  const [selectedTagKeys, setSelectedTagKeys] = useState<string[]>(['calm']);
  const [note, setNote] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { allTags, loadAllTags, tagsLoading } = useMoodStore();

  useEffect(() => {
    loadAllTags();
  }, [loadAllTags]);

  const toggleTag = (tagKey: string) => {
    setSelectedTagKeys((current) =>
      current.includes(tagKey)
        ? current.filter((k) => k !== tagKey)
        : [...current, tagKey]
    );
  };

  const addCustomTagFromInput = () => {
    const raw = customInput.trim();
    if (!isLabelValid(raw)) return;
    const tagKey = sanitizeTagKey(raw);
    if (!tagKey) return;
    if (selectedTagKeys.includes(tagKey)) {
      setCustomInput('');
      return;
    }
    const existingKeys = new Set(allTags.map((t) => t.tag_key));
    if (!existingKeys.has(tagKey)) {
      const label = raw.slice(0, 64);
      useMoodStore.getState().createCustomTag({ tag_key: tagKey, label });
    }
    setSelectedTagKeys((current) =>
      current.includes(tagKey) ? current : [...current, tagKey]
    );
    setCustomInput('');
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        mood_level: level,
        mood_tags: selectedTagKeys,
        note: note || undefined,
        record_date: today(),
      });
      setNote('');
    } finally {
      setSubmitting(false);
    }
  };

  const tagList = allTags.length ? allTags : [];

  return (
    <div className="mood-selector">
      <div>
        <strong>情绪等级 {level}</strong>
        <span className="muted"> · {MOOD_LEVEL_LABELS[level]}</span>
        <Slider min={1} max={10} value={level} onChange={setLevel} />
      </div>
      <div className="mood-tag-row">
        {tagsLoading && <span className="muted">加载标签中...</span>}
        {tagList.map((tag) => (
          <Tag.CheckableTag
            key={tag.tag_key}
            checked={selectedTagKeys.includes(tag.tag_key)}
            onChange={() => toggleTag(tag.tag_key)}
            style={{
              borderColor: tag.color,
              color: selectedTagKeys.includes(tag.tag_key) ? '#fff' : tag.color,
              background: selectedTagKeys.includes(tag.tag_key) ? tag.color : 'transparent',
              padding: '6px 10px',
            }}
          >
            {getTagLabel(tag.tag_key)}
            {!tag.is_system && <span style={{ marginLeft: 4, opacity: 0.7 }}>· 自定义</span>}
          </Tag.CheckableTag>
        ))}
      </div>

      <div className="mood-tag-input-row" style={{ marginTop: 12 }}>
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          placeholder="输入自定义标签后按回车添加（如：加班、健身、独处）"
          onPressEnter={addCustomTagFromInput}
          style={{ flex: 1 }}
          maxLength={64}
        />
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={addCustomTagFromInput}
          style={{ marginLeft: 8 }}
        >
          添加标签
        </Button>
      </div>

      {!compact && (
        <Input.TextArea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="记录此刻的身体感受或触发事件"
          style={{ marginTop: 12 }}
        />
      )}
      <Button
        type="primary"
        onClick={handleSubmit}
        loading={submitting}
        style={{ marginTop: 12 }}
      >
        记录心情
      </Button>
    </div>
  );
}
