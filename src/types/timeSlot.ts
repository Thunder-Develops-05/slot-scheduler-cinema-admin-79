
export interface TimeSlot {
  id: string;
  theaterId: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  price: number;
  isSpecialEvent?: boolean;
  notes?: string;
}
