
export interface TimeSlot {
  id: string;
  centerId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  price: number;
  isSpecialEvent?: boolean;
  notes?: string;
  maxCapacity?: number;
}

export interface Booking {
  id: string;
  slotId: string;
  centerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string; // ISO string format
  numberOfPeople: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'upi' | 'online';
  bookingTime: string; // ISO string format
  notes?: string;
}
