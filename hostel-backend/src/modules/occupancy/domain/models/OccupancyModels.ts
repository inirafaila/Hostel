export type ReservationStatus = 'Confirmed' | 'Arriving' | 'In-House' | 'Cancelled' | 'Checked-Out';
export type StayStatus = 'Pre-Arrival' | 'In-House' | 'Departed';

export interface Reservation {
  id: string;
  status: ReservationStatus;
  guestId: string;
  guestGender?: string;
}

export interface Stay {
  id: string;
  reservationId: string;
  status: StayStatus;
}

export interface BedAssignment {
  id: string;
  stayId: string;
  targetBedId: string;
  // Assignment is the source of truth for physical location binding
  isActive: boolean; 
}
