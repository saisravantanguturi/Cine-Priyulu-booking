import React, { useState, useEffect } from 'react';
import { CloseIcon } from './Icons';
import { Movie } from '../types';

interface MovieDateAndLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
  onFindShowtimes: (date: string, language: string) => void;
  isLoading: boolean;
}

export const MovieDateAndLanguageModal: React.FC<MovieDateAndLanguageModalProps> = ({ isOpen, onClose, movie, onFindShowtimes, isLoading }) => {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const today = new Date();
      const availableDates = Array.from({ length: 5 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date.toISOString().split('T')[0];
      });
      setDates(availableDates);
      setSelectedDate(availableDates[0]);
      setSelectedLanguage(movie.availableLanguages[0] || '');
    }
  }, [isOpen, movie.availableLanguages]);

  if (!isOpen) return null;
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if(date.toDateString() === today.toDateString()) return 'Today';
    if(date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };
  
  const handleFindClick = () => {
    if(selectedDate && selectedLanguage) {
        onFindShowtimes(selectedDate, selectedLanguage);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-fast"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden max-w-lg w-11/12 transform transition-all duration-300 animate-slide-in-up-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-black dark:text-white">{movie.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
            <div>
                <h4 className="font-semibold text-black dark:text-gray-300 mb-2">Select Date</h4>
                <div className="flex flex-wrap gap-2">
                    {dates.map(date => (
                        <button key={date} onClick={() => setSelectedDate(date)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${selectedDate === date ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-transparent border-gray-300 dark:border-gray-700 hover:border-cyan-400'}`}>
                            {formatDate(date)}
                        </button>
                    ))}
                </div>
            </div>
             <div>
                <h4 className="font-semibold text-black dark:text-gray-300 mb-2">Select Language</h4>
                <div className="flex flex-wrap gap-2">
                    {movie.availableLanguages.map(lang => (
                        <button key={lang} onClick={() => setSelectedLanguage(lang)} className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${selectedLanguage === lang ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-transparent border-gray-300 dark:border-gray-700 hover:border-cyan-400'}`}>
                            {lang}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleFindClick}
            disabled={isLoading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg interactive-button disabled:bg-gray-400"
          >
            {isLoading ? 'Finding...' : 'Find Showtimes'}
          </button>
        </div>
      </div>
    </div>
  );
};
