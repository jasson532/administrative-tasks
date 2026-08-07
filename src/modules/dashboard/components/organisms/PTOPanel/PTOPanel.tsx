import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Button, Select } from 'modules/shared/components/atoms';
import EmptyState from 'modules/shared/components/molecules/EmptyState/EmptyState';
import type { News, Worker, Holiday } from 'modules/shared/types/database.types';
import type { SelectOption } from 'modules/shared/types/common.types';
import './PTOPanel.scss';

interface PTOPanelProps {
  news: News[];
  workers: Worker[];
  holidays: Holiday[];
}

interface PTORow {
  team: string;
  name: string;
  role: string;
  newsType: string;
  startDate: string;
  endDate: string;
  businessDays: number;
  hours: number;
  observation: string;
  period: string;
}

const MONTHS_OPTIONS: SelectOption[] = [
  { value: '1', label: 'Enero' }, { value: '2', label: 'Febrero' },
  { value: '3', label: 'Marzo' }, { value: '4', label: 'Abril' },
  { value: '5', label: 'Mayo' }, { value: '6', label: 'Junio' },
  { value: '7', label: 'Julio' }, { value: '8', label: 'Agosto' },
  { value: '9', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

const QUINC_OPTIONS: SelectOption[] = [
  { value: 'Q1', label: 'Q1' },
  { value: 'Q2', label: 'Q2' },
];

const HOURS_PER_DAY = 8;

const PTOPanel = ({ news, workers, holidays }: PTOPanelProps) => {
  const currentDate = new Date();
  const [selectedYear] = useState(String(currentDate.getFullYear()));
  const [selectedMonth, setSelectedMonth] = useState(String(currentDate.getMonth() + 1));
  const [selectedQuinc, setSelectedQuinc] = useState(currentDate.getDate() <= 15 ? 'Q1' : 'Q2');

  const holidayDates = new Set(holidays.map((h) => h.date));

  // Helper: check if a date is a business day
  const isBusinessDay = (dateStr: string): boolean => {
    const date = new Date(dateStr + 'T00:00:00');
    const day = date.getDay();
    return day !== 0 && day !== 6 && !holidayDates.has(dateStr);
  };

  // Helper: find first business day from a date forward
  const findFirstBusinessDay = (startStr: string): string => {
    const current = new Date(startStr + 'T00:00:00');
    while (!isBusinessDay(current.toISOString().split('T')[0])) {
      current.setDate(current.getDate() + 1);
    }
    return current.toISOString().split('T')[0];
  };

  // Helper: find last business day from a date backward
  const findLastBusinessDay = (endStr: string): string => {
    const current = new Date(endStr + 'T00:00:00');
    while (!isBusinessDay(current.toISOString().split('T')[0])) {
      current.setDate(current.getDate() - 1);
    }
    return current.toISOString().split('T')[0];
  };

  // Calculate business days between two dates excluding weekends and holidays
  const getBusinessDays = (start: string, end: string): number => {
    const startDate = new Date(start + 'T00:00:00');
    const endDate = new Date(end + 'T00:00:00');
    let count = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      if (isBusinessDay(dateStr)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  // Get period range — find actual first/last business days
  const month = parseInt(selectedMonth);
  const year = parseInt(selectedYear);
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  const rawStart = selectedQuinc === 'Q1'
    ? `${year}-${String(month).padStart(2, '0')}-01`
    : `${year}-${String(month).padStart(2, '0')}-16`;
  const rawEnd = selectedQuinc === 'Q1'
    ? `${year}-${String(month).padStart(2, '0')}-15`
    : `${year}-${String(month).padStart(2, '0')}-${lastDayOfMonth}`;

  const periodStart = findFirstBusinessDay(rawStart);
  const periodEnd = findLastBusinessDay(rawEnd);
  const periodLabel = `${year}-${String(month).padStart(2, '0')}-${selectedQuinc}`;

  // Filter news that overlap with the selected period
  const ptoRows: PTORow[] = news
    .filter((item) => {
      // Days: must have start_date and end_date overlapping the period
      if (item.time_type === 'days' && item.start_date && item.end_date) {
        return item.start_date <= periodEnd && item.end_date >= periodStart;
      }
      // Hours/Minutes: start_date is the day of absence
      if ((item.time_type === 'hours' || item.time_type === 'minutes') && item.start_date) {
        return item.start_date >= periodStart && item.start_date <= periodEnd;
      }
      return false;
    })
    .map((item) => {
      const worker = item.worker || workers.find((w: Worker) => w.id === item.worker_id);

      let effectiveStart: string;
      let effectiveEnd: string;
      let businessDays: number;
      let hours: number;

      if (item.time_type === 'days') {
        effectiveStart = item.start_date! > periodStart ? item.start_date! : periodStart;
        effectiveEnd = item.end_date! < periodEnd ? item.end_date! : periodEnd;
        businessDays = getBusinessDays(effectiveStart, effectiveEnd);
        hours = businessDays * HOURS_PER_DAY;
      } else {
        // Hours or minutes — single day
        effectiveStart = item.start_date!;
        effectiveEnd = item.start_date!;
        // If the day is not a business day (weekend or holiday), hours = 0
        if (!isBusinessDay(item.start_date!)) {
          businessDays = 0;
          hours = 0;
        } else {
          businessDays = 0;
          hours = item.time_type === 'hours' ? (item.hours || 0) : Math.round((item.minutes || 0) / 60 * 100) / 100;
        }
      }

      return {
        team: worker?.team?.name || '-',
        name: worker?.full_name || '-',
        role: worker?.role?.name || '-',
        newsType: item.news_type?.convention ? `${item.news_type.convention} - ${item.news_type.name}` : '-',
        startDate: effectiveStart,
        endDate: effectiveEnd,
        businessDays,
        hours,
        observation: item.description || '-',
        period: periodLabel,
      };
    })
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const totalDays = ptoRows.reduce((sum, r) => sum + r.businessDays, 0);
  const totalHours = ptoRows.reduce((sum, r) => sum + r.hours, 0);

  // Export CSV
  const handleExport = () => {
    const headers = ['Equipo', 'Nombre', 'Rol', 'Novedad', 'Fecha Inicio', 'Fecha Fin', 'Días Hábiles', 'Horas', 'Observación', 'Periodo'];
    const rows = ptoRows.map((r) => [r.team, r.name, r.role, r.newsType, r.startDate, r.endDate, r.businessDays, r.hours, r.observation, r.period]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PTO_${periodLabel}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pto-panel">
      {/* Period selector */}
      <div className="pto-panel__controls">
        <div className="pto-panel__selectors">
          <Select
            label="Mes"
            options={MONTHS_OPTIONS}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <Select
            label="Q"
            options={QUINC_OPTIONS}
            value={selectedQuinc}
            onChange={(e) => setSelectedQuinc(e.target.value)}
          />
          <div className="pto-panel__period-display">
            <span className="pto-panel__period-q">{selectedQuinc}</span>
            <span className="pto-panel__period-range">{periodStart} → {periodEnd}</span>
          </div>
        </div>
        <div className="pto-panel__actions">
          <div className="pto-panel__summary">
            <span className="pto-panel__summary-item">
              <strong>{ptoRows.length}</strong> novedades
            </span>
            <span className="pto-panel__summary-item">
              <strong>{totalDays}</strong> días hábiles
            </span>
            <span className="pto-panel__summary-item">
              <strong>{totalHours}</strong> horas
            </span>
          </div>
          <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={handleExport}>
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="pto-panel__table-wrapper">
        <table className="pto-panel__table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Novedad</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Días Háb.</th>
              <th>Horas</th>
              <th>Observación</th>
              <th>Periodo</th>
            </tr>
          </thead>
          <tbody>
            {ptoRows.length === 0 ? (
              <tr>
                <td colSpan={10}>
                  <EmptyState
                    icon={<FileSpreadsheet size={48} />}
                    title="Sin novedades en este periodo"
                    description="No hay registros para la quincena seleccionada. Selecciona otro periodo."
                  />
                </td>
              </tr>
            ) : (
              ptoRows.map((row, idx) => (
                <tr key={idx}>
                  <td className="pto-panel__cell-team">{row.team}</td>
                  <td className="pto-panel__cell-name">{row.name}</td>
                  <td className="pto-panel__cell-role">{row.role}</td>
                  <td className="pto-panel__cell-type">{row.newsType}</td>
                  <td className="pto-panel__cell-date">{row.startDate}</td>
                  <td className="pto-panel__cell-date">{row.endDate}</td>
                  <td className="pto-panel__cell-number">{row.businessDays}</td>
                  <td className="pto-panel__cell-number">{row.hours}</td>
                  <td className="pto-panel__cell-obs">{row.observation}</td>
                  <td className="pto-panel__cell-period">{row.period}</td>
                </tr>
              ))
            )}
          </tbody>
          {ptoRows.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={6} className="pto-panel__footer-label">TOTAL</td>
                <td className="pto-panel__cell-number pto-panel__cell-total">{totalDays}</td>
                <td className="pto-panel__cell-number pto-panel__cell-total">{totalHours}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Visual Period Calendar */}
      <div className="pto-panel__calendar">
        <h4 className="pto-panel__calendar-title">{MONTHS_OPTIONS.find(m => m.value === selectedMonth)?.label} {selectedQuinc}</h4>
        <div className="pto-panel__calendar-legend">
          <span className="pto-panel__legend-item">
            <span className="pto-panel__legend-dot pto-panel__legend-dot--business" />
            Día hábil
          </span>
          <span className="pto-panel__legend-item">
            <span className="pto-panel__legend-dot pto-panel__legend-dot--weekend" />
            Fin de semana
          </span>
          <span className="pto-panel__legend-item">
            <span className="pto-panel__legend-dot pto-panel__legend-dot--holiday" />
            Festivo
          </span>
          <span className="pto-panel__legend-item">
            <span className="pto-panel__legend-dot pto-panel__legend-dot--today" />
            Hoy
          </span>
        </div>
        <div className="pto-panel__calendar-grid">
          <div className="pto-panel__calendar-header">
            <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
          </div>
          <div className="pto-panel__calendar-days">
            {(() => {
              const startDate = new Date(periodStart + 'T00:00:00');
              const endDate = new Date(periodEnd + 'T00:00:00');
              const todayStr = new Date().toISOString().split('T')[0];

              // Find the Monday before or on the start date
              const calStart = new Date(startDate);
              const startDay = calStart.getDay();
              const mondayOffset = startDay === 0 ? -6 : 1 - startDay;
              calStart.setDate(calStart.getDate() + mondayOffset);

              // Find the Sunday after or on the end date
              const calEnd = new Date(endDate);
              const endDay = calEnd.getDay();
              const sundayOffset = endDay === 0 ? 0 : 7 - endDay;
              calEnd.setDate(calEnd.getDate() + sundayOffset);

              const days: React.ReactElement[] = [];
              const current = new Date(calStart);

              while (current <= calEnd) {
                const dateStr = current.toISOString().split('T')[0];
                const dayOfWeek = current.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                const isHoliday = holidayDates.has(dateStr);
                const isInPeriod = current >= startDate && current <= endDate;
                const isToday = dateStr === todayStr;

                let dayClass = 'pto-panel__day';
                if (!isInPeriod) dayClass += ' pto-panel__day--outside';
                else if (isHoliday) dayClass += ' pto-panel__day--holiday';
                else if (isWeekend) dayClass += ' pto-panel__day--weekend';
                else dayClass += ' pto-panel__day--business';
                if (isToday) dayClass += ' pto-panel__day--today';

                const holidayName = holidays.find((h: Holiday) => h.date === dateStr)?.name;

                days.push(
                  <div key={dateStr} className={dayClass} title={holidayName || dateStr}>
                    <span className="pto-panel__day-number">{current.getDate()}</span>
                    {isHoliday && isInPeriod && <span className="pto-panel__day-label">{holidayName}</span>}
                  </div>
                );
                current.setDate(current.getDate() + 1);
              }
              return days;
            })()}
          </div>
        </div>
        <div className="pto-panel__calendar-stats">
          <span className="pto-panel__calendar-stat">
            <strong>{(() => {
              let count = 0;
              const current = new Date(periodStart + 'T00:00:00');
              const end = new Date(periodEnd + 'T00:00:00');
              while (current <= end) {
                const day = current.getDay();
                const dateStr = current.toISOString().split('T')[0];
                if (day !== 0 && day !== 6 && !holidayDates.has(dateStr)) count++;
                current.setDate(current.getDate() + 1);
              }
              return count;
            })()}</strong> días hábiles
          </span>
          <span className="pto-panel__calendar-stat">
            <strong>{(() => {
              let count = 0;
              const current = new Date(periodStart + 'T00:00:00');
              const end = new Date(periodEnd + 'T00:00:00');
              while (current <= end) {
                const day = current.getDay();
                if (day === 0 || day === 6) count++;
                current.setDate(current.getDate() + 1);
              }
              return count;
            })()}</strong> fin de semana
          </span>
          <span className="pto-panel__calendar-stat">
            <strong>{holidays.filter((h: Holiday) => h.date >= periodStart && h.date <= periodEnd).length}</strong> festivos
          </span>
        </div>
      </div>
    </div>
  );
};

export default PTOPanel;
