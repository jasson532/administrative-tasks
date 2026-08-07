import { useState } from 'react';
import type { News } from 'modules/shared/types/database.types';
import './AbsenceHeatmap.scss';

interface AbsenceHeatmapProps {
  news: News[];
}

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];

const AbsenceHeatmap = ({ news }: AbsenceHeatmapProps) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear] = useState(currentYear);

  // Calculate absences per week/month
  // Build a matrix: months (rows) x weeks of month (columns)
  const getAbsencesForDate = (date: Date): number => {
    const dateStr = date.toISOString().split('T')[0];
    return news.filter((item) => {
      if (item.time_type !== 'days' || !item.start_date || !item.end_date) return false;
      return item.start_date <= dateStr && item.end_date >= dateStr;
    }).length;
  };

  // Build weekly heatmap data for each month
  const buildMonthData = (month: number) => {
    const weeks: { weekNum: number; days: { date: Date; count: number; isCurrentMonth: boolean }[] }[] = [];
    const firstDay = new Date(selectedYear, month, 1);
    const lastDay = new Date(selectedYear, month + 1, 0);

    // Find the Monday of the first week
    let startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startDate.setDate(startDate.getDate() + diff);

    let weekNum = 0;
    while (startDate <= lastDay || weekNum === 0) {
      const week: { date: Date; count: number; isCurrentMonth: boolean }[] = [];
      for (let d = 0; d < 5; d++) { // Mon-Fri only
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + d);
        week.push({
          date: new Date(currentDate),
          count: getAbsencesForDate(currentDate),
          isCurrentMonth: currentDate.getMonth() === month,
        });
      }
      weeks.push({ weekNum, days: week });
      startDate.setDate(startDate.getDate() + 7);
      weekNum++;
      if (weekNum > 5) break;
    }

    return weeks;
  };

  const getHeatColor = (count: number): string => {
    if (count === 0) return 'heat-0';
    if (count === 1) return 'heat-1';
    if (count === 2) return 'heat-2';
    if (count <= 4) return 'heat-3';
    return 'heat-4';
  };

  const today = new Date().toISOString().split('T')[0];

  // Monthly summary
  const monthlySummary = MONTHS.map((name, idx) => {
    const monthNews = news.filter((item) => {
      if (item.time_type !== 'days' || !item.start_date) return false;
      const startMonth = new Date(item.start_date).getMonth();
      return startMonth === idx;
    });
    return { name, count: monthNews.length };
  });

  const maxMonthly = Math.max(...monthlySummary.map((m) => m.count), 1);

  return (
    <div className="heatmap">
      {/* Monthly bar chart summary */}
      <div className="heatmap__monthly">
        <h4 className="heatmap__title">Ausencias por Mes — {selectedYear}</h4>
        <div className="heatmap__bars">
          {monthlySummary.map((month, idx) => (
            <div key={idx} className="heatmap__bar-col">
              <div className="heatmap__bar-wrapper">
                <div
                  className="heatmap__bar"
                  style={{ height: `${(month.count / maxMonthly) * 100}%` }}
                >
                  {month.count > 0 && <span className="heatmap__bar-value">{month.count}</span>}
                </div>
              </div>
              <span className="heatmap__bar-label">{month.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed heatmap grid */}
      <div className="heatmap__detail">
        <h4 className="heatmap__title">Mapa de Calor — Ausencias Diarias (Días Hábiles)</h4>
        <div className="heatmap__legend">
          <span className="heatmap__legend-label">Menos</span>
          <span className="heatmap__cell heatmap__cell--heat-0" />
          <span className="heatmap__cell heatmap__cell--heat-1" />
          <span className="heatmap__cell heatmap__cell--heat-2" />
          <span className="heatmap__cell heatmap__cell--heat-3" />
          <span className="heatmap__cell heatmap__cell--heat-4" />
          <span className="heatmap__legend-label">Más</span>
        </div>

        <div className="heatmap__grid-container">
          {/* Day labels */}
          <div className="heatmap__day-labels">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="heatmap__day-label">{day}</span>
            ))}
          </div>

          {/* Months grid */}
          <div className="heatmap__months-grid">
            {MONTHS.map((monthName, monthIdx) => {
              const weeks = buildMonthData(monthIdx);
              return (
                <div key={monthIdx} className="heatmap__month-col">
                  <span className="heatmap__month-label">{monthName}</span>
                  <div className="heatmap__weeks">
                    {weeks.map((week) => (
                      <div key={week.weekNum} className="heatmap__week">
                        {week.days.map((day, dayIdx) => {
                          const dateStr = day.date.toISOString().split('T')[0];
                          const isToday = dateStr === today;
                          return (
                            <div
                              key={dayIdx}
                              className={`heatmap__cell heatmap__cell--${getHeatColor(day.count)} ${!day.isCurrentMonth ? 'heatmap__cell--outside' : ''} ${isToday ? 'heatmap__cell--today' : ''}`}
                              title={`${dateStr}: ${day.count} ausencia(s)`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceHeatmap;
