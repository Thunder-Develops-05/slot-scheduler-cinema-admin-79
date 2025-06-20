import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Center } from '@/types/center';
import { TimeSlot } from '@/types/timeSlot';
import { Theater } from '@/types/theater';
import { Booking } from '@/types/booking';
import { toast } from '@/components/ui/use-toast';

export interface CalendarDay {
  id: string;
  date: Date;
  status: DayStatus;
  reason?: string;
}

export type DayStatus = 'available' | 'holiday' | 'blocked';

interface AppContextType {
  centers: Center[];
  timeSlots: TimeSlot[];
  theaters: Theater[];
  bookings: Booking[];
  calendarDays: CalendarDay[];
  addCenter: (center: Center) => void;
  updateCenter: (center: Center) => void;
  deleteCenter: (id: string) => void;
  getCenterById: (id: string) => Center | undefined;
  addTimeSlots: (timeSlots: TimeSlot[]) => void;
  updateTimeSlot: (timeSlot: TimeSlot) => void;
  deleteTimeSlot: (id: string) => void;
  getTimeSlotsByCenterId: (centerId: string) => TimeSlot[];
  getTimeSlotById: (id: string) => TimeSlot | undefined;
  getTodayBookingsForCenter: (centerId: string) => any[];
  addTheater: (theater: Theater) => void;
  updateTheater: (theater: Theater) => void;
  deleteTheater: (id: string) => void;
  addBooking: (booking: Booking) => void;
  addCalendarDay: (day: CalendarDay) => void;
  removeCalendarDay: (id: string) => void;
  getDayStatus: (date: Date) => DayStatus;
  getPaymentHistoryForCenter: (centerId: string) => any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [centers, setCenters] = useState<Center[]>([
    {
      id: '1',
      name: 'SportZone Cricket Arena',
      location: 'Sector 15, Noida',
      courts: 2,
      capacity: 22,
      amenities: ['Parking', 'Washrooms', 'Cafeteria', 'Equipment Rental'],
      description: 'Premium cricket facility with professional-grade pitches and modern amenities.',
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3'
    },
    {
      id: '2',
      name: 'Champions Cricket Ground',
      location: 'DLF Phase 2, Gurgaon',
      courts: 3,
      capacity: 30,
      amenities: ['Parking', 'Washrooms', 'Floodlights', 'Seating Area'],
      description: 'State-of-the-art cricket ground with excellent facilities for players and spectators.',
      isActive: true,
      imageUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3'
    }
  ]);
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    // Morning slots for SportZone
    { id: '1', centerId: '1', day: 'monday', startTime: '06:00', endTime: '07:00', price: 500, isActive: true },
    { id: '2', centerId: '1', day: 'monday', startTime: '07:00', endTime: '08:00', price: 500, isActive: true },
    { id: '3', centerId: '1', day: 'monday', startTime: '18:00', endTime: '19:00', price: 800, isActive: true },
    { id: '4', centerId: '1', day: 'monday', startTime: '19:00', endTime: '20:00', price: 800, isActive: true },
    
    // Champions Ground slots
    { id: '5', centerId: '2', day: 'monday', startTime: '06:00', endTime: '07:00', price: 600, isActive: true },
    { id: '6', centerId: '2', day: 'monday', startTime: '18:00', endTime: '19:00', price: 900, isActive: true },
    { id: '7', centerId: '2', day: 'monday', startTime: '19:00', endTime: '20:00', price: 900, isActive: true },
  ]);
  
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const addCenter = (center: Center) => {
    setCenters(prev => [...prev, center]);
    toast({
      title: "Center added successfully",
      description: `${center.name} has been added to your centers.`,
    });
  };

  const updateCenter = (updatedCenter: Center) => {
    setCenters(prev => prev.map(center => 
      center.id === updatedCenter.id ? updatedCenter : center
    ));
    toast({
      title: "Center updated successfully",
      description: `${updatedCenter.name} has been updated.`,
    });
  };

  const deleteCenter = (id: string) => {
    setCenters(prev => prev.filter(center => center.id !== id));
    toast({
      title: "Center deleted",
      description: "The center has been removed successfully.",
    });
  };

  const getCenterById = (id: string) => {
    return centers.find(center => center.id === id);
  };

  const addTimeSlots = (newTimeSlots: TimeSlot[]) => {
    setTimeSlots(prev => [...prev, ...newTimeSlots]);
  };

  const updateTimeSlot = (updatedTimeSlot: TimeSlot) => {
    setTimeSlots(prev => prev.map(slot => 
      slot.id === updatedTimeSlot.id ? updatedTimeSlot : slot
    ));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const getTimeSlotsByCenterId = (centerId: string) => {
    return timeSlots.filter(slot => slot.centerId === centerId);
  };

  const getTimeSlotById = (id: string) => {
    return timeSlots.find(slot => slot.id === id);
  };

  const getTodayBookingsForCenter = (centerId: string) => {
    // This would normally fetch from a booking service
    // For now, return empty array as placeholder
    return [];
  };

  const addTheater = (theater: Theater) => {
    setTheaters(prev => [...prev, theater]);
    toast({
      title: "Theater added successfully",
      description: `${theater.name} has been added.`,
    });
  };

  const updateTheater = (updatedTheater: Theater) => {
    setTheaters(prev => prev.map(theater => 
      theater.id === updatedTheater.id ? updatedTheater : theater
    ));
    toast({
      title: "Theater updated successfully",
      description: `${updatedTheater.name} has been updated.`,
    });
  };

  const deleteTheater = (id: string) => {
    setTheaters(prev => prev.filter(theater => theater.id !== id));
    toast({
      title: "Theater deleted",
      description: "The theater has been removed successfully.",
    });
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    toast({
      title: "Booking confirmed",
      description: `Your booking for ${booking.date} has been confirmed.`,
    });
  };

  const addCalendarDay = (day: CalendarDay) => {
    setCalendarDays(prev => [...prev, day]);
  };

  const removeCalendarDay = (id: string) => {
    setCalendarDays(prev => prev.filter(day => day.id !== id));
  };

  const getDayStatus = (date: Date): DayStatus => {
    const day = calendarDays.find(d => 
      d.date.toDateString() === date.toDateString()
    );
    return day?.status || 'available';
  };

  const getPaymentHistoryForCenter = (centerId: string) => {
    // This would normally fetch payment history
    // For now, return empty array as placeholder
    return [];
  };

  return (
    <AppContext.Provider value={{
      centers,
      timeSlots,
      theaters,
      bookings,
      calendarDays,
      addCenter,
      updateCenter,
      deleteCenter,
      getCenterById,
      addTimeSlots,
      updateTimeSlot,
      deleteTimeSlot,
      getTimeSlotsByCenterId,
      getTimeSlotById,
      getTodayBookingsForCenter,
      addTheater,
      updateTheater,
      deleteTheater,
      addBooking,
      addCalendarDay,
      removeCalendarDay,
      getDayStatus,
      getPaymentHistoryForCenter,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
