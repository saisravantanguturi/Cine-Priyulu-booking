import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Seat, SeatLayout, Movie } from '../types';
import { CloseIcon, SeatIcon } from './Icons';

interface SeatViewPreviewProps {
  seat: Seat;
  layout: SeatLayout;
  movie: Movie;
  onClose: () => void;
}

export const SeatViewPreview: React.FC<SeatViewPreviewProps> = ({ seat, layout, movie, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { totalRows, rowIndex, seatIndex, seatsInRow } = useMemo(() => {
    const rIndex = layout.rows.indexOf(seat.row);
    const sIndex = seat.number - 1;
    return {
      totalRows: layout.rows.length,
      rowIndex: rIndex,
      seatIndex: sIndex,
      seatsInRow: layout.seatsPerRow,
    };
  }, [seat, layout]);

  // Calculate perspective based on seat position
  const perspectiveTransform = useMemo(() => {
    // Closer seats look up more, further seats look down more.
    const verticalAngle = -10 + (rowIndex / totalRows) * 20; 
    
    // Side seats have a greater horizontal angle.
    const horizontalAngle = 20 - (seatIndex / (seatsInRow - 1)) * 40; 
    
    // Closer seats are "lower" in view, further seats are "higher"
    const yOffset = 40 - (rowIndex / totalRows) * 80;
    
    // Back rows are further away (larger Z)
    const zOffset = (totalRows - rowIndex) * -120;

    return `perspective(1000px) rotateX(${verticalAngle}deg) rotateY(${horizontalAngle}deg) translateY(${yOffset}px) translateZ(${zOffset}px)`;
  }, [rowIndex, seatIndex, totalRows, seatsInRow]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
  };
  
  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) containerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    setPan(prev => ({
      x: Math.max(-40, Math.min(40, prev.x + deltaX * 0.2)),
      y: Math.max(-25, Math.min(25, prev.y - deltaY * 0.2))
    }));
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev + e.deltaY * -0.001)));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    const currentContainer = containerRef.current;
    if (currentContainer) {
        // Add listeners to the container to handle mouse up events even if cursor leaves the window
        currentContainer.addEventListener('mouseup', handleMouseUp);
        currentContainer.addEventListener('mouseleave', handleMouseUp);
    }
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (currentContainer) {
            currentContainer.removeEventListener('mouseup', handleMouseUp);
            currentContainer.removeEventListener('mouseleave', handleMouseUp);
        }
    };
  }, [onClose]);
  
  const foregroundSeats = useMemo(() => {
    const seats = [];
    const rowsToRender = Math.min(3, totalRows - rowIndex - 1);

    for (let r = 1; r <= rowsToRender; r++) {
      const yPos = 100 - r * 15;
      const scale = 1 + r * 0.5;
      for (let s = 0; s < seatsInRow; s++) {
        const xPos = (s / (seatsInRow - 1)) * 100;
        seats.push({
          key: `fg-${r}-${s}`,
          style: {
            left: `${xPos}%`,
            bottom: `${yPos}%`,
            transform: `translateX(-50%) scale(${scale})`,
            opacity: 0.8 - r * 0.2,
          },
        });
      }
    }
    return seats;
  }, [rowIndex, totalRows, seatsInRow]);

  return (
    <div 
        className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-fade-in-fast"
        onWheel={handleWheel}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{ cursor: 'grab' }}
    >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-50 transition-colors" aria-label="Close preview">
            <CloseIcon className="w-8 h-8"/>
        </button>

        {/* Vignette and gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" style={{ zIndex: 2 }} />
        <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 150px 20px black', zIndex: 2, pointerEvents: 'none' }} />


        <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transition: 'transform 0.2s ease-out' }}>
            <div className="w-full h-full" style={{ transform: `translateX(${pan.x}px) rotateX(${pan.y}deg)`, transition: 'transform 0.1s linear' }}>
                <div className="w-full h-full" style={{ transform: perspectiveTransform, transition: 'transform 0.5s ease-out', transformStyle: 'preserve-3d' }}>
                    {/* The Screen */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div 
                            className="w-[80vw] h-[45vw] bg-cover bg-center rounded-lg shadow-2xl"
                            style={{
                                backgroundImage: `url(${movie.posterUrl})`,
                                filter: 'blur(10px)',
                                boxShadow: `0 0 35px 10px ${movie.themeColor}50, 0 0 70px 20px ${movie.themeColor}30`,
                                transform: 'translateZ(-100px)'
                            }}
                        >
                            <div className="w-full h-full bg-black/30" />
                        </div>
                    </div>
                    {/* Foreground Seats */}
                     {foregroundSeats.map(s => (
                        <div key={s.key} className="absolute" style={s.style}>
                            <SeatIcon className="w-12 h-12 text-black/80" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* UI Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-64">
            <label htmlFor="zoom-slider" className="text-white/80 text-xs text-center block mb-1">ZOOM</label>
            <input
                id="zoom-slider"
                type="range"
                min="0.5"
                max="3"
                step="0.01"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
        </div>

        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 text-center bg-black/50 backdrop-blur-sm p-3 rounded-xl">
            <p className="font-bold text-white text-lg">Your view from Seat {seat.id}</p>
            <p className="text-sm text-white/80">Drag to look around, use scroll/slider to zoom.</p>
        </div>
    </div>
  );
};