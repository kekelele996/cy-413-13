import { Sprout } from 'lucide-react';

interface Props {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: Props) {
  return (
    <div className="empty-state">
      <div>
        <Sprout size={32} />
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

