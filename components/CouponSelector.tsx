import React, { useState, useEffect } from 'react';
import { Coupon } from '../types';

interface CouponSelectorProps {
  coupons: Coupon[];
  onApplyCoupon: (coupon: Coupon | null) => void;
  selectedSeatsCount: number;
}

export const CouponSelector: React.FC<CouponSelectorProps> = ({ coupons, onApplyCoupon, selectedSeatsCount }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const applyCouponLogic = (couponToApply: Coupon | null) => {
    if (!couponToApply) {
        onApplyCoupon(null);
        setError('');
        setSuccess('');
        return;
    }

    if (couponToApply.code === 'FAMILYFUN' && selectedSeatsCount < 4) {
      setError('"FAMILYFUN" coupon is only valid for 4 or more tickets.');
      setSuccess('');
      onApplyCoupon(null);
      return false;
    }
    
    setError('');
    setSuccess(`Coupon "${couponToApply.code}" applied!`);
    onApplyCoupon(couponToApply);
    return true;
  }

  const handleApply = () => {
    setError('');
    setSuccess('');
    const coupon = coupons.find(c => c.code.toLowerCase() === inputValue.toLowerCase());
    if (coupon) {
      applyCouponLogic(coupon);
    } else {
      onApplyCoupon(null);
      setError('Invalid coupon code.');
    }
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setInputValue(code);
    if (code) {
        const coupon = coupons.find(c => c.code === code);
        if (coupon) {
            applyCouponLogic(coupon);
        }
    } else {
        applyCouponLogic(null);
    }
  }

  useEffect(() => {
    setInputValue('');
    setError('');
    setSuccess('');
    onApplyCoupon(null);
  }, [selectedSeatsCount]);


  return (
    <div className="space-y-2">
      <label htmlFor="coupon-select" className="block text-sm font-medium text-black dark:text-gray-300">
        Apply Coupon
      </label>
       <select
        id="coupon-select"
        onChange={handleSelectChange}
        className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
      >
        <option value="">Select a coupon...</option>
        {coupons.map(c => (
          <option key={c.code} value={c.code}>
            {c.code} - {c.description}
          </option>
        ))}
      </select>
      
      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value.toUpperCase())}
          placeholder="Or enter code here"
          className="block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 text-sm"
        />
        <button
          onClick={handleApply}
          className="px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
        >
          Apply
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </div>
  );
};