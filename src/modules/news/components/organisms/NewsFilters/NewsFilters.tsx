import { useAppSelector } from 'modules/shared/store/hooks';
import { Button, Card, MultiSelect } from 'modules/shared/components/atoms';
import type { NewsFilters as NewsFiltersType } from 'modules/news/types/news.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import type { Worker, NewsType, Team } from 'modules/shared/types/database.types';
import './NewsFilters.scss';

interface NewsFiltersProps {
  filters: NewsFiltersType;
  onChange: (filters: NewsFiltersType) => void;
  onApply: () => void;
  onClear: () => void;
}

const NewsFilters = ({ filters, onChange, onApply, onClear }: NewsFiltersProps) => {
  const { workers } = useAppSelector((state) => state.workers);
  const { teams } = useAppSelector((state) => state.teams);
  const { newsTypes } = useAppSelector((state) => state.catalogs);

  const workerOptions: SelectOption[] = workers.map((w: Worker) => ({ value: w.id, label: w.full_name }));
  const newsTypeOptions: SelectOption[] = newsTypes.map((nt: NewsType) => ({ value: nt.id, label: `${nt.convention} - ${nt.name}` }));
  const teamOptions: SelectOption[] = teams.map((t: Team) => ({ value: t.id, label: `${t.name} - ${t.dependencia?.name || ''}` }));
  const stateOptions: SelectOption[] = [
    { value: 'active', label: 'Activa' },
    { value: 'completed', label: 'Completada' },
    { value: 'cancelled', label: 'Cancelada' },
  ];

  return (
    <Card className="news-filters">
      <div className="news-filters__grid">
        <MultiSelect
          label="Trabajador"
          options={workerOptions}
          value={filters.worker_ids || []}
          onChange={(values) => onChange({ ...filters, worker_ids: values.length > 0 ? values : undefined })}
          placeholder="Todos"
        />
        <MultiSelect
          label="Tipo"
          options={newsTypeOptions}
          value={filters.news_type_ids || []}
          onChange={(values) => onChange({ ...filters, news_type_ids: values.length > 0 ? values : undefined })}
          placeholder="Todos"
        />
        <MultiSelect
          label="Estado"
          options={stateOptions}
          value={filters.states || []}
          onChange={(values) => onChange({ ...filters, states: values.length > 0 ? values as NewsFiltersType['states'] : undefined })}
          placeholder="Todos"
        />
        <MultiSelect
          label="Equipo"
          options={teamOptions}
          value={filters.team_ids || []}
          onChange={(values) => onChange({ ...filters, team_ids: values.length > 0 ? values : undefined })}
          placeholder="Todos"
        />
        <div className="news-filters__dates">
          <div className="input-field">
            <label className="input-field__label">Desde</label>
            <input
              type="date"
              className="input-field__input"
              value={filters.start_date || ''}
              onChange={(e) => onChange({ ...filters, start_date: e.target.value || undefined })}
            />
          </div>
          <div className="input-field">
            <label className="input-field__label">Hasta</label>
            <input
              type="date"
              className="input-field__input"
              value={filters.end_date || ''}
              onChange={(e) => onChange({ ...filters, end_date: e.target.value || undefined })}
            />
          </div>
        </div>
      </div>
      <div className="news-filters__actions">
        <Button variant="primary" size="sm" onClick={onApply}>
          Aplicar Filtros
        </Button>
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar
        </Button>
      </div>
    </Card>
  );
};

export default NewsFilters;
