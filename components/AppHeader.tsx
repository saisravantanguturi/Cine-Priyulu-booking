import React, { useState, useRef, useEffect } from 'react';
import { User, Location } from '../types';
import { TicketIcon } from './Icons';
import { ThemeSwitcher } from './ThemeSwitcher';
import * as api from './backend';

interface AppHeaderProps {
  user: User;
  onSignOut: () => void;
  onNavigate: (page: 'list' | 'tickets') => void;
  currentPage: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  location: Location | null;
  onChangeLocation: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ user, onSignOut, onNavigate, currentPage, theme, setTheme, location, onChangeLocation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentDate, setCurrentDate] = useState('');
  const [logoClickCount, setLogoClickCount] = useState(0);

  useEffect(() => {
    const updateDate = () => {
        const now = new Date();
        setCurrentDate(now.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        }));
    };
    updateDate();
    const intervalId = setInterval(updateDate, 60000); // Update every minute
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    if (logoClickCount === 5) {
      console.log("Admin trigger: Running seat upgrade lottery...");
      api.runGlobalSeatUpgradeLottery().then(({ upgradedCount }) => {
        alert(`✨ Seat Upgrade Lottery Finished! ✨\n\n${upgradedCount} lucky bookings have been upgraded to better seats! Check the 'My Tickets' page to see who won.`);
      });
      setLogoClickCount(0); // Reset count after triggering
    }
  }, [logoClickCount]);

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
    onNavigate('list');
  };


  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-30">
        <div className="flex items-center gap-6">
            <button
                onClick={handleLogoClick}
                className="text-xl font-bold text-black dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
            >
                🎬 Cine Priyulu
            </button>
             <button
                onClick={() => onNavigate('tickets')}
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all text-sm
                    ${currentPage === 'tickets' 
                        ? 'bg-cyan-500 text-white shadow-md' 
                        : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900'}`
                }
            >
                <TicketIcon className="w-5 h-5"/>
                My Tickets
            </button>
        </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:block text-sm font-semibold text-gray-700 dark:text-gray-300">{currentDate}</div>
        {location && (
            <button onClick={onChangeLocation} className="hidden sm:block text-sm font-semibold bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900 px-3 py-2 rounded-full">
               📍 {location.name}
            </button>
        )}
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center gap-2 p-2 rounded-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900">
             <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">{user.name}</span>
             <svg className={`w-4 h-4 transition-transform text-gray-800 dark:text-gray-100 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-xl py-2 animate-slide-in-down-fast ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                <p className="font-bold text-black dark:text-white">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
               <button
                  onClick={() => { onNavigate('tickets'); setIsDropdownOpen(false); }}
                  className="w-full text-left md:hidden flex items-center gap-2 px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                  My Tickets
              </button>
              <button
                onClick={onSignOut}
                className="w-full text-left px-4 py-2 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
