import { Button, List, Statistic } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AssessmentCard } from '../components/common/AssessmentCard';
import { EmptyState } from '../components/common/EmptyState';
import { MoodSelector } from '../components/common/MoodSelector';
import { MoodTrendChart } from '../components/common/MoodTrendChart';
import { getAssessments } from '../api/assessment';
import { useAuth } from '../hooks/useAuth';
import { useMoodStats } from '../hooks/useMoodStats';
import { useMoodStore } from '../stores/moodStore';
import type { Assessment } from '../types';
import { useState } from 'react';

export function Dashboard() {
  const { token } = useAuth();
  const { moods, trend, loadMoods, loadTrend, createMood } = useMoodStore();
  const stats = useMoodStats(moods);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  useEffect(() => {
    if (!token) return;
    loadMoods();
    loadTrend();
    getAssessments().then((items) => setAssessments(items.slice(0, 2))).catch(() => setAssessments([]));
  }, [token, loadMoods, loadTrend]);

  return (
    <main className="page">
      <h1 className="page-title">心情花园</h1>
      <p className="page-kicker">用每日情绪、测评和日记把心理状态从模糊感受变成可以观察的线索。</p>

      <section className="grid three" style={{ marginBottom: 18 }}>
        <div className="panel">
          <Statistic title="平均情绪" value={stats.avgMood} suffix="/ 10" />
        </div>
        <div className="panel">
          <Statistic title="记录次数" value={stats.total} />
        </div>
        <div className="panel">
          <Statistic title="主要标签" value={stats.dominantTag} />
        </div>
      </section>

      <section className="grid two">
        <div className="panel">
          <h2>本周情绪曲线</h2>
          {trend.length ? <MoodTrendChart data={trend} /> : <EmptyState title="暂无曲线" description="记录一次心情后会生成趋势。" />}
        </div>
        <div className="panel">
          <h2>快速记录</h2>
          <MoodSelector compact onSubmit={createMood} />
        </div>
      </section>

      <section style={{ marginTop: 18 }} className="panel">
        <div className="toolbar">
          <h2>最新测评推荐</h2>
          <Button>
            <Link to="/assessments">查看全部</Link>
          </Button>
        </div>
        {assessments.length ? (
          <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={assessments}
            renderItem={(assessment) => (
              <List.Item>
                <AssessmentCard assessment={assessment} onStart={() => { location.href = '/assessments'; }} />
              </List.Item>
            )}
          />
        ) : (
          <EmptyState title="暂无测评" description="后端初始化后会写入焦虑和睡眠测评。" />
        )}
      </section>
    </main>
  );
}

