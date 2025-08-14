import React, { useState, useEffect, useMemo } from 'react';

interface CountdownTimerProps {
  targetDate: string; // ISO string
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const eventDateTime = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

    const calculateTimeLeft = () => {
        const now = new Date().getTime();
        const distance = eventDateTime - now;

        if (distance < 0) {
            return null;
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [eventDateTime]);
    
    if (!timeLeft) {
        return (
            <div className="text-center bg-red-500/20 border border-red-500 text-red-500 font-bold p-3 rounded-lg">
                Showtime has started. Booking is closed.
            </div>
        )
    }

    const isPulsing = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes < 10;
    const format = (num: number) => num.toString().padStart(2, '0');

    return (
        <div id="countdown-container" className="text-center">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-2">Time left to book:</h3>
            <div id="countdown" className="flex justify-center gap-2 sm:gap-4">
                {timeLeft.days > 0 && (
                     <div className="time-box bg-gray-900/80 dark:bg-black/50">
                        <span id="days">{format(timeLeft.days)}</span><label>Days</label>
                    </div>
                )}
                 {(timeLeft.days > 0 || timeLeft.hours > 0) && (
                    <div className={`time-box bg-gray-900/80 dark:bg-black/50 ${isPulsing ? 'pulse' : ''}`}>
                        <span id="hours">{format(timeLeft.hours)}</span><label>Hours</label>
                    </div>
                 )}
                <div className={`time-box bg-gray-900/80 dark:bg-black/50 ${isPulsing ? 'pulse' : ''}`}>
                    <span id="minutes">{format(timeLeft.minutes)}</span><label>Minutes</label>
                </div>
                <div className={`time-box bg-gray-900/80 dark:bg-black/50 ${isPulsing ? 'pulse' : ''}`}>
                    <span id="seconds">{format(timeLeft.seconds)}</span><label>Seconds</label>
                </div>
            </div>
        </div>
    );
}

export default CountdownTimer;