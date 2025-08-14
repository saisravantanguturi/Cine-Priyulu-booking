import React, { useMemo } from 'react';
import { Seat, SeatLayout, BookingPersona, Movie, Theater, Showtime, SeatStatus } from '../types';
import { SeatingChart } from './SeatingChart';
import { BookingAssistant } from './BookingAssistant';
import { BookingSummary } from './BookingSummary';
import { CURRENCY_SYMBOL, SEAT_PRICE } from '../constants';
import { TicketIcon } from './Icons';
import CountdownTimer from './CountdownTimer';

interface SeatingPageProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  seats: Seat[];
  layout: SeatLayout;
  selectedSeats: Seat[];
  suggestedSeatIds: Set<string>;
  persona: BookingPersona | null;
  familySize: number;
  onSelectSeat: (seatId: string) => void;
  onPreviewSeat: (seat: Seat) => void;
  onProceedToPayment: () => void;
  onBack: () => void;
  onPersonaChange: (persona: BookingPersona | null, familySize?: number) => void;
  onFamilySizeChange: (size: number) => void;
  viewMode: 'desktop' | 'mobile';
}

export const SeatingPage: React.FC<SeatingPageProps> = ({
  movie,
  theater,
  showtime,
  seats,
  layout,
  selectedSeats,
  suggestedSeatIds,
  persona,
  familySize,
  onSelectSeat,
  onPreviewSeat,
  onProceedToPayment,
  onBack,
  onPersonaChange,
  onFamilySizeChange,
  viewMode,
}) => {
  const isMobile = viewMode === 'mobile';

  const topRowsNotification = useMemo(() => {
    // Top rows are at the back of the theater, which are first in our layout.rows array.
    // Let's consider the first 30% of rows as "top rows" (e.g., A, B for an 8-row layout).
    const topRowCount = Math.ceil(layout.rows.length * 0.3);
    const topRowsSet = new Set(layout.rows.slice(0, topRowCount));

    if (topRowsSet.size === 0) return null;

    const topRowSeats = seats.filter(s => 
        topRowsSet.has(s.row) && s.status !== SeatStatus.Blocked
    );
    
    if (topRowSeats.length === 0) return null;

    const filledTopRowSeats = topRowSeats.filter(s => s.status === SeatStatus.Filled).length;
    const fillRatio = filledTopRowSeats / topRowSeats.length;
    
    if (fillRatio > 0.9) { // If more than 90% of top rows are filled
        return "Heads up! The back rows are almost full. Great seats still available toward the front!";
    }

    return null;
  }, [seats, layout]);

  return (
    <div className={`max-w-7xl mx-auto animate-fade-in-page ${isMobile ? 'pb-32' : ''}`}>
       <header className="flex items-center gap-4 mb-4 md:mb-6">
          <button onClick={onBack} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 font-semibold p-2 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-800/50 transition-colors">&larr; Back to Movies</button>
       </header>

        <div className="mb-4 md:mb-6">
            <CountdownTimer targetDate={showtime.dateTime} />
        </div>

        {topRowsNotification && (
          <div className="text-center p-3 mb-4 bg-yellow-100 dark:bg-yellow-800/50 border border-yellow-300 dark:border-yellow-600 rounded-lg text-yellow-800 dark:text-yellow-200 font-semibold animate-fade-in-page">
              {topRowsNotification}
          </div>
        )}

       {isMobile ? (
         <div className="space-y-4">
            <BookingAssistant 
                selectedPersona={persona}
                onPersonaChange={onPersonaChange}
                familySize={familySize}
                onFamilySizeChange={onFamilySizeChange}
            />
             <SeatingChart 
                isMobile={isMobile}
                seats={seats} 
                layout={layout}
                onSelectSeat={onSelectSeat}
                onPreviewSeat={onPreviewSeat}
                suggestedSeatIds={suggestedSeatIds}
                themeColor={movie.themeColor}
            />
         </div>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <main className="md:col-span-2">
                 <SeatingChart 
                    isMobile={isMobile}
                    seats={seats} 
                    layout={layout}
                    onSelectSeat={onSelectSeat}
                    onPreviewSeat={onPreviewSeat}
                    suggestedSeatIds={suggestedSeatIds}
                    themeColor={movie.themeColor}
                />
            </main>
            <aside className="md:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <BookingAssistant 
                        selectedPersona={persona}
                        onPersonaChange={onPersonaChange}
                        familySize={familySize}
                        onFamilySizeChange={onFamilySizeChange}
                    />
                    <BookingSummary 
                        selectedSeats={selectedSeats} 
                        onProceedToPayment={onProceedToPayment}
                    />
                </div>
            </aside>
       </div>
       )}

      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 w-full z-10 p-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-out">
            {selectedSeats.length === 0 ? (
                <p className="text-black dark:text-gray-400 text-center">Please select seats to continue.</p>
            ) : (
                <div className="flex items-center justify-between gap-4 animate-slide-in-up-fast">
                <div>
                    <p className="text-lg font-bold text-black dark:text-white">{selectedSeats.length} Ticket(s)</p>
                    <p className="text-sm font-bold text-cyan-600 dark:text-cyan-500 animate-price-pulse">{CURRENCY_SYMBOL}{selectedSeats.length * SEAT_PRICE}</p>
                </div>
                <button
                    onClick={onProceedToPayment}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 interactive-button"
                >
                    <TicketIcon id="mobile-booking-icon" className="w-5 h-5" />
                    Proceed to Payment
                </button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
