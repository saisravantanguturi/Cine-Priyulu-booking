import React, { useState, useEffect } from 'react';
import { Booking } from '../types';
import { CURRENCY_SYMBOL } from '../constants';
import { CameraIcon } from './Icons';
import { Confetti } from './Confetti';

interface TicketCardProps {
  booking: Booking;
  onStartArNavigation: (booking: Booking) => void;
  onMarkUpgradeSeen: (bookingId: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ booking, onStartArNavigation, onMarkUpgradeSeen }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const isUpgraded = !!booking.upgradedFrom;

  useEffect(() => {
    if (isUpgraded && !booking.hasSeenUpgrade) {
      setShowConfetti(true);
    }
  }, [isUpgraded, booking.hasSeenUpgrade]);
  
  const handleConfettiComplete = () => {
      setShowConfetti(false);
      onMarkUpgradeSeen(booking.id);
  }

  const cardClasses = `
    bg-white dark:bg-gray-900 rounded-2xl shadow-lg flex flex-col sm:flex-row overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl
    ${isUpgraded ? 'upgraded-ticket-glow' : ''}
  `;

  return (
    <div className={cardClasses}>
      {showConfetti && <Confetti onComplete={handleConfettiComplete} />}
      <img src={booking.posterUrl} alt={`${booking.movieTitle} poster`} className="w-full sm:w-1/3 md:w-1/4 h-auto object-cover" />
      
      <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
        <div>
          {isUpgraded && (
              <div className="mb-2 text-center bg-yellow-400/20 border-2 border-yellow-500 rounded-md p-1">
                  <p className="font-bold text-yellow-500 dark:text-yellow-400 text-sm animate-pulse">🎉 YOU'VE BEEN UPGRADED! 🎉</p>
              </div>
          )}
          <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white">{booking.movieTitle}</h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{booking.theaterName}, {booking.locationName}</p>
        </div>
        <div className="my-3 md:my-4 grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            <div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">Date</p>
                <p className="font-bold text-black dark:text-white">{booking.date}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">Showtime</p>
                <p className="font-bold text-black dark:text-white">{booking.showtime}</p>
            </div>
            <div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">Language</p>
                <p className="font-bold text-black dark:text-white">{booking.language}</p>
            </div>
            <div className="col-span-2">
                <p className="font-semibold text-gray-600 dark:text-gray-400">Seats</p>
                {isUpgraded ? (
                     <p className="font-bold text-black dark:text-white text-lg">
                       <del className="text-red-500/80">{booking.upgradedFrom}</del>
                       <span className="mx-2">&rarr;</span>
                       <span className="text-yellow-500 dark:text-yellow-400">{booking.seats.join(', ')}</span>
                    </p>
                ) : (
                     <p className="font-bold text-black dark:text-white text-lg">{booking.seats.join(', ')}</p>
                )}
            </div>
             <div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">Total Paid</p>
                <p className="font-bold text-black dark:text-white">{CURRENCY_SYMBOL}{booking.pricePaid}</p>
            </div>
        </div>
         <button 
            onClick={() => onStartArNavigation(booking)}
            className="mt-2 w-full sm:w-auto self-start bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 interactive-button"
        >
            <CameraIcon className="w-5 h-5"/>
            Find My Seat with AR
        </button>
      </div>

      <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-800 border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center">
        <img src={booking.qrCodeUrl} alt="QR Code" className="w-20 h-20 md:w-28 md:h-28 rounded-md bg-white p-1" />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center break-all">{booking.id}</p>
      </div>
    </div>
  );
};
