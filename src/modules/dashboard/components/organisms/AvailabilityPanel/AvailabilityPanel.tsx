import { Users, UserCheck, UserX } from 'lucide-react';
import type { Worker, News, Team } from 'modules/shared/types/database.types';
import type { NewsFilters } from 'modules/news/types/news.types';
import './AvailabilityPanel.scss';

interface AvailabilityPanelProps {
  workers: Worker[];
  news: News[];
  teams: Team[];
  filters?: NewsFilters;
}

interface TeamAvailability {
  team: Team;
  total: number;
  available: number;
  absent: number;
  absentWorkers: { name: string; reason: string }[];
  percentage: number;
}

const AvailabilityPanel = ({ workers, news, teams, filters }: AvailabilityPanelProps) => {
  const today = new Date().toISOString().split('T')[0];

  // Apply filters to scope
  const filteredTeams = filters?.team_ids && filters.team_ids.length > 0
    ? teams.filter((t) => filters.team_ids!.includes(t.id))
    : teams;

  const filteredWorkers = filters?.worker_ids && filters.worker_ids.length > 0
    ? workers.filter((w) => filters.worker_ids!.includes(w.id))
    : filters?.team_ids && filters.team_ids.length > 0
      ? workers.filter((w) => filters.team_ids!.includes(w.team_id))
      : workers;

  // Find workers currently absent (active news with days that include today)
  const absentWorkerIds = new Set<string>();
  const absentReasons = new Map<string, string>();

  news.forEach((item) => {
    if (item.state !== 'active') return;
    if (item.time_type === 'days' && item.start_date && item.end_date) {
      if (item.start_date <= today && item.end_date >= today) {
        absentWorkerIds.add(item.worker_id);
        absentReasons.set(item.worker_id, item.news_type?.name || 'Ausencia');
      }
    }
  });

  // Calculate availability per team
  const teamAvailabilities: TeamAvailability[] = filteredTeams.map((team) => {
    const teamWorkers = filteredWorkers.filter((w) => w.team_id === team.id && w.status === 'active');
    const absentInTeam = teamWorkers.filter((w) => absentWorkerIds.has(w.id));
    const available = teamWorkers.length - absentInTeam.length;
    const percentage = teamWorkers.length > 0 ? (available / teamWorkers.length) * 100 : 100;

    return {
      team,
      total: teamWorkers.length,
      available,
      absent: absentInTeam.length,
      absentWorkers: absentInTeam.map((w) => ({
        name: w.full_name,
        reason: absentReasons.get(w.id) || 'Ausencia',
      })),
      percentage,
    };
  }).filter((t) => t.total > 0);

  const totalWorkers = filteredWorkers.filter((w) => w.status === 'active').length;
  const totalAbsent = absentWorkerIds.size;
  const totalAvailable = totalWorkers - totalAbsent;
  const overallPercentage = totalWorkers > 0 ? (totalAvailable / totalWorkers) * 100 : 100;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 70) return 'yellow';
    return 'red';
  };

  const getStatusLabel = (percentage: number) => {
    if (percentage >= 90) return 'Cobertura completa';
    if (percentage >= 70) return 'Cobertura aceptable';
    return 'Cobertura crítica';
  };

  return (
    <div className="availability">
      {/* Overall Summary */}
      <div className="availability__summary">
        <div className={`availability__overall availability__overall--${getStatusColor(overallPercentage)}`}>
          <div className="availability__overall-ring">
            <svg viewBox="0 0 120 120" className="availability__ring-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8" opacity="0.15" />
              <circle
                cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="8"
                strokeDasharray={`${(overallPercentage / 100) * 327} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="availability__overall-value">
              <span className="availability__overall-number">{Math.round(overallPercentage)}%</span>
              <span className="availability__overall-label">disponible</span>
            </div>
          </div>
          <div className="availability__overall-info">
            <h3>{getStatusLabel(overallPercentage)}</h3>
            <div className="availability__overall-stats">
              <span className="availability__stat">
                <UserCheck size={16} /> {totalAvailable} disponibles
              </span>
              <span className="availability__stat availability__stat--absent">
                <UserX size={16} /> {totalAbsent} ausentes
              </span>
              <span className="availability__stat">
                <Users size={16} /> {totalWorkers} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-team breakdown */}
      <h4 className="availability__section-title">Disponibilidad por Equipo — Hoy</h4>
      <div className="availability__grid">
        {teamAvailabilities.map((ta) => (
          <div key={ta.team.id} className={`availability__team-card availability__team-card--${getStatusColor(ta.percentage)}`}>
            <div className="availability__team-header">
              <div className="availability__team-name">
                <h5>{ta.team.name}</h5>
                <span className="availability__team-dep">{ta.team.dependencia?.name}</span>
              </div>
              <div className={`availability__team-badge availability__team-badge--${getStatusColor(ta.percentage)}`}>
                {ta.available}/{ta.total}
              </div>
            </div>

            {/* Progress bar */}
            <div className="availability__progress">
              <div
                className={`availability__progress-bar availability__progress-bar--${getStatusColor(ta.percentage)}`}
                style={{ width: `${ta.percentage}%` }}
              />
            </div>

            {/* Absent workers */}
            {ta.absentWorkers.length > 0 && (
              <div className="availability__absent-list">
                {ta.absentWorkers.map((aw, i) => (
                  <div key={i} className="availability__absent-item">
                    <UserX size={12} />
                    <span className="availability__absent-name">{aw.name.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="availability__absent-reason">{aw.reason}</span>
                  </div>
                ))}
              </div>
            )}

            {ta.absentWorkers.length === 0 && (
              <p className="availability__all-present">Equipo completo</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityPanel;
