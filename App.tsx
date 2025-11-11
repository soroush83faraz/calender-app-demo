
import React, { useState, useMemo } from 'react';
import { CalendarEvent } from './types';
import CalendarGrid from './components/CalendarGrid';
import EventModal from './components/EventModal';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './components/icons';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const farsiMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const currentMonthName = useMemo(() => farsiMonths[currentDate.getMonth()], [currentDate]);
  const currentYear = useMemo(() => currentDate.getFullYear()-621, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const openModalForDate = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const addOrUpdateEvent = (event: Omit<CalendarEvent, 'id'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      { ...event, id: Date.now().toString() }
    ]);
    closeModal();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 md:p-8 flex flex-col antialiased">
      <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-cyan-400">تقویم هوشمند رویداد</h1>
        <button
          onClick={() => openModalForDate(new Date())}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-colors duration-300 shadow-lg shadow-cyan-500/20"
        >
          <PlusIcon className="w-5 h-5 me-2" />
          <span className="hidden sm:inline">رویداد جدید</span>
        </button>
      </header>

      <div className="flex items-center justify-between mb-6 bg-gray-800 p-3 rounded-lg shadow-md">
        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xl font-semibold">
           <h2 className="text-cyan-300">{currentMonthName}</h2>
           <span className="text-gray-400">{currentYear}</span>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={handleToday} className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 rounded-md transition-colors">امروز</button>
           <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <ChevronLeftIcon className="w-6 h-6" />
           </button>
        </div>
      </div>
      
      <main className="flex-grow">
        <CalendarGrid 
          currentDate={currentDate} 
          events={events}
          onDateClick={openModalForDate}
        />
      </main>

      {isModalOpen && selectedDate && (
        <EventModal
          date={selectedDate}
          onClose={closeModal}
          onSave={addOrUpdateEvent}
        />
      )}
    </div>
  );
};

export default App;
