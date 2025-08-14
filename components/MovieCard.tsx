import React from 'react';
import { Movie, Theater, Showtime } from '../types';

interface ShowtimeButtonProps {
  showtime: Showtime;
  onSelect: () => void;
}

const ShowtimeButton: React.FC<ShowtimeButtonProps> = ({ showtime, onSelect }) => {
  const availability = showtime.totalSeats > 0 ? (showtime.totalSeats - showtime.filledSeats) / showtime.totalSeats : 0;
  const showtimeDate = new Date(showtime.dateTime);
  const isPast = showtimeDate < new Date();
  const timeString = showtimeDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const getAvailabilityInfo = () => {
    if (isPast) return { className: 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed', label: 'Started', labelColor: 'text-gray-500 dark:text-gray-400' };
    if (availability < 0.15) return { className: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700/80', label: 'Filling Fast', labelColor: 'text-red-600 dark:text-red-400' };
    if (availability < 0.5) return { className: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/80', label: 'Available', labelColor: 'text-yellow-600 dark:text-yellow-400' };
    return { className: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700/80', label: 'Available', labelColor: 'text-green-600 dark:text-green-400' };
  };

  const { className, label, labelColor } = getAvailabilityInfo();

  return (
    <button
      onClick={onSelect}
      disabled={isPast}
      className={`px-3 py-1.5 rounded-md transition-all duration-200 focus:outline-none interactive-button border ${className} hover:scale-105 flex flex-col items-center justify-center min-w-[90px]`}
    >
      <span className="font-bold text-base">{timeString}</span>
      <span className={`text-xs font-medium ${labelColor}`}>{label}</span>
    </button>
  );
};


interface MovieCardProps {
  movie: Movie;
  theaters: Theater[];
  showtimes: { [theaterId: string]: Showtime[] };
  onSelectShowtime: (info: {movieId: string, theaterId: string, showtimeId: string}) => void;
  onClickMovie: () => void;
  isExpanded: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, theaters, showtimes, onSelectShowtime, onClickMovie, isExpanded }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-950 rounded-xl overflow-hidden shadow-lg p-5 movie-card"
      style={{ '--theme-color-glow': movie.themeColor } as React.CSSProperties}
    >
      <div className="flex flex-col md:flex-row gap-6 cursor-pointer" onClick={onClickMovie}>
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-full md:w-1/4 h-auto object-cover rounded-lg self-start" />
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-black dark:text-white">{movie.title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 mb-4">{movie.genre}</p>
          {!isExpanded && (
            <div className="text-cyan-600 dark:text-cyan-400 font-semibold">Click to select date and language</div>
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-4 pt-4 border-t border-gray-200 dark:border-gray-800 animate-slide-in-up">
           {theaters.length > 0 && Object.values(showtimes).some(s => s.length > 0) ? theaters.map((theater: Theater) => (
            showtimes[theater.id] && showtimes[theater.id].length > 0 &&
            <div key={theater.id}>
              <h3 className="text-lg font-semibold text-cyan-700 dark:text-cyan-400">{theater.name}</h3>
              <div className="flex flex-wrap gap-3 mt-2">
                {showtimes[theater.id]?.map((showtime: Showtime) => (
                   <ShowtimeButton 
                     key={showtime.id}
                     showtime={showtime}
                     onSelect={() => onSelectShowtime({ movieId: movie.id, theaterId: theater.id, showtimeId: showtime.id })}
                   />
                ))}
              </div>
            </div>
          )) : <p className="text-gray-500 dark:text-gray-400">No showtimes available for this selection.</p>}
        </div>
      )}
    </div>
  );
};
