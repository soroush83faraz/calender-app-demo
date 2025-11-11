
import React, { useState } from 'react';
import { generateEventSuggestion } from '../services/geminiService';

interface EventModalProps {
  date: Date;
  onClose: () => void;
  onSave: (event: { date: Date; title: string; description: string }) => void;
}

const EventModal: React.FC<EventModalProps> = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ date, title, description });
    }
  };
  
  const handleGenerateSuggestion = async () => {
      setIsLoadingAI(true);
      setError(null);
      try {
        const suggestion = await generateEventSuggestion(date);
        setTitle(suggestion.title);
        setDescription(suggestion.description);
      } catch (err) {
        setError("خطا در ارتباط با هوش مصنوعی. لطفاً دوباره تلاش کنید.");
        console.error(err);
      } finally {
        setIsLoadingAI(false);
      }
  };

  const formattedDate = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  }).format(date);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg border border-gray-700 transform transition-all duration-300 scale-95 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-cyan-300">افزودن رویداد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <p className="text-gray-400 mb-6">برای تاریخ: <span className="font-semibold text-cyan-400">{formattedDate}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">عنوان رویداد</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="مثال: جلسه پروژه"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">توضیحات (اختیاری)</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
              placeholder="جزئیات رویداد را وارد کنید..."
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
             <button
              type="button"
              onClick={handleGenerateSuggestion}
              disabled={isLoadingAI}
              className="w-full sm:w-auto flex-grow justify-center bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingAI ? (
                  <>
                    <svg className="animate-spin -ms-1 me-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>در حال پردازش...</span>
                  </>
              ) : (
                '✨ پیشنهاد با هوش مصنوعی'
              )}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto flex-grow bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
            >
              ذخیره رویداد
            </button>
          </div>
        </form>
      </div>
       <style>{`
        @keyframes modal-enter {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-modal-enter {
          animation: modal-enter 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventModal;
