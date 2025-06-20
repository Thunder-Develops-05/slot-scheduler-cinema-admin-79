
export interface TimeSlot {
  id: string;
  centerId: string;
  day: string;
  startTime: string;
  endTime: string;
  price: number;
  isActive: boolean;
  maxCapacity?: number;
  isSpecialEvent?: boolean;
  notes?: string;
}
