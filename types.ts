// Global type declarations for A-Frame, THREE, and GSAP are now in aframe.d.ts

export enum SeatStatus {
  Available = 'available',
  Filled = 'filled',
  Blocked = 'blocked',
  Selected = 'selected',
}

export enum BookingPersona {
  Couple = 'couple',
  Family = 'family',
  MovieLover = 'movieLover',
}

export interface Seat {
  id: string; // e.g., 'A1', 'C5'
  row: string;
  number: number;
  status: SeatStatus;
}

export interface Showtime {
  id: string;
  dateTime: string; // ISO string for the showtime, e.g., "2024-07-30T13:00:00.000Z"
  language: string;
  totalSeats: number;
  filledSeats: number;
}

export interface SeatLayout {
  rows: string[];
  seatsPerRow: number;
  aisles: number[]; // column indices to place aisles after
  gaps: { row: string; seats: number[] }[]; // To remove specific seats for entries/gaps
  blockedSeats: string[];
}

export interface Theater {
  id: string;
  name: string;
  locationId: string;
  layoutId: string;
}

export interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  genre: string;
  themeColor: string;
  availableLanguages: string[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface Location {
    id: string;
    name: string;
}

export interface Coupon {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    value: number;
}

export interface SelectedShowtimeInfo {
  movieId: string;
  theaterId: string;
  showtimeId: string;
  date: string;
}

export interface Booking {
    id:string;
    userId: string;
    showtimeId: string;
    movieId: string;
    movieTitle: string;
    posterUrl: string;
    theaterId: string;
    theaterName: string;
    locationName: string;
    showtime: string;
    language: string;
    date: string;
    seats: string[];
    pricePaid: number;
    qrCodeUrl: string;
    upgradedFrom?: string;
    hasSeenUpgrade?: boolean;
}

export interface GroupPaySeatPayment {
    status: 'unpaid' | 'paid';
    paidBy?: string; // User's name
}

export interface GroupPaySession {
    id: string;
    initiatorUserId: string;
    showtimeId: string;
    locationId: string;
    seatPayments: { [seatId: string]: GroupPaySeatPayment };
    expiresAt: number; // timestamp
    status: 'pending' | 'completed' | 'expired';
    movie?: Movie;
    theater?: Theater;
    showtime?: Showtime;
}