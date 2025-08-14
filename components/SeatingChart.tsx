import React, { useRef, useEffect } from 'react';
import { Seat, SeatLayout, SeatStatus } from '../types';
import { SeatIcon, BlockedSeatIcon, EyeIcon } from './Icons';
import { animateSeatSelection } from './seatAnimation';

interface SeatProps {
  seat: Seat;
  onSelect: (seatId: string) => void;
  onPreview: (seat: Seat) => void;
  isSuggested: boolean;
  isMobile: boolean;
}

const SeatComponent: React.FC<SeatProps> = ({ seat, onSelect, onPreview, isSuggested, isMobile }) => {
  const seatRef = useRef<HTMLDivElement>(null);
  const prevStatus = useRef(seat.status);

  useEffect(() => {
    if (seat.status === SeatStatus.Selected && prevStatus.current !== SeatStatus.Selected) {
      if (seatRef.current) {
        const cartIconId = isMobile ? 'mobile-booking-icon' : 'booking-summary-icon';
        animateSeatSelection(seatRef.current, cartIconId);
      }
    }
    prevStatus.current = seat.status;
  }, [seat.status, isMobile]);

  const getSeatClass = () => {
    if (isSuggested && seat.status === SeatStatus.Available) {
      return 'text-green-500 animate-pulse';
    }
    switch (seat.status) {
      case SeatStatus.Available:
        return 'text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400';
      case SeatStatus.Selected:
        return 'text-blue-500 dark:text-blue-400';
      case SeatStatus.Filled:
        return 'text-gray-700 dark:text-gray-300 cursor-not-allowed';
      case SeatStatus.Blocked:
        return 'text-gray-300 dark:text-gray-600 cursor-not-allowed';
      default:
        return 'text-gray-300 dark:text-gray-600';
    }
  };

  const iconSize = isMobile ? 'w-5 h-5' : 'w-6 h-6';
  const canBeInteractedWith = seat.status === SeatStatus.Available || seat.status === SeatStatus.Selected;

  const handleSeatClick = () => {
    if (canBeInteractedWith) {
      onSelect(seat.id);
    }
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop the event from bubbling up to the parent div's handler
    onPreview(seat);
  };

  return (
    <div
      ref={seatRef}
      className={`relative group flex flex-col items-center ${canBeInteractedWith ? 'cursor-pointer' : ''}`}
      onClick={handleSeatClick}
    >
      {seat.status === SeatStatus.Blocked
        ? <BlockedSeatIcon className={`${iconSize} transition-colors duration-200 ${getSeatClass()}`} />
        : <SeatIcon className={`${iconSize} transition-colors duration-200 ${getSeatClass()}`} />
      }
      <span className="text-xs text-gray-600 dark:text-gray-400">{seat.id}</span>

      {canBeInteractedWith && (
        <div
          className="absolute -top-3 -right-2 z-10 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 pointer-events-none group-hover:pointer-events-auto"
          onClick={handlePreviewClick}
          aria-label={`Preview view from seat ${seat.id}`}
        >
          <EyeIcon className="w-4 h-4 text-cyan-500" />
        </div>
      )}
    </div>
  );
};

const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface SeatingChartProps {
  seats: Seat[];
  layout: SeatLayout;
  onSelectSeat: (seatId: string) => void;
  onPreviewSeat: (seat: Seat) => void;
  suggestedSeatIds: Set<string>;
  themeColor?: string;
  isMobile?: boolean;
}

export const SeatingChart: React.FC<SeatingChartProps> = ({ seats, layout, onSelectSeat, onPreviewSeat, suggestedSeatIds, themeColor, isMobile = false }) => {
  const glowColor = themeColor ? hexToRgba(themeColor, 0.4) : 'rgba(74, 222, 222, 0.25)';
  const rowGap = isMobile ? 'gap-1' : 'gap-2';
  const seatGap = isMobile ? 'gap-0.5' : 'gap-1';
  const aisleWidth = isMobile ? 'w-3' : 'w-4';
  
  return (
    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm p-4 md:p-6 rounded-xl shadow-inner">
      <div className="w-full flex justify-center mb-8" style={{ perspective: '200px' }}>
        <div
          className="w-3/4 h-12 bg-white dark:bg-gray-400 rounded-md transition-all duration-500"
          style={{
            transform: 'rotateX(-40deg)',
            boxShadow: `0 0 25px 5px rgba(255, 255, 255, 0.8), 0 0 35px 15px ${glowColor}`,
            transformOrigin: 'center bottom'
          }}
        ></div>
      </div>
      <p className="text-center text-black dark:text-gray-400 font-semibold tracking-widest -mt-4 mb-8">SCREEN</p>
      
      <div className={`flex flex-col ${rowGap}`}>
        {[...layout.rows].reverse().map(row => (
          <div key={row} className={`flex items-center justify-center ${isMobile ? 'gap-1' : 'gap-1.5'}`}>
            <span className="w-6 text-center font-bold text-black dark:text-gray-400">{row}</span>
            <div className={`flex-grow flex justify-center items-center ${seatGap}`}>
              {Array.from({ length: layout.seatsPerRow }, (_, i) => i + 1).map(seatNumber => {
                const seatId = `${row}${seatNumber}`;
                const seat = seats.find(s => s.id === seatId);

                return (
                  <React.Fragment key={seatId}>
                    {seat ? (
                      <SeatComponent 
                        seat={seat} 
                        onSelect={onSelectSeat} 
                        onPreview={onPreviewSeat}
                        isSuggested={suggestedSeatIds.has(seat.id)}
                        isMobile={isMobile}
                      />
                    ) : (
                      <div className={isMobile ? 'w-5' : 'w-6'} /> // Gap for entry/path
                    )}
                    {layout.aisles.includes(seatNumber) && (
                      <div className={aisleWidth} /> // Vertical aisle
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <span className="w-6 text-center font-bold text-black dark:text-gray-400">{row}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-black dark:text-gray-300">
        <div className="flex items-center gap-2"><SeatIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" /> Available</div>
        <div className="flex items-center gap-2"><SeatIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" /> Selected</div>
        <div className="flex items-center gap-2"><SeatIcon className="w-5 h-5 text-green-500" /> Suggested</div>
        <div className="flex items-center gap-2"><SeatIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> Booked</div>
      </div>
    </div>
  );
};