import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, FileText, Calendar, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchNews, updateNews, deleteNews } from 'modules/news/store/newsSlice';
import { fetchWorkers } from 'modules/workers/store/workersSlice';
import { fetchTeams } from 'modules/teams/store/teamsSlice';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { Button, Card, Select, Input, Spinner } from 'modules/shared/components/atoms';
import Modal from 'modules/shared/components/molecules/Modal/Modal';
import NewsFiltersPanel from 'modules/news/components/organisms/NewsFilters/NewsFilters';
import NewsTable from 'modules/news/components/organisms/NewsTable/NewsTable';
import { ROUTES } from 'modules/shared/constants/routes';
import type { NewsFormData, NewsFilters } from 'modules/news/types/news.types';
import type { News, NewsState, TimeType, Worker, NewsType, Team } from 'modules/shared/types/database.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import './NewsListPage.scss';

const NewsListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items: news, status } = useAppSelector((state) => state.news);
  const { workers } = useAppSelector((state) => state.workers);
  const { teams } = useAppSelector((state) => state.teams);
  const { newsTypes } = useAppSelector((state) => state.catalogs);

  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<NewsFilters>({});

  // Edit modal
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<NewsFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchNews(undefined));
    dispatch(fetchWorkers());
    dispatch(fetchTeams());
    dispatch(fetchAllCatalogs());
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchNews(localFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    dispatch(fetchNews(undefined));
  };

  const workerOptions: SelectOption[] = workers.map((w: Worker) => ({
    value: w.id,
    label: `${w.full_name} - ${w.identification}`,
  }));
  const newsTypeOptions: SelectOption[] = newsTypes.map((nt: NewsType) => ({
    value: nt.id,
    label: `${nt.convention} - ${nt.name}`,
  }));
  const teamOptions: SelectOption[] = teams.map((t: Team) => ({
    value: t.id,
    label: `${t.name} - ${t.dependencia?.name || ''}`,
  }));
  const timeTypeOptions: SelectOption[] = [
    { value: 'days', label: 'Días (calendario)' },
    { value: 'hours', label: 'Horas' },
    { value: 'minutes', label: 'Minutos' },
  ];

  // --- State change ---
  const handleStateChange = async (id: string, newState: NewsState) => {
    await dispatch(updateNews({ id, data: { state: newState } }));
  };

  // --- Delete ---
  const handleDelete = async (id: string) => {
    if (window.confirm('¿Está seguro de eliminar esta novedad?')) {
      await dispatch(deleteNews(id));
    }
  };

  // --- Edit modal ---
  const openEditModal = (item: News) => {
    setEditingNews(item);
    setEditFormData({
      worker_id: item.worker_id,
      news_type_id: item.news_type_id,
      description: item.description || '',
      time_type: item.time_type,
      start_date: item.start_date,
      end_date: item.end_date,
      hours: item.hours,
      minutes: item.minutes,
      state: item.state,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;

    setSubmitting(true);
    try {
      await dispatch(updateNews({ id: editingNews.id, data: editFormData })).unwrap();
      setEditingNews(null);
    } catch {
      // handled by redux
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeTypeChange = (type: TimeType) => {
    setEditFormData({
      ...editFormData,
      time_type: type,
      start_date: null,
      end_date: null,
      hours: null,
      minutes: null,
    });
  };

  if (status === 'loading' && news.length === 0) {
    return (
      <div className="news-list__loading">
        <Spinner size="lg" />
        <p>Cargando novedades...</p>
      </div>
    );
  }

  return (
    <div className="news-list">
      {/* Actions */}
      <div className="news-list__top-actions">
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => navigate(ROUTES.NEWS_CREATE)}>
          Nueva Novedad
        </Button>
        <Button
          variant="secondary"
          icon={<Filter size={18} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtros'}
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <NewsFiltersPanel
          filters={localFilters}
          onChange={setLocalFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}

      <Card
        title="Gestión de Novedades"
        subtitle={`${news.length} registradas`}
      >
        <NewsTable
          items={news}
          editable={true}
          onEdit={openEditModal}
          onStateChange={handleStateChange}
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingNews}
        onClose={() => setEditingNews(null)}
        title="Editar Novedad"
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="news-list__edit-form">
          {/* General Info */}
          <div className="news-list__edit-section">
            <h4 className="news-list__edit-section-title">
              <FileText size={18} /> Información General
            </h4>
            <div className="news-list__edit-grid">
              <Select
                label="Trabajador *"
                options={workerOptions}
                value={editFormData.worker_id || ''}
                onChange={(e) => setEditFormData({ ...editFormData, worker_id: e.target.value })}
              />
              <Select
                label="Tipo de Novedad *"
                options={newsTypeOptions}
                value={editFormData.news_type_id || ''}
                onChange={(e) => setEditFormData({ ...editFormData, news_type_id: e.target.value })}
              />
              <Select
                label="Estado"
                options={[
                  { value: 'active', label: 'Activa' },
                  { value: 'completed', label: 'Completada' },
                  { value: 'cancelled', label: 'Cancelada' },
                ]}
                value={editFormData.state || ''}
                onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value as NewsState })}
              />
            </div>
            <div className="news-list__edit-description">
              <label className="input-field__label">Descripción</label>
              <textarea
                className="news-list__edit-textarea"
                rows={3}
                value={editFormData.description || ''}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Descripción de la novedad..."
              />
            </div>
          </div>

          {/* Time */}
          <div className="news-list__edit-section">
            <h4 className="news-list__edit-section-title">
              <Clock size={18} /> Duración
            </h4>
            <Select
              label="Tipo de Tiempo"
              options={timeTypeOptions}
              value={editFormData.time_type || ''}
              onChange={(e) => handleTimeTypeChange(e.target.value as TimeType)}
            />

            {editFormData.time_type === 'days' && (
              <div className="news-list__edit-dates">
                <div className="news-list__edit-date-field">
                  <Calendar size={16} className="news-list__edit-date-icon" />
                  <Input
                    label="Fecha Inicio"
                    type="date"
                    value={editFormData.start_date || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value })}
                  />
                </div>
                <span className="news-list__edit-date-sep">→</span>
                <div className="news-list__edit-date-field">
                  <Calendar size={16} className="news-list__edit-date-icon" />
                  <Input
                    label="Fecha Fin"
                    type="date"
                    value={editFormData.end_date || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, end_date: e.target.value })}
                  />
                </div>
              </div>
            )}
            {editFormData.time_type === 'hours' && (
              <div className="news-list__edit-dates">
                <Input
                  label="Fecha de la ausencia"
                  type="date"
                  value={editFormData.start_date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value, end_date: e.target.value })}
                />
                <Input
                  label="Horas"
                  type="number"
                  min={1}
                  max={8}
                  value={editFormData.hours?.toString() || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, hours: Number(e.target.value) || null })}
                />
              </div>
            )}
            {editFormData.time_type === 'minutes' && (
              <div className="news-list__edit-dates">
                <Input
                  label="Fecha de la ausencia"
                  type="date"
                  value={editFormData.start_date || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, start_date: e.target.value, end_date: e.target.value })}
                />
                <Input
                  label="Minutos"
                  type="number"
                  min={1}
                  max={480}
                  value={editFormData.minutes?.toString() || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, minutes: Number(e.target.value) || null })}
                />
              </div>
            )}
          </div>

          <div className="news-list__edit-actions">
            <Button variant="danger" size="sm" type="button" onClick={() => { if (editingNews) handleDelete(editingNews.id); setEditingNews(null); }}>
              Eliminar
            </Button>
            <div className="news-list__edit-actions-right">
              <Button variant="ghost" type="button" onClick={() => setEditingNews(null)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" loading={submitting}>
                Guardar Cambios
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewsListPage;
