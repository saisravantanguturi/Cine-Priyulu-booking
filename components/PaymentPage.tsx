import React, { useState, useMemo } from 'react';
import { Movie, Theater, Showtime, Location, Seat, Coupon } from '../types';
import { SEAT_PRICE, CURRENCY_SYMBOL } from '../constants';
import { CouponSelector } from './CouponSelector';
import { ShareIcon } from './Icons';

interface PaymentPageProps {
  movie: Movie;
  theater: Theater;
  showtime: Showtime;
  date: string;
  location: Location;
  selectedSeats: Seat[];
  coupons: Coupon[];
  onConfirmBooking: (finalPrice: number) => void;
  onBack: () => void;
  isLoading: boolean;
  onInitiateGroupPay: () => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  movie,
  theater,
  showtime,
  date,
  location,
  selectedSeats,
  coupons,
  onConfirmBooking,
  onBack,
  isLoading,
  onInitiateGroupPay
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const { subtotal, discount, total } = useMemo(() => {
    const sub = selectedSeats.length * SEAT_PRICE;
    let disc = 0;
    if (appliedCoupon) {
      if (appliedCoupon.code === 'FAMILYFUN' && selectedSeats.length < 4) {
          // Special condition for FAMILYFUN coupon
          return { subtotal: sub, discount: 0, total: sub };
      }
      if (appliedCoupon.discountType === 'fixed') {
        disc = appliedCoupon.value;
      } else if (appliedCoupon.discountType === 'percentage') {
        disc = (sub * appliedCoupon.value) / 100;
      }
    }
    const finalTotal = Math.max(0, sub - disc);
    return { subtotal: sub, discount: disc, total: finalTotal };
  }, [selectedSeats, appliedCoupon]);

  const handleConfirm = () => {
    if(!isLoading) {
        onConfirmBooking(total);
    }
  }

  const showDateTime = new Date(showtime.dateTime);
  const timeString = showDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-page">
      <header className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-black dark:text-white">Payment</h2>
        <button onClick={onBack} className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-200 font-semibold p-2 rounded-md hover:bg-cyan-50 dark:hover:bg-cyan-800/50 transition-colors">&larr; Back to Seating</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Booking Summary</h3>
          <div className="flex gap-4 items-start pb-4 border-b border-gray-200 dark:border-gray-800">
            <img src={movie.posterUrl} alt={movie.title} className="w-20 rounded-md"/>
            <div>
              <h4 className="font-bold text-xl text-black dark:text-white">{movie.title}</h4>
              <p className="text-gray-600 dark:text-gray-400">{theater.name}, {location.name}</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 text-black dark:text-gray-300">
            <div className="flex justify-between"><span className="font-semibold">Date:</span><span>{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex justify-between"><span className="font-semibold">Time:</span><span>{timeString} ({showtime.language})</span></div>
            <div className="flex justify-between"><span className="font-semibold">Seats:</span><span>{selectedSeats.map(s => s.id).join(', ')} ({selectedSeats.length} tickets)</span></div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
           <h3 className="text-2xl font-bold text-black dark:text-white mb-4">Price Details</h3>
           <CouponSelector coupons={coupons} onApplyCoupon={setAppliedCoupon} selectedSeatsCount={selectedSeats.length} />

           <div className="mt-6 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800 text-black dark:text-gray-200">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{CURRENCY_SYMBOL}{subtotal.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-green-600 dark:text-green-400 ${discount > 0 ? 'visible' : 'invisible'}`}>
                    <span>Coupon Discount</span>
                    <span>- {CURRENCY_SYMBOL}{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2 border-t border-gray-300 dark:border-gray-700 mt-2">
                    <span>Total</span>
                    <span>{CURRENCY_SYMBOL}{total.toFixed(2)}</span>
                </div>
           </div>

           <div className='mt-6 space-y-2'>
            <button 
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg interactive-button disabled:bg-gray-400"
            >
                {isLoading ? 'Processing...' : `Confirm & Pay ${CURRENCY_SYMBOL}${total.toFixed(2)}`}
            </button>
            <button 
                onClick={onInitiateGroupPay}
                disabled={isLoading || selectedSeats.length < 2}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg interactive-button disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                <ShareIcon className="w-5 h-5"/>
                {selectedSeats.length < 2 ? 'Select 2+ seats to split' : 'Split with Friends'}
            </button>
           </div>
           <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-2">*This is a simulated payment.</p>
        </div>
      </div>
    </div>
  );
};