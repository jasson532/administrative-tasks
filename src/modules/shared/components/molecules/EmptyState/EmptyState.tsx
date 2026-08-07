import type { ReactNode } from 'react';
import { FileX } from 'lucide-react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon || <FileX size={48} />}
      </div>
      <h4 className="empty-state__title">{title}</h4>
      {description && <p className="empty-state__description">{description}</p>}
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
};

export default EmptyState;
