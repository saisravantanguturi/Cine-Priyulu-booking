import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GroupPaySession, User } from '../types';
import * as api from './backend';
import { CloseIcon, CopyIcon, ShareIcon } from './Icons';
import { SEAT_PRICE, CURRENCY_SYMBOL } from '../constants';

interface GroupPayModalProps {
  sessionId: string;
  currentUser: User;
  onClose: () => void;
  onBookingComplete: () => void;
}

const useCountdown = (expiresAt: number | undefined) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!expiresAt) return;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, expiresAt - now);
            
            if (remaining === 0) {
                setTimeLeft('00:00');
                clearInterval(intervalId);
                return;
            }

            const minutes = Math.floor((remaining / 1000 / 60) % 60).toString().padStart(2, '0');
            const seconds = Math.floor((remaining / 1000) % 60).toString().padStart(2, '0');
            setTimeLeft(`${minutes}:${seconds}`);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [expiresAt]);

    return timeLeft;
}

export const GroupPayModal: React.FC<GroupPayModalProps> = ({ sessionId, currentUser, onClose, onBookingComplete }) => {
    const [session, setSession] = useState<GroupPaySession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [copied, setCopied] = useState(false);

    const timeLeft = useCountdown(session?.expiresAt);
    const shareLink = useMemo(() => `${window.location.origin}${window.location.pathname}?groupPay=${sessionId}`, [sessionId]);

    const fetchSession = useCallback(async () => {
        try {
            const data = await api.getGroupPaySession(sessionId);
            if (data) {
                setSession(data);
                if (data.status === 'completed') {
                    setTimeout(() => onBookingComplete(), 3000);
                }
            } else {
                setError('Group payment session not found.');
            }
        } catch (e) {
            setError('Failed to load session details.');
        } finally {
            setIsLoading(false);
        }
    }, [sessionId, onBookingComplete]);

    useEffect(() => {
        fetchSession();
        const intervalId = setInterval(fetchSession, 5000); // Poll every 5 seconds
        return () => clearInterval(intervalId);
    }, [fetchSession]);

    const handlePayForSeat = async (seatId: string) => {
        setIsPaying(true);
        try {
            const updatedSession = await api.payForGroupSeat({ sessionId, seatId, user: currentUser });
            if (updatedSession) {
                setSession(updatedSession);
                 if (updatedSession.status === 'completed') {
                    setTimeout(() => onBookingComplete(), 3000);
                }
            } else {
                alert('Payment failed. The seat might have been taken or the session expired.');
            }
        } catch (e) {
            alert('An error occurred during payment.');
        } finally {
            setIsPaying(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    
    const renderContent = () => {
        if(isLoading) return <div className="text-center p-8">Loading session...</div>
        if(error) return <div className="text-center p-8 text-red-500">{error}</div>
        if(!session) return <div className="text-center p-8">Could not load session.</div>;

        switch(session.status) {
            case 'completed':
                return (
                     <div className="text-center p-8 space-y-4">
                        <h3 className="text-2xl font-bold text-green-500">Booking Confirmed!</h3>
                        <p className="text-gray-600 dark:text-gray-300">All payments received. Enjoy the movie!</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">This window will close automatically.</p>
                    </div>
                )
            case 'expired':
                return (
                    <div className="text-center p-8 space-y-4">
                        <h3 className="text-2xl font-bold text-red-500">Session Expired</h3>
                        <p className="text-gray-600 dark:text-gray-300">The 10-minute window to complete the payment has passed. The seats have been released.</p>
                        <button onClick={onClose} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg interactive-button">Close</button>
                    </div>
                )
            case 'pending':
                return (
                    <div className="p-6">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-black dark:text-white">Pay Together, Enjoy Together!</h3>
                            <p className="text-gray-600 dark:text-gray-400">Share this link with your friends to pay for the seats.</p>
                        </div>

                        <div className="mb-4 relative">
                            <input type="text" readOnly value={shareLink} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2 pr-10"/>
                            <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-cyan-500">
                                <CopyIcon className="w-5 h-5"/>
                            </button>
                             {copied && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-md">Copied!</span>}
                        </div>
                        
                        <div className="text-center font-bold text-2xl text-red-500 mb-4 animate-pulse">
                            Time left: {timeLeft}
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                           {Object.entries(session.seatPayments).map(([seatId, payment]) => (
                               <div key={seatId} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                   <div>
                                       <p className="font-bold text-black dark:text-white">Seat {seatId}</p>
                                        {payment.status === 'paid' ? (
                                             <p className="text-sm text-green-500">Paid by {payment.paidBy}</p>
                                        ) : (
                                            <p className="text-sm text-yellow-500">Awaiting payment</p>
                                        )}
                                   </div>
                                    {payment.status === 'unpaid' ? (
                                        <button onClick={() => handlePayForSeat(seatId)} disabled={isPaying} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg text-sm interactive-button disabled:bg-gray-400">
                                            {isPaying ? 'Paying...' : `Pay ${CURRENCY_SYMBOL}${SEAT_PRICE}`}
                                        </button>
                                    ) : (
                                        <div className="w-24 text-center">✅</div>
                                    )}
                               </div>
                           ))}
                        </div>
                    </div>
                )
        }
    }


    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in-fast"
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden max-w-md w-11/12 transform transition-all duration-300 animate-slide-in-up relative"
            >
                <button onClick={onClose} className="absolute top-2 right-2 z-20 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close">
                    <CloseIcon className="w-6 h-6" />
                </button>
                {renderContent()}
            </div>
        </div>
    )
}