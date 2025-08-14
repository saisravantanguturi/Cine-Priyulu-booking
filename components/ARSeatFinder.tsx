import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Booking, SeatLayout } from '../types';
import { CloseIcon } from './Icons';

interface ARSeatFinderProps {
  booking: Booking;
  layout: SeatLayout;
  onClose: () => void;
}

export const ARSeatFinder: React.FC<ARSeatFinderProps> = ({ booking, layout, onClose }) => {
  // Use the first seat in the booking as the destination
  const targetSeatId = booking.seats[0];

  const { targetX, targetY } = useMemo(() => {
    const row = targetSeatId.charAt(0);
    const num = parseInt(targetSeatId.slice(1), 10);
    return {
      targetX: num - 1, // 0-indexed
      targetY: layout.rows.indexOf(row), // 0-indexed
    };
  }, [targetSeatId, layout.rows]);

  // Simulate user starting at the "entrance" of the theater row layout
  const [userPosition, setUserPosition] = useState({ x: layout.seatsPerRow / 2, y: layout.rows.length + 3 });
  const arrowRef = useRef<any>(null);
  const [distance, setDistance] = useState(0);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    // Simulate user walking towards the seat
    const navigationInterval = setInterval(() => {
      setUserPosition(currentPos => {
        const dx = targetX - currentPos.x;
        const dy = targetY - currentPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setDistance(dist);

        if (dist < 1) { // If user is within 1 unit of the seat
          setArrived(true);
          clearInterval(navigationInterval);
          return currentPos;
        }

        // Move 0.5 units per tick towards the target
        const moveX = dx / dist * 0.5;
        const moveY = dy / dist * 0.5;

        return { x: currentPos.x + moveX, y: currentPos.y + moveY };
      });
    }, 500);

    return () => clearInterval(navigationInterval);
  }, [targetX, targetY]);


  useEffect(() => {
    // Update arrow direction based on user position
    const dx = targetX - userPosition.x;
    const dy = targetY - userPosition.y;
    // Calculate angle and convert to degrees for A-Frame rotation
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (arrowRef.current && arrowRef.current.object3D) {
        // We subtract 90 degrees because a cone's default "forward" is along its Y-axis.
        // We want it to point along the XY plane.
      arrowRef.current.object3D.rotation.y = THREE.MathUtils.degToRad(-angle + 90);
    }
  }, [userPosition, targetX, targetY]);


  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* A-Frame scene for AR */}
      <a-scene
        embedded
        arjs="sourceType: webcam; debugUIEnabled: false; trackingMethod: best;"
        renderer="logarithmicDepthBuffer: true;"
        vr-mode-ui="enabled: false"
      >
        <a-entity
          ref={arrowRef}
          position="0 0.5 -4"
        >
          <a-cone
            color="#06b6d4"
            radius-bottom="0.5"
            radius-top="0"
            height="1.5"
            rotation="-90 0 0"
          />
          <a-animation
            attribute="position"
            dur="1500"
            from="0 0.5 -4"
            to="0 1 -4"
            direction="alternate"
            repeat="indefinite"
            easing="ease-in-out-sine"
          />
        </a-entity>
        <a-camera-static />
      </a-scene>

      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-end pointer-events-auto">
          <button onClick={onClose} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/75 transition-colors">
            <CloseIcon className="w-8 h-8"/>
          </button>
        </div>
        <div className="bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-white text-center pointer-events-auto max-w-md mx-auto w-full">
            {arrived ? (
                <>
                    <h2 className="text-3xl font-bold text-green-400">You have arrived!</h2>
                    <p className="text-xl mt-2">This is your seat: <span className="font-bold">{targetSeatId}</span></p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold text-cyan-400">Finding Seat {targetSeatId}</h2>
                    <p className="text-lg mt-2">Follow the arrow to your destination.</p>
                    <p className="text-md mt-1 text-gray-300">Distance: {distance.toFixed(1)}m</p>
                </>
            )}
            <p className="text-xs text-gray-500 mt-4">*This is a simulated navigation experience.</p>
        </div>
      </div>
    </div>
  );
};