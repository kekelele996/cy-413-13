import { Button, DatePicker, Form, Input, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { MoodCard } from '../components/common/MoodCard';
import { MoodSelector } from '../components/common/MoodSelector';
import { useAuth } from '../hooks/useAuth';
import { useMoodStore } from '../stores/moodStore';
import { getTagColor, getTagLabel } from '../utils/moodColor';

export function Moods() {
  const { token } = useAuth();
  const { moods, loadMoods, createMood, allTags, loadAllTags } = useMoodStore();
  const [keyword, setKeyword] = useState('');
  const [selectedTagKeys, setSelectedTagKeys] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  useEffect(() => {
    if (!token) return;
    loadMoods();
    loadAllTags();
  }, [token, loadMoods, loadAllTags]);

  const filteredMoods = useMemo(() => {
    let list = moods;
    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day');
      const end = dateRange[1].endOf('day');
      list = list.filter((m) => {
        const d = dayjs(m.record_date);
        return (d.isSame(start) || d.isAfter(start)) && (d.isSame(end) || d.isBefore(end));
      });
    }
    if (selectedTagKeys.length) {
      list = list.filter((m) => m.mood_tags.some((t) => selectedTagKeys.includes(t)));
    }
    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      list = list.filter(
        (m) => m.note && m.note.toLowerCase().includes(kw)
      );
    }
    return list;
  }, [moods, dateRange, selectedTagKeys, keyword]);

  const handleReset = () => {
    setKeyword('');
    setSelectedTagKeys([]);
    setDateRange(null);
    loadMoods();
  };

  const tagOptions = allTags.map((t) => ({
    value: t.tag_key,
    label: (
      <span>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: 2,
            background: t.color,
            marginRight: 6,
          }}
        />
        {getTagLabel(t.tag_key)}
        {!t.is_system && <span style={{ marginLeft: 4, opacity: 0.6 }}>（自定义）</span>}
      </span>
    ),
  }));

  return (
    <main className="page">
      <h1 className="page-title">情绪记录</h1>
      <p className="page-kicker">记录情绪等级、触发标签和当下备注，让趋势分析保留足够上下文。</p>
      <section className="grid two">
        <div className="panel">
          <h2>新增 / 编辑情绪</h2>
          <MoodSelector onSubmit={createMood} />
        </div>
        <div className="panel">
          <h2>筛选与检索</h2>
          <Form layout="vertical">
            <Form.Item label="记录日期">
              <DatePicker.RangePicker
                value={dateRange as any}
                onChange={(v) => setDateRange(v as any)}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="情绪标签">
              <Select
                mode="multiple"
                allowClear
                placeholder="按标签筛选，可多选"
                value={selectedTagKeys}
                onChange={setSelectedTagKeys}
                options={tagOptions}
                style={{ width: '100%' }}
                tagRender={(props) => {
                  const { label, value, closable, onClose } = props;
                  return (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        background: getTagColor(value as string),
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: 4,
                        marginInlineEnd: 4,
                        marginBlock: 2,
                        fontSize: 12,
                      }}
                    >
                      <span>{label}</span>
                      {closable && (
                        <span
                          onClick={onClose}
                          style={{ cursor: 'pointer', opacity: 0.8, marginLeft: 2 }}
                          aria-label="close"
                        >
                          ×
                        </span>
                      )}
                    </span>
                  );
                }}
              />
            </Form.Item>
            <Form.Item label="关键词">
              <Input
                placeholder="按备注检索"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => loadMoods()}>筛选</Button>
              <Button onClick={handleReset}>重置</Button>
            </Space>
          </Form>
        </div>
      </section>

      <section style={{ marginTop: 18 }} className="timeline-list">
        {filteredMoods.length ? (
          filteredMoods.map((mood) => <MoodCard key={mood.id} mood={mood} />)
        ) : (
          <EmptyState
            title={moods.length ? '没有符合条件的记录' : '还没有情绪记录'}
            description={moods.length ? '试试调整筛选条件。' : '从上方选择等级和标签开始。'}
          />
        )}
      </section>
    </main>
  );
}
