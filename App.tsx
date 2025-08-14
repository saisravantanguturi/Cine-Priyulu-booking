import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { MovieCard } from './components/MovieCard';
import { Movie, Seat, SeatStatus, SelectedShowtimeInfo, BookingPersona, SeatLayout, User, Theater, Showtime, Location, Coupon, Booking } from './types';
import { LoginPage } from './components/LoginPage';
import { SeatingPage } from './components/SeatingPage';
import { ViewModeSwitcher } from './components/ViewModeSwitcher';
import { AppHeader } from './components/AppHeader';
import { MyTicketsPage } from './components/MyTicketsPage';
import * as api from './components/backend';
import { PremiumStarfield } from './components/PremiumStarfield';
import { LocationPage } from './components/LocationPage';
import { MovieDateAndLanguageModal } from './components/MovieDateAndLanguageModal';
import { PaymentPage } from './components/PaymentPage';
import { SeatViewPreview } from './components/SeatViewPreview';
import { GroupPayModal } from './components/GroupPayModal';
import { ARSeatFinder } from './components/ARSeatFinder';
import { SEAT_LAYOUTS } from './constants';

const findSuggestedSeatGroups = (
    persona: BookingPersona,
    seats: Seat[],
    layout: SeatLayout,
    familySize: number = 2
): string[][] => {
    const groups: string[][] = [];
    const availableSeats = seats.filter(s => s.status === SeatStatus.Available);
    const availableSeatIds = new Set(availableSeats.map(s => s.id));
    
    const rows: { [key: string]: Seat[] } = {};
    for (const seat of availableSeats) {
        if (!rows[seat.row]) rows[seat.row] = [];
        rows[seat.row].push(seat);
    }
    for (const rowKey in rows) {
        rows[rowKey].sort((a, b) => a.number - b.number);
    }
    const rowKeys = Object.keys(rows).sort();

    if (persona === BookingPersona.Couple) {
       for (const rowKey of rowKeys) {
            // Suggest far-left corner seats (seat 1 and 2)
            const left1 = `${rowKey}1`;
            const left2 = `${rowKey}2`;
            if (availableSeatIds.has(left1) && availableSeatIds.has(left2) && !layout.aisles.includes(1)) {
                groups.push([left1, left2]);
            }

            // Suggest far-right corner seats (last two seats)
            const right1 = `${rowKey}${layout.seatsPerRow - 1}`;
            const right2 = `${rowKey}${layout.seatsPerRow}`;
             if (layout.seatsPerRow > 1 && availableSeatIds.has(right1) && availableSeatIds.has(right2) && !layout.aisles.includes(layout.seatsPerRow - 1)) {
                 groups.push([right1, right2]);
            }
        }
    }

    if (persona === BookingPersona.MovieLover) {
        const middleRowIndex = Math.floor(rowKeys.length * 2 / 3);
        const idealRows = [rowKeys[middleRowIndex], rowKeys[middleRowIndex - 1]].filter(Boolean);
        const middleSeatStart = Math.floor(layout.seatsPerRow / 3);
        const middleSeatEnd = middleSeatStart + Math.floor(layout.seatsPerRow / 3);

        for (const rowKey of idealRows) {
            const rowSeats = rows[rowKey] || [];
            for (const seat of rowSeats) {
                if (seat.number >= middleSeatStart && seat.number < middleSeatEnd && !layout.aisles.includes(seat.number) && !layout.aisles.includes(seat.number-1)) {
                    groups.push([seat.id]); // Group of 1
                }
            }
        }
    }

    if (persona === BookingPersona.Family) {
        // With a reversed seating chart display (A=back, H=front), we want to suggest middle rows.
        // These correspond to row keys like C, D, E, F.
        const startIdx = Math.floor(rowKeys.length / 4); // e.g., index 2 ('C') for 8 rows.
        const endIdx = Math.floor(rowKeys.length * 3 / 4); // e.g., index 6 ('G') for 8 rows.
        // This gives a slice of middle rows. We reverse to check rows closer to the screen first within this slice.
        const familyRows = rowKeys.slice(startIdx, endIdx).reverse();
        
        for(const rowKey of familyRows){
            const rowSeats = rows[rowKey];
            if(rowSeats.length < familySize) continue;
            for(let i=0; i <= rowSeats.length - familySize; i++){
                const potentialBlock = rowSeats.slice(i, i + familySize);
                let isContiguous = true;
                for(let j=1; j < familySize; j++){
                    if(potentialBlock[j].number !== potentialBlock[j-1].number + 1 || layout.aisles.includes(potentialBlock[j-1].number)){
                        isContiguous = false;
                        break;
                    }
                }
                if(isContiguous) {
                    groups.push(potentialBlock.map(seat => seat.id));
                    // Skip ahead to avoid creating overlapping suggestions
                    i += familySize - 1;
                }
            }
        }
    }
    return groups;
};

type Page = 'location' | 'list' | 'seating' | 'tickets' | 'payment';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>('list');
  const [location, setLocation] = useState<Location | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<{[key: string]: Showtime[]}>({});
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedShowtimeInfo, setSelectedShowtimeInfo] = useState<SelectedShowtimeInfo | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [currentLayout, setCurrentLayout] = useState<SeatLayout | null>(null);
  const [selectedSeatIds, setSelectedSeatIds] = useState<Set<string>>(new Set());
  const [bookingMessage, setBookingMessage] = useState<string>('');
  
  const [persona, setPersona] = useState<BookingPersona | null>(null);
  const [familySize, setFamilySize] = useState(4);
  const [suggestedSeatGroups, setSuggestedSeatGroups] = useState<string[][]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovieForModal, setSelectedMovieForModal] = useState<Movie | null>(null);
  const [seatToPreview, setSeatToPreview] = useState<Seat | null>(null);

  const [groupPaySessionId, setGroupPaySessionId] = useState<string | null>(null);
  const [arNavInfo, setArNavInfo] = useState<{ booking: Booking; layout: SeatLayout } | null>(null);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  const fetchDataForLocation = useCallback(async (loc: Location) => {
    setIsLoading(true);
    setMovies([]);
    setTheaters([]);
    const { movies: fetchedMovies, theaters: fetchedTheaters } = await api.getDataForLocation(loc.id);
    setMovies(fetchedMovies);
    setTheaters(fetchedTheaters);
    setCoupons(await api.getCoupons());
    setIsLoading(false);
  }, []);
  
  useEffect(() => {
    if (currentUser && !location) {
        setPage('location');
    } else if (currentUser && location) {
        fetchDataForLocation(location);
    }
  }, [currentUser, location, fetchDataForLocation]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get('groupPay');
    if (sessionIdFromUrl) {
      setGroupPaySessionId(sessionIdFromUrl);
      // Clean up URL to avoid re-triggering
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    const user = await api.signInWithGoogle();
    if (user) {
      setCurrentUser(user);
      setPage('location');
    } else {
      alert("Sign in failed. Please try again.");
    }
    setIsLoading(false);
  }, []);
  
  const handleSignOut = useCallback(async () => {
    await api.signOut();
    setCurrentUser(null);
    setLocation(null);
    setPage('list');
    setMovies([]);
    setTheaters([]);
    setSelectedShowtimeInfo(null);
    setSeats([]);
    setCurrentLayout(null);
    setSelectedSeatIds(new Set());
    setBookingMessage('');
    setPersona(null);
  }, []);

  const handleLocationSelect = (selectedLocation: Location) => {
    setLocation(selectedLocation);
    setPage('list');
  };

  const handleChangeLocation = () => {
    setLocation(null);
    setPage('location');
  }
  
  const handleModalClose = () => {
      setIsModalOpen(false);
      // Delay resetting the movie to allow the modal to animate out
      setTimeout(() => {
        if (!isModalOpen) setSelectedMovieForModal(null);
      }, 300);
  }

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieForModal(movie);
    setShowtimes({});
    setIsModalOpen(true);
  };

  const handleFindShowtimes = async (date: string, language: string) => {
    if (!selectedMovieForModal || !location) return;
    setIsLoading(true);
    const fetchedShowtimes = await api.getShowtimes(selectedMovieForModal.id, location.id, date, language);
    setShowtimes(fetchedShowtimes);
    setIsLoading(false);
    // Automatically close the modal after finding showtimes
    setIsModalOpen(false);
  };
  
  const handleSelectShowtime = useCallback(async (info: {movieId: string, theaterId: string, showtimeId: string}) => {
    setIsLoading(true);

    const selectedSt = Object.values(showtimes).flat().find(s => s.id === info.showtimeId);
    const showtimeDate = selectedSt ? new Date(selectedSt.dateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

    const fullInfo: SelectedShowtimeInfo = {
        movieId: info.movieId,
        theaterId: info.theaterId,
        showtimeId: info.showtimeId,
        date: showtimeDate,
    };
    setSelectedShowtimeInfo(fullInfo);

    const data = await api.getSeatingInfo(fullInfo.showtimeId);

    if (data) {
        setSeats(data.seats);
        setCurrentLayout(data.layout);
        setPage('seating');
        setIsModalOpen(false);
        setSelectedMovieForModal(null);
    } else {
        alert("Sorry, could not load seating information.");
        setSeats([]);
        setCurrentLayout(null);
    }
    setIsLoading(false);
  }, [showtimes]);

  const handleGoToMovieList = useCallback(() => {
     setPage('list');
     setSelectedSeatIds(new Set());
     setPersona(null);
     setSuggestedSeatGroups([]);
     if(location) fetchDataForLocation(location);
  }, [fetchDataForLocation, location]);
  
  const handleNavigate = (targetPage: 'list' | 'tickets') => {
    if (targetPage === 'list' && !location) {
        setPage('location');
    } else {
        setPage(targetPage);
    }
    setSelectedShowtimeInfo(null);
    setSelectedMovieForModal(null); 
    setIsModalOpen(false);
  }

  const handlePersonaChange = useCallback((newPersona: BookingPersona | null, size?: number) => {
    setPersona(newPersona);
    if (newPersona && currentLayout) {
        const groups = findSuggestedSeatGroups(newPersona, seats, currentLayout, size || familySize);
        setSuggestedSeatGroups(groups);
    } else {
        setSuggestedSeatGroups([]);
    }
  }, [seats, familySize, currentLayout]);
  
  const suggestedSeatIds = useMemo(() => new Set(suggestedSeatGroups.flat()), [suggestedSeatGroups]);
  
  const handleSelectSeat = useCallback((seatId: string) => {
    setSelectedSeatIds(prevSelected => {
      const newSelected = new Set(prevSelected);
      
      // If a persona is active and the clicked seat is a suggestion, handle group selection
      if (persona && suggestedSeatIds.has(seatId)) {
        const targetGroup = suggestedSeatGroups.find(group => group.includes(seatId));
        
        if (targetGroup) {
          const isAnySelected = targetGroup.some(id => newSelected.has(id));
          
          if (isAnySelected) {
            // Deselect the entire group
            targetGroup.forEach(id => newSelected.delete(id));
          } else {
            // Select the entire group
            targetGroup.forEach(id => newSelected.add(id));
          }
          return newSelected;
        }
      }

      // Default behavior: toggle single seat, if not handled by persona logic
      if (newSelected.has(seatId)) {
        newSelected.delete(seatId);
      } else {
        newSelected.add(seatId);
      }
      
      return newSelected;
    });
  }, [persona, suggestedSeatGroups, suggestedSeatIds]);

  const handleProceedToPayment = () => setPage('payment');

  const handleFinalizeBooking = useCallback(async (finalPrice: number) => {
    if (!selectedShowtimeInfo || !currentUser || !location) return;

    setIsLoading(true);
    const result = await api.bookSeats({
        userId: currentUser.id,
        showtimeId: selectedShowtimeInfo.showtimeId,
        seatIds: Array.from(selectedSeatIds),
        pricePaid: finalPrice,
        locationId: location.id,
    });
    setIsLoading(false);

    if (result.success) {
        const bookingDetails = `Booked ${selectedSeatIds.size} ticket(s): ${Array.from(selectedSeatIds).join(', ')}. A confirmation has been sent to ${currentUser.email}.`;
        setBookingMessage(bookingDetails);
        
        setSelectedShowtimeInfo(null);
        setSelectedSeatIds(new Set());
        setPersona(null);
        setSuggestedSeatGroups([]);
        setSeats([]);
        setCurrentLayout(null);
        setSelectedMovieForModal(null);
        setPage('list');
        if(location) fetchDataForLocation(location);
    } else {
        alert(result.message);
        setPage('seating'); 
    }
  }, [selectedSeatIds, selectedShowtimeInfo, currentUser, location, fetchDataForLocation]);

  const handleInitiateGroupPay = useCallback(async () => {
    if (!selectedShowtimeInfo || !currentUser || !location) return;
    setIsLoading(true);
    const sessionId = await api.initiateGroupPaySession({
        userId: currentUser.id,
        showtimeId: selectedShowtimeInfo.showtimeId,
        seatIds: Array.from(selectedSeatIds),
        locationId: location.id
    });
    setIsLoading(false);
    if (sessionId) {
        setGroupPaySessionId(sessionId);
    } else {
        alert('Could not start a group payment session. Please try again.');
    }
  }, [selectedShowtimeInfo, currentUser, selectedSeatIds, location]);

  const handleGroupPayComplete = useCallback(() => {
    setGroupPaySessionId(null);
    const bookingDetails = `Group booking for ${selectedSeatIds.size} tickets confirmed! A confirmation has been sent to the initiator.`;
    setBookingMessage(bookingDetails);
    
    setSelectedShowtimeInfo(null);
    setSelectedSeatIds(new Set());
    setPersona(null);
    setSuggestedSeatGroups([]);
    setSeats([]);
    setCurrentLayout(null);
    setSelectedMovieForModal(null);
    setPage('list');
    if(location) fetchDataForLocation(location);
  }, [selectedSeatIds.size, location, fetchDataForLocation]);

  const handleStartArNavigation = (booking: Booking) => {
    const theater = api.THEATERS.find(t => t.id === booking.theaterId);
    if (theater) {
        const layout = SEAT_LAYOUTS[theater.layoutId];
        if (layout) {
            setArNavInfo({ booking, layout });
        } else {
            alert('Could not find layout for this theater.');
        }
    } else {
        alert('Could not find theater information for this booking.');
    }
  };


  const seatsWithSelection = useMemo(() => {
    return seats.map(seat => {
      if (selectedSeatIds.has(seat.id)) {
        return { ...seat, status: SeatStatus.Selected };
      }
      return seat;
    });
  }, [seats, selectedSeatIds]);

  const selectedSeats = useMemo(() => {
    return seatsWithSelection.filter(seat => seat.status === SeatStatus.Selected);
  }, [seatsWithSelection]);
  
  const { selectedMovie, selectedTheater, selectedShowtime } = useMemo(() => {
    if (!selectedShowtimeInfo) return { selectedMovie: null, selectedTheater: null, selectedShowtime: null };
    
    const movie = movies.find(m => m.id === selectedShowtimeInfo.movieId);

    if (!movie) return { selectedMovie: null, selectedTheater: null, selectedShowtime: null };
    const theater = theaters.find(t => t.id === selectedShowtimeInfo.theaterId);
    if (!theater) return { selectedMovie: movie, selectedTheater: null, selectedShowtime: null };
    const showtime = showtimes[theater.id]?.find(s => s.id === selectedShowtimeInfo.showtimeId);
    return { selectedMovie: movie, selectedTheater: theater, selectedShowtime: showtime || null };
  }, [selectedShowtimeInfo, movies, theaters, showtimes]);


  if (!currentUser) {
    return (
        <>
         {theme === 'dark' && <PremiumStarfield />}
         <LoginPage onLogin={handleSignIn} isLoading={isLoading} />
        </>
    );
  }
  
  const isMobile = viewMode === 'mobile';
  
  const renderPage = () => {
    switch(page) {
        case 'location':
            return <LocationPage onLocationSelect={handleLocationSelect} />;
        case 'tickets':
            return <MyTicketsPage userId={currentUser.id} onBack={() => handleNavigate('list')} onStartArNavigation={handleStartArNavigation} />;
        case 'payment':
            if (selectedMovie && selectedTheater && selectedShowtime && location) {
                return <PaymentPage 
                    movie={selectedMovie}
                    theater={selectedTheater}
                    showtime={selectedShowtime}
                    date={selectedShowtimeInfo!.date}
                    location={location}
                    selectedSeats={selectedSeats}
                    coupons={coupons}
                    onConfirmBooking={handleFinalizeBooking}
                    onBack={() => setPage('seating')}
                    onInitiateGroupPay={handleInitiateGroupPay}
                    isLoading={isLoading}
                />
            }
            // Fallback to list if payment page is somehow loaded with insufficient data
            handleGoToMovieList();
            return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Redirecting...</div>;
        case 'seating':
            if (isLoading && seats.length === 0) return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading seating chart...</div>;
            if (selectedMovie && selectedTheater && selectedShowtime && currentLayout) {
                 return <SeatingPage
                    viewMode={viewMode}
                    movie={selectedMovie}
                    theater={selectedTheater}
                    showtime={selectedShowtime}
                    seats={seatsWithSelection}
                    layout={currentLayout}
                    selectedSeats={selectedSeats}
                    suggestedSeatIds={suggestedSeatIds}
                    persona={persona}
                    familySize={familySize}
                    onSelectSeat={handleSelectSeat}
                    onPreviewSeat={setSeatToPreview}
                    onProceedToPayment={handleProceedToPayment}
                    onBack={handleGoToMovieList}
                    onPersonaChange={handlePersonaChange}
                    onFamilySizeChange={setFamilySize}
                 />;
            }
             // Fallback to list if seating page is somehow loaded with insufficient data
            handleGoToMovieList();
            return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Redirecting...</div>;
        case 'list':
        default:
             if (isLoading && movies.length === 0) return <div className="text-center text-gray-500 dark:text-gray-400 py-10">Loading movies...</div>;
             return (
                <main className={`max-w-7xl mx-auto space-y-8`}>
                    {movies.map((movie: Movie) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            theaters={theaters}
                            showtimes={showtimes}
                            onSelectShowtime={handleSelectShowtime}
                            onClickMovie={() => handleMovieClick(movie)}
                            isExpanded={selectedMovieForModal?.id === movie.id}
                        />
                    ))}
                    {movies.length === 0 && !isLoading && <div className="text-center text-gray-500 dark:text-gray-400 py-10">No movies found for this location.</div>}
                </main>
             )
    }
  }

  return (
    <>
    {theme === 'dark' && <PremiumStarfield />}
    <div className={`view-mode-container ${isMobile ? 'view-mobile' : 'view-desktop'}`}>
        <div className="bg-gray-100 dark:bg-black min-h-screen text-black dark:text-gray-200 p-4 sm:p-6 lg:p-8 relative transition-colors duration-300">
            <AppHeader
                user={currentUser}
                onSignOut={handleSignOut}
                onNavigate={handleNavigate}
                currentPage={page}
                theme={theme}
                setTheme={setTheme}
                location={location}
                onChangeLocation={handleChangeLocation}
            />
             <ViewModeSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
            
            <header className="text-center my-8 mt-24">
                <h1 className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-700 uppercase tracking-widest animated-gradient-text`}>
                    Cine Priyulu
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-lg">మీ సినిమా ప్రపంచం</p>
                {page === 'list' && location && <p className="text-gray-700 dark:text-gray-300 mt-2">Showing movies for {location.name}. Select a movie to begin.</p>}
            </header>
            
            {bookingMessage && page === 'list' && (
                <div className="max-w-7xl mx-auto mb-6 text-center p-4 rounded-lg bg-green-100 border border-green-300 animate-fade-in"
                    style={{ animation: 'fade-in 0.5s ease-out' }}
                >
                    <p className="font-bold text-lg text-green-800">Booking Confirmed!</p>
                    <p className="text-green-700 mt-1">{bookingMessage}</p>
                </div>
            )}
            
            {renderPage()}
        </div>
        {isModalOpen && selectedMovieForModal && (
            <MovieDateAndLanguageModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                movie={selectedMovieForModal}
                onFindShowtimes={handleFindShowtimes}
                isLoading={isLoading && !!selectedMovieForModal}
            />
        )}
    </div>
    {seatToPreview && currentLayout && selectedMovie && (
      <SeatViewPreview
          seat={seatToPreview}
          layout={currentLayout}
          movie={selectedMovie}
          onClose={() => setSeatToPreview(null)}
      />
    )}
    {groupPaySessionId && (
        <GroupPayModal
            sessionId={groupPaySessionId}
            currentUser={currentUser}
            onClose={() => setGroupPaySessionId(null)}
            onBookingComplete={handleGroupPayComplete}
        />
    )}
    {arNavInfo && (
      <ARSeatFinder
        booking={arNavInfo.booking}
        layout={arNavInfo.layout}
        onClose={() => setArNavInfo(null)}
      />
    )}
    </>
  );
}