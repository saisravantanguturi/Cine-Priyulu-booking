import React from 'react';
import { Seat } from '../types';
import { TicketIcon } from './Icons';
import { CURRENCY_SYMBOL, SEAT_PRICE } from '../constants';

interface BookingSummaryProps {
  selectedSeats: Seat[];
  onProceedToPayment: () => void;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ selectedSeats, onProceedToPayment }) => {
  const totalCost = selectedSeats.length * SEAT_PRICE;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl shadow-inner">
      <h3 className="text-2xl font-bold text-black dark:text-white border-b border-gray-200 dark:border-gray-800 pb-3 mb-4">Your Selection</h3>
      {selectedSeats.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-4">Select seats to see your summary.</p>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-black dark:text-gray-300">
              <span>Selected Seats:</span>
              <span className="font-semibold text-black dark:text-gray-100">{selectedSeats.map(s => s.id).join(', ')}</span>
            </div>
            <div className="flex justify-between text-black dark:text-gray-300">
              <span>Tickets:</span>
              <span className="font-semibold text-black dark:text-gray-100">{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <span className="text-black dark:text-gray-100">Total:</span>
              <span className="text-cyan-600 dark:text-cyan-400 animate-price-pulse">{CURRENCY_SYMBOL}{totalCost}</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <button
              onClick={onProceedToPayment}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed interactive-button"
              disabled={selectedSeats.length === 0}
            >
              <TicketIcon id="booking-summary-icon" className="w-6 h-6" />
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};