import { Edit2, CheckCircle, XCircle, RotateCcw, Newspaper } from 'lucide-react';
import { Badge } from 'modules/shared/components/atoms';
import EmptyState from 'modules/shared/components/molecules/EmptyState/EmptyState';
import type { News, NewsState } from 'modules/shared/types/database.types';
import './NewsTable.scss';

interface NewsTableProps {
  items: News[];
  editable?: boolean;
  onEdit?: (item: News) => void;
  onStateChange?: (id: string, newState: NewsState) => void;
}

const NewsTable = ({ items, editable = false, onEdit, onStateChange }: NewsTableProps) => {
  const getStateBadge = (state: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = {
      active: 'warning',
      completed: 'success',
      cancelled: 'danger',
    };
    const labels: Record<string, string> = {
      active: 'Activa',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return <Badge variant={variants[state] || 'neutral'}>{labels[state] || state}</Badge>;
  };

  const formatTimeDisplay = (item: News) => {
    if (item.time_type === 'days') {
      return `${item.start_date} → ${item.end_date}`;
    }
    if (item.time_type === 'hours') {
      return `${item.start_date || ''} — ${item.hours}h`;
    }
    return `${item.start_date || ''} — ${item.minutes} min`;
  };

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Newspaper size={48} />}
        title="Sin novedades"
        description="No se encontraron novedades con los criterios actuales. Ajusta los filtros o crea una nueva."
      />
    );
  }

  return (
    <div className="news-table__wrapper">
      <table className="news-table">
        <thead>
          <tr>
            <th>Trabajador</th>
            <th>Equipo</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Tiempo</th>
            <th>Estado</th>
            <th>Registro</th>
            {editable && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
              <tr key={item.id}>
                <td className="news-table__worker">{item.worker?.full_name || '-'}</td>
                <td>
                  <Badge variant="neutral">{item.worker?.team?.name || '-'}</Badge>
                </td>
                <td>
                  <Badge variant="primary">
                    {item.news_type?.convention || '-'} - {item.news_type?.name || '-'}
                  </Badge>
                </td>
                <td className="news-table__desc">{item.description || '-'}</td>
                <td className="news-table__time">{formatTimeDisplay(item)}</td>
                <td>{getStateBadge(item.state)}</td>
                <td className="news-table__date">
                  {new Date(item.created_at).toLocaleDateString('es-CO')}
                </td>
                {editable && (
                  <td>
                    <div className="news-table__actions">
                      <button
                        className="news-table__action-btn"
                        onClick={() => onEdit?.(item)}
                        title="Editar"
                        aria-label="Editar"
                      >
                        <Edit2 size={15} />
                      </button>
                      {item.state === 'active' && (
                        <>
                          <button
                            className="news-table__action-btn news-table__action-btn--success"
                            onClick={() => onStateChange?.(item.id, 'completed')}
                            title="Completar"
                            aria-label="Completar"
                          >
                            <CheckCircle size={15} />
                          </button>
                          <button
                            className="news-table__action-btn news-table__action-btn--danger"
                            onClick={() => onStateChange?.(item.id, 'cancelled')}
                            title="Cancelar"
                            aria-label="Cancelar"
                          >
                            <XCircle size={15} />
                          </button>
                        </>
                      )}
                      {(item.state === 'completed' || item.state === 'cancelled') && (
                        <button
                          className="news-table__action-btn news-table__action-btn--warning"
                          onClick={() => onStateChange?.(item.id, 'active')}
                          title="Reactivar"
                          aria-label="Reactivar"
                        >
                          <RotateCcw size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewsTable;
