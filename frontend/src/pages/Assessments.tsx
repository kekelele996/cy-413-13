import { Button, Modal, Radio, Select, Space } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getAssessments, submitAssessment } from '../api/assessment';
import { AssessmentCard } from '../components/common/AssessmentCard';
import { EmptyState } from '../components/common/EmptyState';
import { ResultBadge } from '../components/common/ResultBadge';
import { ASSESSMENT_CATEGORY_LABELS, AssessmentCategory } from '../constants/assessment';
import { useAuth } from '../hooks/useAuth';
import type { Assessment, UserAssessment } from '../types';

export function Assessments() {
  const { token } = useAuth();
  const [category, setCategory] = useState<AssessmentCategory | undefined>();
  const [items, setItems] = useState<Assessment[]>([]);
  const [active, setActive] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<UserAssessment | null>(null);

  useEffect(() => {
    if (!token) return;
    getAssessments(category).then(setItems).catch(() => setItems([]));
  }, [token, category]);

  const canSubmit = useMemo(() => active?.questions.every((question) => answers[question.id]) ?? false, [active, answers]);

  const handleSubmit = async () => {
    if (!active) return;
    const submitted = await submitAssessment(active.id, answers);
    setResult(submitted);
  };

  return (
    <main className="page">
      <div className="toolbar">
        <div>
          <h1 className="page-title">心理测评</h1>
          <p className="page-kicker">选择焦虑、抑郁、压力或睡眠测评，完成后生成分数和建议。</p>
        </div>
        <Select
          allowClear
          placeholder="分类筛选"
          style={{ width: 180 }}
          value={category}
          onChange={setCategory}
          options={Object.values(AssessmentCategory).map((value) => ({ value, label: ASSESSMENT_CATEGORY_LABELS[value] }))}
        />
      </div>

      {items.length ? (
        <section className="assessment-grid">
          {items.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onStart={(next) => {
                setActive(next);
                setAnswers({});
                setResult(null);
              }}
            />
          ))}
        </section>
      ) : (
        <EmptyState title="暂无测评" description="请确认数据库初始化脚本已执行。" />
      )}

      <Modal
        open={Boolean(active)}
        title={active?.title}
        onCancel={() => setActive(null)}
        footer={[
          <Button key="cancel" onClick={() => setActive(null)}>关闭</Button>,
          <Button key="submit" type="primary" disabled={!canSubmit} onClick={handleSubmit}>生成报告</Button>,
        ]}
      >
        <Space direction="vertical" size={18} style={{ width: '100%' }}>
          {active?.questions.map((question) => (
            <div key={question.id}>
              <strong>{question.text}</strong>
              <Radio.Group
                style={{ display: 'flex', marginTop: 8 }}
                value={answers[question.id]}
                onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                options={[1, 2, 3, 4, 5].map((value) => ({ value, label: String(value) }))}
              />
            </div>
          ))}
          <ResultBadge result={result} />
        </Space>
      </Modal>
    </main>
  );
}

