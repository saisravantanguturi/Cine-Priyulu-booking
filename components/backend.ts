import { Movie, SeatLayout, Seat, SeatStatus, User, Booking, Location, Theater, Showtime, Coupon, GroupPaySession } from '../types';
import { SEAT_PRICE, SEAT_LAYOUTS } from '../constants';

// --- IN-MEMORY DATABASE ---

const LOCATIONS: Location[] = [
    { id: 'vis', name: 'Visakhapatnam' },
    { id: 'vij', name: 'Vijayawada' },
    { id: 'gun', name: 'Guntur' },
    { id: 'nel', name: 'Nellore' },
    { id: 'kur', name: 'Kurnool' },
    { id: 'raj', name: 'Rajahmundry' },
    { id: 'tir', name: 'Tirupati' },
    { id: 'kad', name: 'Kadapa' },
    { id: 'kak', name: 'Kakinada' },
    { id: 'ana', name: 'Anantapur' },
];

export const THEATERS: Theater[] = [
    // Visakhapatnam
    { id: 't1', name: 'INOX - Varun Beach', locationId: 'vis', layoutId: 'layout1' },
    { id: 't2', name: 'Jagadamba Multiplex', locationId: 'vis', layoutId: 'layout2' },
    { id: 't8', name: 'Mukta A2 Cinemas', locationId: 'vis', layoutId: 'layout4' },
    { id: 't18', name: 'CMR Central', locationId: 'vis', layoutId: 'layout3' },
    
    // Vijayawada
    { id: 't3', name: 'PVP Square', locationId: 'vij', layoutId: 'layout1' },
    { id: 't4', name: 'INOX - LEPL', locationId: 'vij', layoutId: 'layout3' },
    { id: 't9', name: 'Capital Cinemas', locationId: 'vij', layoutId: 'layout5' },
    { id: 't19', name: 'Trendset Mall', locationId: 'vij', layoutId: 'layout2' },

    // Guntur
    { id: 't5', name: 'PVR - Phoenix', locationId: 'gun', layoutId: 'layout2' },
    { id: 't10', name: 'Hollywood Cinemas', locationId: 'gun', layoutId: 'layout6' },
    { id: 't20', name: 'Krishna Mahal', locationId: 'gun', layoutId: 'layout1' },

    // Nellore
    { id: 't11', name: 'M Cinemas', locationId: 'nel', layoutId: 'layout1' },
    { id: 't21', name: 'Asian Multiplex', locationId: 'nel', layoutId: 'layout4' },

    // Kurnool
    { id: 't12', name: 'SVEC Cinemas', locationId: 'kur', layoutId: 'layout2' },
    { id: 't22', name: 'Alankar Cinemas', locationId: 'kur', layoutId: 'layout5' },

    // Rajahmundry
    { id: 't6', name: 'Cinepolis - Srikanya', locationId: 'raj', layoutId: 'layout1' },
    { id: 't13', name: 'Geetha Apsara', locationId: 'raj', layoutId: 'layout4' },

    // Tirupati
    { id: 't7', name: 'SVC Tirupati', locationId: 'tir', layoutId: 'layout3'},
    { id: 't14', name: 'PRC Multiplex', locationId: 'tir', layoutId: 'layout5' },
    { id: 't23', name: 'Cinepolis - Sudha', locationId: 'tir', layoutId: 'layout6' },

    // Kadapa
    { id: 't15', name: 'Ravi & Raghu Cine Complex', locationId: 'kad', layoutId: 'layout3' },
    { id: 't24', name: 'LNV Cinemas', locationId: 'kad', layoutId: 'layout1' },
    
    // Kakinada
    { id: 't16', name: 'Devi Multiplex', locationId: 'kak', layoutId: 'layout1' },
    { id: 't25', name: 'Carnival Cinemas', locationId: 'kak', layoutId: 'layout2' },

    // Anantapur
    { id: 't17', name: 'SSS Multiplex', locationId: 'ana', layoutId: 'layout6' },
    { id: 't26', name: 'Gowri Theatre', locationId: 'ana', layoutId: 'layout5' },
];

const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Kalki 2898 AD',
    posterUrl: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2024/06/Kalki-2898-AD-10.jpg',
    genre: 'Sci-Fi | Action',
    themeColor: '#f97316',
    availableLanguages: ['Telugu', 'Hindi', 'Tamil'],
  },
  {
    id: 'm2',
    title: 'Pushpa 2: The Rule',
    posterUrl: 'https://i.pinimg.com/1200x/31/b1/ea/31b1ea4c9e3d8302460b69f00e31c74a.jpg',
    genre: 'Action | Drama',
    themeColor: '#dc2626',
    availableLanguages: ['Telugu', 'Hindi', 'Tamil', 'Malayalam', 'Kannada'],
  },
   {
    id: 'm3',
    title: 'Coolie',
    posterUrl: 'https://www.wallsnapy.com/img_gallery/coolie-movie-rajini--poster-4k-download-9445507.jpg',
    genre: 'Action | Comedy',
    themeColor: '#3b82f6',
    availableLanguages: ['Tamil', 'Telugu'],
  },
  {
    id: 'm4',
    title: 'War 2',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/f/f5/War_2_official_poster.jpg',
    genre: 'Action | Thriller',
    themeColor: '#10b981',
    availableLanguages: ['Hindi', 'Telugu', 'Tamil'],
  },
];

const COUPONS: Coupon[] = [
    { code: 'SUPERHIT', description: 'Flat ₹100 Off', discountType: 'fixed', value: 100 },
    { code: 'CINE20', description: '20% Off on tickets', discountType: 'percentage', value: 20 },
    { code: 'FAMILYFUN', description: 'Flat ₹150 for 4+ tickets', discountType: 'fixed', value: 150 },
    { code: 'WEEKDAY', description: '30% off on weekdays', discountType: 'percentage', value: 30 },
    { code: 'FIRSTBOOK', description: 'Flat ₹50 Off on first booking', discountType: 'fixed', value: 50 },
];

const _users: User[] = [
    { id: 'user123', name: 'Alex Doe', email: 'alex.doe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe' }
];
let _currentUser: User | null = null;
const _bookings: Booking[] = [];
const _filledSeatsStore: { [showtimeId: string]: Set<string> } = {};
const _showtimeStore: { [key: string]: Showtime[] } = {}; // Key: "movieId-theaterId-date-language"
const _groupPaySessions: { [sessionId: string]: GroupPaySession } = {};

const ARTIFICIAL_DELAY = 500;
const GROUP_PAY_EXPIRATION_MINUTES = 10;


// --- HELPER FUNCTIONS ---
const _calculateLayoutCapacity = (layout: SeatLayout): number => {
    const totalPossibleSeats = layout.rows.length * layout.seatsPerRow;
    const gapCount = layout.gaps.reduce((acc, g) => acc + g.seats.length, 0);
    // Note: We don't subtract blocked seats from capacity, as they are part of the layout, just unavailable.
    // The purpose of capacity is to calculate total number of potential physical seats.
    return totalPossibleSeats - gapCount;
}

const parseTime = (timeStr: string): { hours: number, minutes: number } => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    return { hours, minutes };
}

const _generateShowtimes = (movieId: string, theaterId: string, date: string, language: string): Showtime[] => {
    const key = `${movieId}-${theaterId}-${date}-${language}`;
    if (_showtimeStore[key]) {
         // Filter out past showtimes from cache before returning
        return _showtimeStore[key].filter(st => new Date(st.dateTime) > new Date());
    }

    const showtimes: Showtime[] = [];
    const times = ['10:00 AM', '1:15 PM', '4:30 PM', '7:45 PM', '11:00 PM'];
    const showDate = new Date(date);
    
    const theater = THEATERS.find(t => t.id === theaterId);
    const layout = theater ? SEAT_LAYOUTS[theater.layoutId] : SEAT_LAYOUTS['layout1'];
    const totalSeats = _calculateLayoutCapacity(layout);

    for(const time of times) {
        if(Math.random() > 0.4) { // Randomly decide if a showtime is available
            const { hours, minutes } = parseTime(time);
            const showDateTime = new Date(showDate.getFullYear(), showDate.getMonth(), showDate.getDate(), hours, minutes);

            // Only generate showtimes that are in the future
            if (showDateTime > new Date()) {
                const id = `s-${movieId}-${theaterId}-${date}-${time.replace(/\s/g, '')}-${language}`;
                if (!_filledSeatsStore[id]) {
                    // Generate a wide variety of filled percentages for realism
                    const filledPercentage = Math.random() < 0.15 
                        ? (0.9 + Math.random() * 0.09) // 15% chance of being 90-99% full
                        : (Math.random() * 0.88);     // 85% chance of being 0-88% full
                    const filledCount = Math.floor(filledPercentage * totalSeats);
                    _generateInitialSeats(id, filledCount, layout);
                }
                const filledSeats = _filledSeatsStore[id]?.size || 0;
                showtimes.push({ id, dateTime: showDateTime.toISOString(), language, totalSeats, filledSeats });
            }
        }
    }
    _showtimeStore[key] = showtimes;
    return showtimes;
}


const _generateInitialSeats = (showtimeId: string, filledSeatsCount: number, layout: SeatLayout): Seat[] => {
    const seats: Seat[] = [];
    if (!_filledSeatsStore[showtimeId]) {
        _filledSeatsStore[showtimeId] = new Set();
        const availableSeatIds: string[] = [];
        const gapSet = new Set<string>();
        layout.gaps.forEach(g => g.seats.forEach(s => gapSet.add(`${g.row}${s}`)));
        for (const row of layout.rows) {
            for (let i = 1; i <= layout.seatsPerRow; i++) {
                const id = `${row}${i}`;
                if (gapSet.has(id)) continue;
                if (!layout.blockedSeats.includes(id)) availableSeatIds.push(id);
            }
        }
        const shuffledAvailable = [...availableSeatIds].sort(() => 0.5 - Math.random());
        for(let i=0; i < filledSeatsCount; i++) {
            if(shuffledAvailable[i]) _filledSeatsStore[showtimeId].add(shuffledAvailable[i]);
        }
    }
    const gapSet = new Set<string>();
    layout.gaps.forEach(g => g.seats.forEach(s => gapSet.add(`${g.row}${s}`)));
    for (const row of layout.rows) {
        for (let i = 1; i <= layout.seatsPerRow; i++) {
            const id = `${row}${i}`;
            if (gapSet.has(id)) continue;
            let status = SeatStatus.Available;
            if(layout.blockedSeats.includes(id)) status = SeatStatus.Blocked;
            else if (_filledSeatsStore[showtimeId]?.has(id)) status = SeatStatus.Filled;
            seats.push({ id, row, number: i, status });
        }
    }
    return seats;
};

const findShowtimeDetailsFromId = (showtimeId: string) => {
    for (const key in _showtimeStore) {
        const showtime = _showtimeStore[key].find(st => st.id === showtimeId);
        if (showtime) {
            // Key format can be "movieId-theaterId-YYYY-MM-DD-language"
            const keyParts = key.split('-');
            const movieId = keyParts[0];
            const theaterId = keyParts[1];
            
            const movie = MOVIES.find(m => m.id === movieId);
            const theater = THEATERS.find(t => t.id === theaterId);
            return { movie, theater, showtime };
        }
    }
    return null;
}

// --- API ENDPOINTS ---

export const signInWithGoogle = async (): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    _currentUser = _users[0];
    return JSON.parse(JSON.stringify(_currentUser));
};

export const signOut = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY / 2));
    _currentUser = null;
};

export const getLocations = async (): Promise<Location[]> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY / 2));
    return JSON.parse(JSON.stringify(LOCATIONS));
}

export const getCoupons = async (): Promise<Coupon[]> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY / 2));
    return JSON.parse(JSON.stringify(COUPONS));
}

export const getDataForLocation = async (locationId: string): Promise<{movies: Movie[], theaters: Theater[]}> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    const theatersInLocation = THEATERS.filter(t => t.locationId === locationId);
    // In a real app, you'd fetch movies available for these theaters. Here we just return all movies.
    return {
        movies: JSON.parse(JSON.stringify(MOVIES)),
        theaters: JSON.parse(JSON.stringify(theatersInLocation)),
    };
};

export const getShowtimes = async (movieId: string, locationId: string, date: string, language: string): Promise<{[theaterId: string]: Showtime[]}> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    const theatersInLocation = THEATERS.filter(t => t.locationId === locationId);
    const result: {[theaterId: string]: Showtime[]} = {};
    const movieDetails = MOVIES.find(m => m.id === movieId);
    if (!movieDetails || !movieDetails.availableLanguages.includes(language)) {
        return result;
    }
    for(const theater of theatersInLocation) {
        result[theater.id] = _generateShowtimes(movieId, theater.id, date, language);
    }
    return result;
}

export const getSeatingInfo = async (showtimeId: string) => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY * 1.5));
    const details = findShowtimeDetailsFromId(showtimeId);
    if (!details || !details.movie || !details.theater) return null;
    const { movie, theater, showtime } = details;
    const layout = SEAT_LAYOUTS[theater.layoutId];
    if (!layout) return null;
    const seats = _generateInitialSeats(showtimeId, showtime.filledSeats, layout);
    return {
        movie: JSON.parse(JSON.stringify(movie)),
        theater: JSON.parse(JSON.stringify(theater)),
        showtime: JSON.parse(JSON.stringify(showtime)),
        seats,
        layout
    };
};

export const bookSeats = async (
    { userId, showtimeId, seatIds, pricePaid, locationId }: { userId: string, showtimeId: string, seatIds: string[], pricePaid: number, locationId: string }
): Promise<{ success: boolean; message: string; }> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY * 2));
    if (!_currentUser || _currentUser.id !== userId) return { success: false, message: "User not authenticated." };
    if (!_filledSeatsStore[showtimeId]) return { success: false, message: "Showtime not found." };

    const alreadyBooked = seatIds.some(id => _filledSeatsStore[showtimeId].has(id));
    if (alreadyBooked) return { success: false, message: "Sorry, one or more selected seats have just been booked. Please select different seats." };

    seatIds.forEach(id => _filledSeatsStore[showtimeId].add(id));
    
    const details = findShowtimeDetailsFromId(showtimeId);
    if(details && details.movie && details.theater) {
        const { movie, theater, showtime } = details;
        const bookingId = `BK-${Date.now()}`;
        const locationName = LOCATIONS.find(l => l.id === locationId)?.name || 'Unknown';
        const showDateTime = new Date(showtime.dateTime);
        const newBooking: Booking = {
            id: bookingId,
            userId,
            showtimeId,
            movieId: movie.id,
            movieTitle: movie.title,
            posterUrl: movie.posterUrl,
            theaterId: theater.id,
            theaterName: theater.name,
            locationName,
            showtime: showDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            date: showDateTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            language: showtime.language,
            seats: seatIds,
            pricePaid,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`
        };
        _bookings.push(newBooking);
        
        // Update filled seats count in master showtime store
        const showDateStr = showDateTime.toISOString().split('T')[0];
        const key = `${movie.id}-${theater.id}-${showDateStr}-${showtime.language}`;
        const storedShowtime = _showtimeStore[key]?.find(s => s.id === showtimeId);
        if(storedShowtime) {
            storedShowtime.filledSeats = _filledSeatsStore[showtimeId].size;
        }
    }
    return { success: true, message: "Booking successful!" };
};

export const getTicketsForUser = async (userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    if (!_currentUser || _currentUser.id !== userId) return [];
    const userBookings = _bookings.filter(b => b.userId === userId);
    return JSON.parse(JSON.stringify(userBookings.reverse()));
};


// --- GROUP PAY API ---

export const initiateGroupPaySession = async ({ userId, showtimeId, seatIds, locationId }: { userId: string, showtimeId: string, seatIds: string[], locationId: string }): Promise<string | null> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    if (!_currentUser || _currentUser.id !== userId) return null;

    const id = `GP-${Date.now()}`;
    const expiresAt = Date.now() + GROUP_PAY_EXPIRATION_MINUTES * 60 * 1000;
    const seatPayments: { [seatId: string]: { status: 'unpaid' } } = {};
    seatIds.forEach(seatId => {
        seatPayments[seatId] = { status: 'unpaid' };
    });

    _groupPaySessions[id] = {
        id,
        initiatorUserId: userId,
        showtimeId,
        locationId,
        seatPayments,
        expiresAt,
        status: 'pending',
    };
    return id;
};

export const getGroupPaySession = async (sessionId: string): Promise<GroupPaySession | null> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY / 2));
    const session = _groupPaySessions[sessionId];
    if (!session) return null;

    if (session.status === 'pending' && Date.now() > session.expiresAt) {
        session.status = 'expired';
    }
    
    // Enrich with movie/theater data for display
    if (!session.movie) {
        const details = findShowtimeDetailsFromId(session.showtimeId);
        if (details) {
            session.movie = details.movie;
            session.theater = details.theater;
            session.showtime = details.showtime;
        }
    }

    return JSON.parse(JSON.stringify(session));
};

export const payForGroupSeat = async ({ sessionId, seatId, user }: { sessionId: string, seatId: string, user: User }): Promise<GroupPaySession | null> => {
    await new Promise(resolve => setTimeout(resolve, ARTIFICIAL_DELAY));
    const session = _groupPaySessions[sessionId];

    if (!session || session.status !== 'pending' || Date.now() > session.expiresAt) {
        if(session) session.status = 'expired';
        return null; // Session invalid, expired or already completed
    }
    
    if (session.seatPayments[seatId] && session.seatPayments[seatId].status === 'unpaid') {
        session.seatPayments[seatId] = { status: 'paid', paidBy: user.name };
    } else {
        return null; // Seat not available for payment
    }

    const allPaid = Object.values(session.seatPayments).every(p => p.status === 'paid');

    if (allPaid) {
        session.status = 'completed';
        // Finalize the booking
        const seatIds = Object.keys(session.seatPayments);
        const totalPrice = seatIds.length * SEAT_PRICE;
        await bookSeats({
            userId: session.initiatorUserId,
            showtimeId: session.showtimeId,
            seatIds: seatIds,
            pricePaid: totalPrice,
            locationId: session.locationId,
        });
    }

    return JSON.parse(JSON.stringify(session));
};

// --- SEAT UPGRADE LOTTERY ---

function isSeatAvailable(seatId: string, layout: SeatLayout, filledSeats: Set<string>): boolean {
    if (filledSeats.has(seatId)) return false;
    if (layout.blockedSeats.includes(seatId)) return false;
    
    const row = seatId.charAt(0);
    const num = parseInt(seatId.slice(1), 10);
    const rowGaps = layout.gaps.find(g => g.row === row);
    if (rowGaps && rowGaps.seats.includes(num)) return false;

    return true;
}


function findBetterSeat(layout: SeatLayout, filledSeats: Set<string>): string | null {
    const premiumRows = ['H', 'G', 'F']; // Best rows, in order of preference
    for (const row of premiumRows) {
        if (!layout.rows.includes(row)) continue;

        // Try to find a center seat by starting in the middle and fanning out
        const middleSeatNum = Math.floor(layout.seatsPerRow / 2);
        for (let i = 0; i < Math.ceil(layout.seatsPerRow / 2); i++) {
            const seatId1 = `${row}${middleSeatNum + i}`;
             if (isSeatAvailable(seatId1, layout, filledSeats)) return seatId1;

            if (i > 0) {
              const seatId2 = `${row}${middleSeatNum - i}`;
              if (isSeatAvailable(seatId2, layout, filledSeats)) return seatId2;
            }
        }
    }
    return null; // No better seat found
}

export const runGlobalSeatUpgradeLottery = async (): Promise<{ upgradedCount: number }> => {
    let upgradedCount = 0;
    const allShowtimeIds = Object.values(_showtimeStore).flat().map(s => s.id);
    
    for (const showtimeId of allShowtimeIds) {
        // Only consider bookings that haven't been upgraded and are for single seats (for simplicity)
        const eligibleBookings = _bookings.filter(b => b.showtimeId === showtimeId && !b.upgradedFrom && b.seats.length === 1);
        if (eligibleBookings.length === 0) continue;

        // Pick one random booking from the eligible list
        const luckyBookingIndex = Math.floor(Math.random() * eligibleBookings.length);
        const luckyBooking = eligibleBookings[luckyBookingIndex];

        const details = findShowtimeDetailsFromId(showtimeId);
        if (!details || !details.theater) continue;

        const layout = SEAT_LAYOUTS[details.theater.layoutId];
        const filledSeats = _filledSeatsStore[showtimeId];

        // Don't upgrade if they are already in a premium row
        const currentSeatRow = luckyBooking.seats[0].charAt(0);
        if (['H', 'G'].includes(currentSeatRow)) continue;

        const betterSeatId = findBetterSeat(layout, filledSeats);

        if (betterSeatId) {
            const oldSeatId = luckyBooking.seats[0];
            
            // Update booking
            luckyBooking.upgradedFrom = oldSeatId;
            luckyBooking.seats = [betterSeatId];
            luckyBooking.hasSeenUpgrade = false;
            
            // Update filled seats store
            filledSeats.delete(oldSeatId);
            filledSeats.add(betterSeatId);

            upgradedCount++;
        }
    }
    console.log(`Seat lottery finished. Upgraded ${upgradedCount} bookings.`);
    return { upgradedCount };
};

export const markUpgradeAsSeen = async (bookingId: string): Promise<void> => {
    const booking = _bookings.find(b => b.id === bookingId);
    if(booking) {
        booking.hasSeenUpgrade = true;
    }
    return Promise.resolve();
};