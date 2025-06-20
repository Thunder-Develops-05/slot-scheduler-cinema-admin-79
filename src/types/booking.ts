
export interface Booking {
  id: string;
  userId: string;
  centerId: string;
  timeSlotId: string;
  date: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  amount: number;
  teamName?: string;
  playerCount: number;
  contactNumber: string;
  specialRequests?: string;
  bookingTime: Date;
  qrCode?: string;
}

export interface Team {
  id: string;
  name: string;
  userId: string;
  players: Player[];
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  bookingId?: string;
}
