import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, Calendar, FileText } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchWorkers } from 'modules/workers/store/workersSlice';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { createNews } from 'modules/news/store/newsSlice';
import { showToast } from 'modules/shared/store/slices/uiSlice';
import { Button, Card, Input, Select, SearchSelect, Spinner } from 'modules/shared/components/atoms';
import { ROUTES } from 'modules/shared/constants/routes';
import type { NewsFormData } from 'modules/news/types/news.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import type { TimeType, Worker, NewsType } from 'modules/shared/types/database.types';
import './NewsPage.scss';

const initialFormData: NewsFormData = {
  state: 'active',
  worker_id: '',
  news_type_id: '',
  description: '',
  time_type: 'days',
  start_date: null,
  end_date: null,
  hours: null,
  minutes: null,
};

const NewsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { workers } = useAppSelector((state) => state.workers);
  const { newsTypes } = useAppSelector((state) => state.catalogs);
  const catalogsStatus = useAppSelector((state) => state.catalogs.status);

  const [formData, setFormData] = useState<NewsFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewsFormData, string>>>({});

  useEffect(() => {
    dispatch(fetchWorkers());
    dispatch(fetchAllCatalogs());
  }, [dispatch]);

  const workerOptions: SelectOption[] = workers.map((w: Worker) => ({
    value: w.id,
    label: `${w.full_name} - ${w.identification}`,
  }));

  const newsTypeOptions: SelectOption[] = newsTypes.map((nt: NewsType) => ({
    value: nt.id,
    label: `${nt.convention} - ${nt.name}`,
  }));

  const timeTypeOptions: SelectOption[] = [
    { value: 'days', label: 'Días (calendario)' },
    { value: 'hours', label: 'Horas' },
    { value: 'minutes', label: 'Minutos' },
  ];

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof NewsFormData, string>> = {};

    if (!formData.worker_id) newErrors.worker_id = 'Seleccione un trabajador';
    if (!formData.news_type_id) newErrors.news_type_id = 'Seleccione un tipo de novedad';

    if (formData.time_type === 'days') {
      if (!formData.start_date) newErrors.start_date = 'Seleccione fecha de inicio';
      if (!formData.end_date) newErrors.end_date = 'Seleccione fecha de fin';
      if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
        newErrors.end_date = 'La fecha fin debe ser posterior a la fecha inicio';
      }
    } else if (formData.time_type === 'hours') {
      if (!formData.start_date) newErrors.start_date = 'Seleccione la fecha de la ausencia';
      if (!formData.hours || formData.hours <= 0) newErrors.hours = 'Ingrese las horas';
    } else if (formData.time_type === 'minutes') {
      if (!formData.start_date) newErrors.start_date = 'Seleccione la fecha de la ausencia';
      if (!formData.minutes || formData.minutes <= 0) newErrors.minutes = 'Ingrese los minutos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await dispatch(createNews(formData)).unwrap();
      dispatch(showToast({ message: 'Novedad registrada exitosamente', type: 'success' }));
      navigate(ROUTES.DASHBOARD);
    } catch {
      dispatch(showToast({ message: 'Error al crear la novedad. Intente nuevamente.', type: 'error' }));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeTypeChange = (type: TimeType) => {
    setFormData({
      ...formData,
      time_type: type,
      start_date: null,
      end_date: null,
      hours: null,
      minutes: null,
    });
  };

  if (catalogsStatus === 'loading') {
    return (
      <div className="news-page__loading">
        <Spinner size="lg" />
        <p>Cargando catálogos...</p>
      </div>
    );
  }

  return (
    <div className="news-page">
      <Card title="Registrar Nueva Novedad" subtitle="Complete los datos para registrar una ausencia, vacación o incapacidad">
        <form onSubmit={handleSubmit} className="news-page__form">
          {/* Sección: Trabajador */}
          <div className="news-page__section">
            <h4 className="news-page__section-title">
              <FileText size={18} />
              Información General
            </h4>
            <div className="news-page__grid">
              <SearchSelect
                label="Trabajador *"
                options={workerOptions}
                value={formData.worker_id}
                onChange={(value) => setFormData({ ...formData, worker_id: value })}
                placeholder="Buscar trabajador..."
                error={errors.worker_id}
              />
              <Select
                label="Tipo de Novedad *"
                options={newsTypeOptions}
                value={formData.news_type_id}
                onChange={(e) => setFormData({ ...formData, news_type_id: e.target.value })}
                error={errors.news_type_id}
              />
            </div>
            <div className="news-page__field-full">
              <label className="input-field__label">Descripción</label>
              <textarea
                className="news-page__textarea"
                placeholder="Describa la novedad (opcional)..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Sección: Tiempo */}
          <div className="news-page__section">
            <h4 className="news-page__section-title">
              <Clock size={18} />
              Duración de la Novedad
            </h4>

            <Select
              label="Tipo de Tiempo *"
              options={timeTypeOptions}
              value={formData.time_type}
              onChange={(e) => handleTimeTypeChange(e.target.value as TimeType)}
            />

            {/* Calendario: Fecha inicio - Fecha fin */}
            {formData.time_type === 'days' && (
              <div className="news-page__time-days">
                <div className="news-page__date-range">
                  <div className="news-page__date-field">
                    <Calendar size={16} className="news-page__date-icon" />
                    <Input
                      label="Fecha Inicio *"
                      type="date"
                      value={formData.start_date || ''}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      error={errors.start_date}
                    />
                  </div>
                  <div className="news-page__date-separator">→</div>
                  <div className="news-page__date-field">
                    <Calendar size={16} className="news-page__date-icon" />
                    <Input
                      label="Fecha Fin *"
                      type="date"
                      value={formData.end_date || ''}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      error={errors.end_date}
                    />
                  </div>
                </div>
                <p className="news-page__hint">
                  Se contarán únicamente los días hábiles (lunes a viernes).
                </p>
              </div>
            )}

            {/* Horas */}
            {formData.time_type === 'hours' && (
              <div className="news-page__time-hours">
                <Input
                  label="Fecha de la ausencia *"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value, end_date: e.target.value })}
                  error={errors.start_date}
                />
                <Input
                  label="Cantidad de Horas *"
                  type="number"
                  min={1}
                  max={8}
                  placeholder="Ej: 4"
                  value={formData.hours?.toString() || ''}
                  onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) || null })}
                  error={errors.hours}
                />
              </div>
            )}

            {/* Minutos */}
            {formData.time_type === 'minutes' && (
              <div className="news-page__time-minutes">
                <Input
                  label="Fecha de la ausencia *"
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value, end_date: e.target.value })}
                  error={errors.start_date}
                />
                <Input
                  label="Cantidad de Minutos *"
                  type="number"
                  min={1}
                  max={480}
                  placeholder="Ej: 30"
                  value={formData.minutes?.toString() || ''}
                  onChange={(e) => setFormData({ ...formData, minutes: Number(e.target.value) || null })}
                  error={errors.minutes}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="news-page__actions">
            <Button variant="ghost" type="button" onClick={() => navigate(ROUTES.DASHBOARD)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              icon={<Plus size={18} />}
              loading={submitting}
            >
              Registrar Novedad
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewsPage;
