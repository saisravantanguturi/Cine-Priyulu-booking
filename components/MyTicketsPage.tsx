import React, { useState, useEffect, useCallback } from 'react';
import { Booking } from '../types';
import * as api from './backend';
import { TicketCard } from './TicketCard';

interface MyTicketsPageProps {
  userId: string;
  onBack: () => void;
  onStartArNavigation: (booking: Booking) => void;
}

export const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ userId, onBack, onStartArNavigation }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTickets = useCallback(() => {
     setIsLoading(true);
     api.getTicketsForUser(userId).then(userBookings => {
      setBookings(userBookings);
      setIsLoading(false);
    });
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleMarkUpgradeSeen = useCallback(async (bookingId: string) => {
      await api.markUpgradeAsSeen(bookingId);
      // Re-fetch or update state locally to reflect the change
      setBookings(prevBookings => 
          prevBookings.map(b => 
              b.id === bookingId ? { ...b, hasSeenUpgrade: true } : b
          )
      );
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-page">
      <header className="flex items-center justify-between mb-6">
         <h2 className="text-3xl font-bold text-black dark:text-white">My Tickets</h2>
         <button onClick={onBack} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 font-semibold p-2 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-800/50 transition-colors">&larr; Back to Home</button>
      </header>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">Loading your tickets...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
            <p className="text-xl font-semibold text-black dark:text-gray-200">No Tickets Yet!</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Your booked tickets will appear here.</p>
            <button onClick={onBack} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg interactive-button">
                Book a Movie
            </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <TicketCard 
                key={booking.id} 
                booking={booking} 
                onStartArNavigation={onStartArNavigation}
                onMarkUpgradeSeen={handleMarkUpgradeSeen} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
