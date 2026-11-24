import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateIndo } from '../utils/whatsapp';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDates: string[];
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
  availableDates
}) => {
  // Common quick dates
  const quickDates = Array.from(new Set(['2026-11-24', '2026-11-25', ...availableDates])).sort();

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5">
      {/* Date Header with Prev/Next */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handlePrevDay}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
          <CalendarIcon className="w-4 h-4 text-amber-500" />
          <span>{formatDateIndo(selectedDate)}</span>
        </div>

        <button
          onClick={handleNextDay}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {quickDates.map(d => {
          const isSelected = d === selectedDate;
          const [year, month, day] = d.split('-');
          const label = `${day}/${month}`;
          let dayName = '';
          try {
            const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][dateObj.getDay()];
          } catch (e) {
            dayName = '';
          }

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-amber-500 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dayName} {label}
            </button>
          );
        })}

        <label className="relative flex items-center px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs cursor-pointer hover:bg-slate-200">
          <span>Pilih</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => e.target.value && onSelectDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
          />
        </label>
      </div>
    </div>
  );
};
