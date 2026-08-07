import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend
} from 'recharts';
import type { News } from 'modules/shared/types/database.types';
import './StatsPanel.scss';

interface StatsPanelProps {
  news: News[];
}

const COLORS = {
  primary: '#8b5cf6',
  secondary: '#a78bfa',
  tertiary: '#c4b5fd',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  neutral: '#6b7280',
};

const CHART_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#f97316', '#14b8a6'];

const StatsPanel = ({ news }: StatsPanelProps) => {
  // --- Data transformations ---

  // 1. By news type
  const byType = news.reduce((acc, item) => {
    const typeName = item.news_type?.name || 'Sin tipo';
    const convention = item.news_type?.convention || '??';
    const key = `${convention} - ${typeName}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(byType)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 2. By state
  const stateLabels: Record<string, string> = { active: 'Activas', completed: 'Completadas', cancelled: 'Canceladas' };
  const stateColors: Record<string, string> = { active: COLORS.warning, completed: COLORS.success, cancelled: COLORS.danger };

  const byState = news.reduce((acc, item) => {
    acc[item.state] = (acc[item.state] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stateData = Object.entries(byState).map(([key, value]) => ({
    name: stateLabels[key] || key,
    value,
    color: stateColors[key] || COLORS.neutral,
  }));

  // 3. By team
  const byTeam = news.reduce((acc, item) => {
    const teamName = item.worker?.team?.name || 'Sin equipo';
    acc[teamName] = (acc[teamName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamData = Object.entries(byTeam)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // 4. By month (trend)
  const byMonth = news.reduce((acc, item) => {
    const date = new Date(item.created_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const label = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (!acc[monthKey]) acc[monthKey] = { month: label, total: 0, key: monthKey };
    acc[monthKey].total += 1;
    return acc;
  }, {} as Record<string, { month: string; total: number; key: string }>);

  const trendData = Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key));

  // 5. Top workers with most news
  const byWorker = news.reduce((acc, item) => {
    const name = item.worker?.full_name || 'Sin asignar';
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topWorkersData = Object.entries(byWorker)
    .map(([name, value]) => ({ name: name.split(' ').slice(0, 2).join(' '), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  return (
    <div className="stats-panel">
      {/* Row 1: State + Type */}
      <div className="stats-panel__row">
        <div className="stats-panel__chart-card">
          <h4 className="stats-panel__chart-title">Estado de Novedades</h4>
          <div className="stats-panel__chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                >
                  {stateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-panel__chart-card">
          <h4 className="stats-panel__chart-title">Distribución por Tipo</h4>
          <div className="stats-panel__chart-body">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${(name || '').split(' - ')[0]} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {typeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Trend */}
      <div className="stats-panel__chart-card stats-panel__chart-card--full">
        <h4 className="stats-panel__chart-title">Tendencia Mensual de Novedades</h4>
        <div className="stats-panel__chart-body">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="total" stroke={COLORS.primary} fill="url(#colorTotal)" strokeWidth={2} name="Novedades" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Team + Top Workers */}
      <div className="stats-panel__row">
        <div className="stats-panel__chart-card">
          <h4 className="stats-panel__chart-title">Novedades por Equipo</h4>
          <div className="stats-panel__chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={teamData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={130} />
                <Tooltip />
                <Bar dataKey="value" fill={COLORS.primary} radius={[0, 4, 4, 0]} name="Novedades" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="stats-panel__chart-card">
          <h4 className="stats-panel__chart-title">Top Trabajadores con Novedades</h4>
          <div className="stats-panel__chart-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topWorkersData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Novedades">
                  {topWorkersData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
