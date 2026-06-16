import { Badge, Tag } from 'antd';
import type { UserAssessment } from '../../types';

interface Props {
  result?: UserAssessment | null;
}

export function ResultBadge({ result }: Props) {
  if (!result) {
    return <Badge status="default" text="尚未生成报告" />;
  }

  const color = result.result_level === 'high' ? 'red' : result.result_level === 'medium' ? 'gold' : 'green';
  return (
    <div>
      <Tag color={color}>得分 {result.score}</Tag>
      <span>{result.suggestion}</span>
    </div>
  );
}

