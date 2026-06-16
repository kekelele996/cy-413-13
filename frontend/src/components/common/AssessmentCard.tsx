import { Button, Tag } from 'antd';
import { ASSESSMENT_CATEGORY_LABELS } from '../../constants/assessment';
import type { Assessment } from '../../types';

interface Props {
  assessment: Assessment;
  onStart: (assessment: Assessment) => void;
}

export function AssessmentCard({ assessment, onStart }: Props) {
  return (
    <article className="assessment-card">
      <div>
        <Tag color="green">{ASSESSMENT_CATEGORY_LABELS[assessment.category]}</Tag>
      </div>
      <h3>{assessment.title}</h3>
      <p className="muted">{assessment.description}</p>
      <Button type="primary" onClick={() => onStart(assessment)}>
        开始测评
      </Button>
    </article>
  );
}

