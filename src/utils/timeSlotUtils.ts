
import { TimeSlot } from '@/types/timeSlot';

interface GenerateSlotsOptions {
  centerId: string;
  days: string[];
  startTime: string;
  endTime: string;
  intervalMinutes: number;
  price: number;
}

export const generateTimeSlots = (options: GenerateSlotsOptions): TimeSlot[] => {
  const { centerId, days, startTime, endTime, intervalMinutes, price } = options;
  
  const slots: TimeSlot[] = [];
  
  for (const day of days) {
    // Convert start and end times to minutes since midnight for easier calculations
    const startMinutes = convertTimeToMinutes(startTime);
    const endMinutes = convertTimeToMinutes(endTime);
    
    // Generate slots for this day
    let currentMinutes = startMinutes;
    
    while (currentMinutes + intervalMinutes <= endMinutes) {
      const slotStartTime = convertMinutesToTime(currentMinutes);
      const slotEndTime = convertMinutesToTime(currentMinutes + intervalMinutes);
      
      slots.push({
        id: crypto.randomUUID(),
        centerId,
        day: day as TimeSlot['day'],
        startTime: slotStartTime,
        endTime: slotEndTime,
        price: price,
      });
      
      currentMinutes += intervalMinutes;
    }
  }
  
  return slots;
};

// Helper function to convert "HH:MM" to minutes since midnight
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to convert minutes since midnight to "HH:MM" format
const convertMinutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const formatTimeRange = (startTime: string, endTime: string): string => {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours, 10);
  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  
  return `${hour12}:${minutes} ${period}`;
};

export const groupSlotsByDay = (slots: TimeSlot[]): Record<string, TimeSlot[]> => {
  const dayOrder = {
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6
  };

  // Group slots by day
  const groups = slots.reduce((acc, slot) => {
    const day = slot.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  // Sort slots within each day by start time
  Object.keys(groups).forEach(day => {
    groups[day].sort((a, b) => {
      return convertTimeToMinutes(a.startTime) - convertTimeToMinutes(b.startTime);
    });
  });

  return groups;
};
