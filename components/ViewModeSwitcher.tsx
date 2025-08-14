import React from 'react';

// Simple icons for the switcher
const DesktopIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MobileIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);


interface ViewModeSwitcherProps {
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
}

export const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="absolute top-24 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-1 rounded-full shadow-md flex items-center gap-1 z-20">
      <button
        onClick={() => onViewModeChange('desktop')}
        className={`p-2 rounded-full transition-colors ${viewMode === 'desktop' ? 'bg-cyan-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        aria-label="Switch to Desktop View"
      >
        <DesktopIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewModeChange('mobile')}
        className={`p-2 rounded-full transition-colors ${viewMode === 'mobile' ? 'bg-cyan-500 text-white' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
        aria-label="Switch to Mobile View"
      >
        <MobileIcon className="w-5 h-5" />
      </button>
    </div>
  );
};