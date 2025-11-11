
import React from 'react';
import { CalendarEvent } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDateClick }) => {
  const farsiWeekdays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // In Iran, week starts on Saturday (6). 
  // JavaScript's getDay(): Sun=0, Mon=1, ..., Sat=6.
  // We need to adjust. If getDay() is 6 (Sat), we want it to be 0.
  const startDayOfWeek = (firstDayOfMonth.getDay() + 1) % 7;
  const totalDays = lastDayOfMonth.getDate();

  const days: (Date | null)[] = [];

  // Add blank days for the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(new Date(year, month, i));
  }
  
  const isSameDay = (d1: Date, d2: Date) => 
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

  const today = new Date();

  return (
    <div className="grid grid-cols-7 gap-1 bg-gray-800 p-2 rounded-lg shadow-inner">
      {farsiWeekdays.map(day => (
        <div key={day} className="text-center font-semibold text-sm text-cyan-400 py-2">
          {day}
        </div>
      ))}

      {days.map((day, index) => {
        const isToday = day ? isSameDay(day, today) : false;
        const dayEvents = day ? events.filter(e => isSameDay(e.date, day)) : [];
        
        return (
          <div
            key={index}
            onClick={() => day && onDateClick(day)}
            className={`h-24 sm:h-28 md:h-32 rounded-md transition-colors duration-200 flex flex-col p-2 overflow-hidden ${
              day ? 'bg-gray-700/50 hover:bg-gray-600/70 cursor-pointer' : 'bg-transparent'
            }`}
          >
            {day && (
              <>
                <span className={`text-sm font-medium self-start ${isToday ? 'bg-cyan-500 text-white rounded-full h-7 w-7 flex items-center justify-center' : 'text-gray-300'}`}>
                  {day.getDate()}
                </span>
                <div className="mt-1 flex-grow overflow-y-auto space-y-1">
                  {dayEvents.map(event => (
                    <div key={event.id} className="bg-cyan-800/70 text-cyan-100 text-xs p-1 rounded-md truncate">
                      {event.title}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;
