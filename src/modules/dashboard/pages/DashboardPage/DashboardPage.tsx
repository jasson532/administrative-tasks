import { useEffect, useState } from 'react';
import { Filter, Calendar, Users, TrendingUp, AlertCircle, BarChart3, Table2, Cake, Activity, FileSpreadsheet } from 'lucide-react';
import { useAppDispatch, useAppSelector } from 'modules/shared/store/hooks';
import { fetchNews, setFilters, clearFilters } from 'modules/news/store/newsSlice';
import { fetchWorkers } from 'modules/workers/store/workersSlice';
import { fetchAllCatalogs } from 'modules/shared/store/slices/catalogsSlice';
import { fetchTeams } from 'modules/teams/store/teamsSlice';
import { Button, Badge, Spinner } from 'modules/shared/components/atoms';
import NewsFiltersPanel from 'modules/news/components/organisms/NewsFilters/NewsFilters';
import NewsTable from 'modules/news/components/organisms/NewsTable/NewsTable';
import StatsPanel from 'modules/dashboard/components/organisms/StatsPanel/StatsPanel';
import BirthdayPanel from 'modules/dashboard/components/organisms/BirthdayPanel/BirthdayPanel';
import AvailabilityPanel from 'modules/dashboard/components/organisms/AvailabilityPanel/AvailabilityPanel';
import AbsenceHeatmap from 'modules/dashboard/components/organisms/AbsenceHeatmap/AbsenceHeatmap';
import PTOPanel from 'modules/dashboard/components/organisms/PTOPanel/PTOPanel';
import type { NewsFilters } from 'modules/news/types/news.types';
import './DashboardPage.scss';

type TabType = 'novedades' | 'disponibilidad' | 'cumpleanos' | 'pto' | 'estadisticas';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { items: news, status: newsStatus, filters } = useAppSelector((state) => state.news);
  const { workers } = useAppSelector((state) => state.workers);
  const { teams } = useAppSelector((state) => state.teams);
  const { holidays } = useAppSelector((state) => state.catalogs);

  const [activeTab, setActiveTab] = useState<TabType>('novedades');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<NewsFilters>({});

  useEffect(() => {
    dispatch(fetchAllCatalogs());
    dispatch(fetchWorkers());
    dispatch(fetchTeams());
    dispatch(fetchNews(undefined));
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(fetchNews(localFilters));
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    dispatch(clearFilters());
    dispatch(fetchNews(undefined));
  };

  const activeNews = news.filter((n) => n.state === 'active');
  const completedNews = news.filter((n) => n.state === 'completed');

  if (newsStatus === 'loading' && news.length === 0) {
    return (
      <div className="dashboard__loading">
        <Spinner size="lg" />
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="dashboard__stats">
        <div className="dashboard__stat-card dashboard__stat-card--primary">
          <div className="dashboard__stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{news.length}</span>
            <span className="dashboard__stat-label">Total Novedades</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--warning">
          <div className="dashboard__stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{activeNews.length}</span>
            <span className="dashboard__stat-label">Activas</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--success">
          <div className="dashboard__stat-icon">
            <Calendar size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{completedNews.length}</span>
            <span className="dashboard__stat-label">Completadas</span>
          </div>
        </div>
        <div className="dashboard__stat-card dashboard__stat-card--info">
          <div className="dashboard__stat-icon">
            <Users size={24} />
          </div>
          <div className="dashboard__stat-info">
            <span className="dashboard__stat-value">{workers.length}</span>
            <span className="dashboard__stat-label">Trabajadores</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard__tabs">
        <button
          className={`dashboard__tab ${activeTab === 'novedades' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('novedades')}
        >
          <Table2 size={16} />
          Novedades
        </button>
        <button
          className={`dashboard__tab ${activeTab === 'pto' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('pto')}
        >
          <FileSpreadsheet size={16} />
          PTO
        </button>
        <button
          className={`dashboard__tab ${activeTab === 'cumpleanos' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('cumpleanos')}
        >
          <Cake size={16} />
          Cumpleaños
        </button>
        <button
          className={`dashboard__tab ${activeTab === 'estadisticas' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('estadisticas')}
        >
          <BarChart3 size={16} />
          Estadísticas
        </button>
        <button
          className={`dashboard__tab ${activeTab === 'disponibilidad' ? 'dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('disponibilidad')}
        >
          <Activity size={16} />
          Disponibilidad
        </button>
      </div>

      {/* Filters — shared across tabs */}
      <div className="dashboard__actions">
        <Button
          variant="secondary"
          icon={<Filter size={18} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Ocultar Filtros' : 'Filtros'}
        </Button>
      </div>

      {showFilters && (
        <NewsFiltersPanel
          filters={localFilters}
          onChange={setLocalFilters}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
      )}

      {Object.keys(filters).length > 0 && (
        <div className="dashboard__active-filters">
          <span className="dashboard__active-filters-label">Filtros activos:</span>
          {filters.worker_ids && <Badge variant="primary">{filters.worker_ids.length} trabajador(es)</Badge>}
          {filters.news_type_ids && <Badge variant="info">{filters.news_type_ids.length} tipo(s)</Badge>}
          {filters.states && <Badge variant="neutral">{filters.states.length} estado(s)</Badge>}
          {filters.team_ids && <Badge variant="neutral">{filters.team_ids.length} equipo(s)</Badge>}
          {filters.start_date && <Badge variant="neutral">Desde: {filters.start_date}</Badge>}
          {filters.end_date && <Badge variant="neutral">Hasta: {filters.end_date}</Badge>}
        </div>
      )}

      {/* Tab: Novedades */}
      {activeTab === 'novedades' && (
        <div className="dashboard__table-card">
          <div className="dashboard__table-header">
            <h3>Novedades Registradas</h3>
            <span className="dashboard__table-count">{news.length} registros</span>
          </div>
          <NewsTable items={news} editable={false} />
        </div>
      )}

      {/* Tab: Disponibilidad */}
      {activeTab === 'disponibilidad' && (
        <>
          <AvailabilityPanel workers={workers} news={news} teams={teams} filters={filters} />
          <AbsenceHeatmap news={news} />
        </>
      )}

      {/* Tab: Cumpleaños */}
      {activeTab === 'cumpleanos' && (
        <BirthdayPanel workers={workers} />
      )}

      {/* Tab: PTO */}
      {activeTab === 'pto' && (
        <PTOPanel news={news} workers={workers} holidays={holidays} />
      )}

      {/* Tab: Estadísticas */}
      {activeTab === 'estadisticas' && (
        <StatsPanel news={news} />
      )}
    </div>
  );
};

export default DashboardPage;
