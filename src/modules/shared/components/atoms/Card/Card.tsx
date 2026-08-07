import type { ReactNode } from 'react';
import './Card.scss';

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
  padding?: boolean;
}

const Card = ({ children, title, subtitle, actions, className = '', padding = true }: CardProps) => {
  return (
    <div className={`card ${padding ? 'card--padded' : ''} ${className}`}>
      {(title || actions) && (
        <div className="card__header">
          <div className="card__header-text">
            {title && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </div>
      )}
      <div className="card__body">{children}</div>
    </div>
  );
};

export default Card;
