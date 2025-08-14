import React, { useState, useEffect } from 'react';
import * as api from './backend';
import { Location } from '../types';

interface LocationPageProps {
  onLocationSelect: (location: Location) => void;
}

export const LocationPage: React.FC<LocationPageProps> = ({ onLocationSelect }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getLocations().then(fetchedLocations => {
      setLocations(fetchedLocations);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
          Where are you watching from?
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Select your city to see movies and showtimes near you.
        </p>
        
        {isLoading ? (
          <p>Loading locations...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {locations.map(location => (
              <button
                key={location.id}
                onClick={() => onLocationSelect(location)}
                className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                <span className="text-lg font-semibold text-black dark:text-gray-200">{location.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};