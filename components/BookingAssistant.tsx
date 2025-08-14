import React from 'react';
import { BookingPersona } from '../types';
import { CoupleIcon, FamilyIcon, MovieLoverIcon } from './Icons';

interface BookingAssistantProps {
  selectedPersona: BookingPersona | null;
  onPersonaChange: (persona: BookingPersona | null, familySize?: number) => void;
  familySize: number;
  onFamilySizeChange: (size: number) => void;
}

export const BookingAssistant: React.FC<BookingAssistantProps> = ({
  selectedPersona,
  onPersonaChange,
  familySize,
  onFamilySizeChange,
}) => {
  const personas = [
    { id: BookingPersona.Couple, icon: CoupleIcon, label: 'Couple' },
    { id: BookingPersona.MovieLover, icon: MovieLoverIcon, label: 'Movie Lover' },
    { id: BookingPersona.Family, icon: FamilyIcon, label: 'Family' },
  ];

  const handlePersonaClick = (personaId: BookingPersona) => {
    const newPersona = personaId === selectedPersona ? null : personaId;
    onPersonaChange(newPersona, newPersona === BookingPersona.Family ? familySize : undefined);
  };

  const handleFamilySizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    if (size > 0 && size <= 10) { // Cap family size
      onFamilySizeChange(size);
      if (selectedPersona === BookingPersona.Family) {
        onPersonaChange(BookingPersona.Family, size);
      }
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-md">
      <h4 className="font-bold text-lg text-black dark:text-white mb-3 text-center">✨ Let us find the perfect seats!</h4>
      <div className="grid grid-cols-3 gap-2">
        {personas.map(p => (
          <button
            key={p.id}
            onClick={() => handlePersonaClick(p.id)}
            className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${selectedPersona === p.id ? 'bg-cyan-100 dark:bg-cyan-800/50 border-cyan-500' : 'bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-cyan-300'}`}
          >
            <p.icon className="w-8 h-8 mb-1 text-cyan-600 dark:text-cyan-400" />
            <span className="text-xs font-semibold text-black dark:text-gray-200 text-center">{p.label}</span>
          </button>
        ))}
      </div>
      {selectedPersona === BookingPersona.Family && (
        <div className="mt-3 animate-slide-in-down">
          <label htmlFor="familySize" className="text-sm font-medium text-black dark:text-gray-300 block text-center mb-1">
            How many in your family?
          </label>
          <input
            type="number"
            id="familySize"
            value={familySize}
            onChange={handleFamilySizeInput}
            min="2"
            max="10"
            className="w-full text-center px-3 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black dark:text-white"
          />
        </div>
      )}
    </div>
  );
};
