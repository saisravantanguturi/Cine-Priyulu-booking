import { SeatLayout } from './types';

export const SEAT_PRICE = 150; // Price per seat in INR
export const CURRENCY_SYMBOL = '₹';

export const SEAT_LAYOUTS: { [key: string]: SeatLayout } = {
  layout1: { // Standard with side aisles
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 14,
    aisles: [3, 11], // after seat 3 and 11 -> 3 | 8 | 3
    gaps: [],
    blockedSeats: ['C5', 'C6', 'F9', 'F10'],
  },
  layout2: { // Middle Entry
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
    seatsPerRow: 12,
    aisles: [],
    gaps: [ 
        { row: 'J', seats: [5, 6, 7, 8] },
        { row: 'H', seats: [5, 6, 7, 8] },
        { row: 'G', seats: [5, 6, 7, 8] },
    ],
    blockedSeats: ['D6', 'D7'],
  },
  layout3: { // Side Entry
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 12,
    aisles: [6],
    gaps: [
        { row: 'F', seats: [1, 2] },
        { row: 'G', seats: [1, 2] },
        { row: 'H', seats: [1, 2] },
    ],
    blockedSeats: ['B8', 'B9'],
  },
  layout4: { // Wide Center Aisle ("Five Gap")
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
    seatsPerRow: 19,
    aisles: [], // No side aisles, entry from front/back
    gaps: [ // Wide central corridor of 5 seats
        { row: 'A', seats: [8, 9, 10, 11, 12] },
        { row: 'B', seats: [8, 9, 10, 11, 12] },
        { row: 'C', seats: [8, 9, 10, 11, 12] },
        { row: 'D', seats: [8, 9, 10, 11, 12] },
        { row: 'E', seats: [8, 9, 10, 11, 12] },
        { row: 'F', seats: [8, 9, 10, 11, 12] },
        { row: 'G', seats: [8, 9, 10, 11, 12] },
        { row: 'H', seats: [8, 9, 10, 11, 12] },
        { row: 'J', seats: [8, 9, 10, 11, 12] },
        { row: 'K', seats: [8, 9, 10, 11, 12] },
    ],
    blockedSeats: ['D1', 'D19', 'E1', 'E19'],
  },
  layout5: { // Dual smaller aisles
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      seatsPerRow: 16,
      aisles: [4, 8, 12], // Creates sections of 4 seats: 4 | 4 | 4 | 4
      gaps: [],
      blockedSeats: ['J1', 'J16', 'A8', 'A9'],
  },
  layout6: { // Luxury Recliners Style
      rows: ['A', 'B', 'C', 'D', 'E'],
      seatsPerRow: 10,
      aisles: [2, 5, 8], // Paired seats with aisles
      gaps: [],
      blockedSeats: [],
  }
};