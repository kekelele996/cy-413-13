import { Button, DatePicker, Form, Input, Space } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { MoodCard } from '../components/common/MoodCard';
import { MoodSelector } from '../components/common/MoodSelector';
import { useAuth } from '../hooks/useAuth';
import { useMoodStore } from '../stores/moodStore';

export function Moods() {
  const { token } = useAuth();
  const { moods, loadMoods, createMood } = useMoodStore();

  useEffect(() => {
    if (token) loadMoods();
  }, [token, loadMoods]);

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
          <h2>日期筛选</h2>
          <Form layout="vertical">
            <Form.Item label="记录日期">
              <DatePicker defaultValue={dayjs()} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="关键词">
              <Input placeholder="按备注检索" />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={() => loadMoods()}>筛选</Button>
              <Button onClick={() => loadMoods()}>重置</Button>
            </Space>
          </Form>
        </div>
      </section>

      <section style={{ marginTop: 18 }} className="timeline-list">
        {moods.length ? moods.map((mood) => <MoodCard key={mood.id} mood={mood} />) : <EmptyState title="还没有情绪记录" description="从上方选择等级和标签开始。" />}
      </section>
    </main>
  );
}

