import { Cake, PartyPopper, CalendarDays, Star } from 'lucide-react';
import type { Worker } from 'modules/shared/types/database.types';
import './BirthdayPanel.scss';

interface BirthdayPanelProps {
  workers: Worker[];
}

interface BirthdayWorker {
  worker: Worker;
  daysUntil: number;
  dateLabel: string;
}

const BirthdayPanel = ({ workers }: BirthdayPanelProps) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;

  const getDaysUntilBirthday = (day: number, month: number): number => {
    const thisYear = today.getFullYear();
    let birthday = new Date(thisYear, month - 1, day);

    // If birthday already passed this year, it's for next year
    if (birthday < new Date(thisYear, currentMonth - 1, currentDay)) {
      birthday = new Date(thisYear + 1, month - 1, day);
    }

    const diff = birthday.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getDateLabel = (day: number, month: number): string => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${months[month - 1]}`;
  };

  // Calculate all birthdays with days until
  const allBirthdays: BirthdayWorker[] = workers
    .map((worker) => ({
      worker,
      daysUntil: getDaysUntilBirthday(worker.birthday_day, worker.birthday_month),
      dateLabel: getDateLabel(worker.birthday_day, worker.birthday_month),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil);

  const todayBirthdays = allBirthdays.filter((b) => b.daysUntil === 0);
  const thisWeekBirthdays = allBirthdays.filter((b) => b.daysUntil > 0 && b.daysUntil <= 7);
  const nextWeekBirthdays = allBirthdays.filter((b) => b.daysUntil > 7 && b.daysUntil <= 14);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}` : parts[0][0];
  };

  return (
    <div className="birthday-panel">
      {/* Today */}
      <div className="birthday-panel__section">
        <div className="birthday-panel__section-header birthday-panel__section-header--today">
          <PartyPopper size={20} />
          <h4>Hoy cumplen años</h4>
        </div>
        {todayBirthdays.length === 0 ? (
          <p className="birthday-panel__empty">Nadie cumple años hoy</p>
        ) : (
          <div className="birthday-panel__today-grid">
            {todayBirthdays.map((b) => (
              <div key={b.worker.id} className="birthday-panel__today-card">
                <div className="birthday-panel__today-confetti">
                  <Star size={14} className="birthday-panel__star birthday-panel__star--1" />
                  <Star size={10} className="birthday-panel__star birthday-panel__star--2" />
                  <Star size={12} className="birthday-panel__star birthday-panel__star--3" />
                </div>
                <div className="birthday-panel__today-avatar">
                  {getInitials(b.worker.full_name)}
                </div>
                <div className="birthday-panel__today-info">
                  <span className="birthday-panel__today-name">{b.worker.full_name}</span>
                  <span className="birthday-panel__today-team">{b.worker.team?.name || ''}</span>
                  <span className="birthday-panel__today-greeting">
                    <Cake size={14} /> ¡Feliz Cumpleaños!
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* This week */}
      <div className="birthday-panel__section">
        <div className="birthday-panel__section-header birthday-panel__section-header--week">
          <CalendarDays size={20} />
          <h4>Esta semana</h4>
          <span className="birthday-panel__count">{thisWeekBirthdays.length}</span>
        </div>
        {thisWeekBirthdays.length === 0 ? (
          <p className="birthday-panel__empty">Sin cumpleaños esta semana</p>
        ) : (
          <div className="birthday-panel__list">
            {thisWeekBirthdays.map((b) => (
              <div key={b.worker.id} className="birthday-panel__card">
                <div className="birthday-panel__avatar">
                  {getInitials(b.worker.full_name)}
                </div>
                <div className="birthday-panel__info">
                  <span className="birthday-panel__name">{b.worker.full_name}</span>
                  <span className="birthday-panel__team">{b.worker.team?.name || ''}</span>
                </div>
                <div className="birthday-panel__date-info">
                  <span className="birthday-panel__date">{b.dateLabel}</span>
                  <span className="birthday-panel__days-badge birthday-panel__days-badge--soon">
                    {b.daysUntil === 1 ? 'Mañana' : `En ${b.daysUntil} días`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next week */}
      <div className="birthday-panel__section">
        <div className="birthday-panel__section-header birthday-panel__section-header--next">
          <CalendarDays size={20} />
          <h4>Próxima semana</h4>
          <span className="birthday-panel__count">{nextWeekBirthdays.length}</span>
        </div>
        {nextWeekBirthdays.length === 0 ? (
          <p className="birthday-panel__empty">Sin cumpleaños la próxima semana</p>
        ) : (
          <div className="birthday-panel__list">
            {nextWeekBirthdays.map((b) => (
              <div key={b.worker.id} className="birthday-panel__card birthday-panel__card--subtle">
                <div className="birthday-panel__avatar birthday-panel__avatar--subtle">
                  {getInitials(b.worker.full_name)}
                </div>
                <div className="birthday-panel__info">
                  <span className="birthday-panel__name">{b.worker.full_name}</span>
                  <span className="birthday-panel__team">{b.worker.team?.name || ''}</span>
                </div>
                <div className="birthday-panel__date-info">
                  <span className="birthday-panel__date">{b.dateLabel}</span>
                  <span className="birthday-panel__days-badge">En {b.daysUntil} días</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayPanel;
