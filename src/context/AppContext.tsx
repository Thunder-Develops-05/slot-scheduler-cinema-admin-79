
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Center } from '@/types/center';
import { TimeSlot, Booking } from '@/types/timeSlot';
import { useToast } from '@/hooks/use-toast';

// Define types for calendar day statuses
export type DayStatus = 'active' | 'holiday' | 'inactive';
export interface CalendarDay {
  date: string; // ISO string format
  status: DayStatus;
  note?: string;
}

interface AppContextType {
  centers: Center[];
  timeSlots: TimeSlot[];
  bookings: Booking[];
  addCenter: (center: Center) => void;
  updateCenter: (center: Center) => void;
  deleteCenter: (id: string) => void;
  addTimeSlots: (slots: TimeSlot[]) => void;
  updateTimeSlot: (updatedSlot: TimeSlot) => void;
  deleteTimeSlot: (id: string) => void;
  getCenterById: (id: string) => Center | undefined;
  getTimeSlotsByCenterId: (centerId: string) => TimeSlot[];
  
  // Booking related methods
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  getBookingsByCenterId: (centerId: string) => Booking[];
  getTodayBookingsForCenter: (centerId: string) => Booking[];
  getPaymentHistoryForCenter: (centerId: string) => Booking[];
  
  // Calendar related properties and methods
  calendarDays: CalendarDay[];
  addCalendarDay: (day: CalendarDay) => void;
  updateCalendarDay: (day: CalendarDay) => void;
  removeCalendarDay: (date: string) => void;
  getDayStatus: (date: string) => DayStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedCenters = localStorage.getItem('centers');
    const savedTimeSlots = localStorage.getItem('timeSlots');
    const savedBookings = localStorage.getItem('bookings');
    const savedCalendarDays = localStorage.getItem('calendarDays');

    if (savedCenters) {
      setCenters(JSON.parse(savedCenters));
    }

    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    }

    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    }

    if (savedCalendarDays) {
      setCalendarDays(JSON.parse(savedCalendarDays));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('centers', JSON.stringify(centers));
  }, [centers]);

  useEffect(() => {
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('calendarDays', JSON.stringify(calendarDays));
  }, [calendarDays]);

  const addCenter = (center: Center) => {
    setCenters((prev) => [...prev, center]);
    toast({
      title: "Center added",
      description: `${center.name} has been added successfully.`,
    });
  };

  const updateCenter = (center: Center) => {
    setCenters((prev) => 
      prev.map((c) => (c.id === center.id ? center : c))
    );
    toast({
      title: "Center updated",
      description: `${center.name} has been updated successfully.`,
    });
  };

  const deleteCenter = (id: string) => {
    const center = centers.find(c => c.id === id);
    setCenters((prev) => prev.filter((c) => c.id !== id));
    
    // Also delete any time slots and bookings associated with this center
    setTimeSlots((prev) => prev.filter((slot) => slot.centerId !== id));
    setBookings((prev) => prev.filter((booking) => booking.centerId !== id));
    
    if (center) {
      toast({
        title: "Center deleted",
        description: `${center.name} has been deleted successfully.`,
      });
    }
  };

  const addTimeSlots = (slots: TimeSlot[]) => {
    setTimeSlots((prev) => [...prev, ...slots]);
    toast({
      title: "Time slots added",
      description: `${slots.length} time slots have been added successfully.`,
    });
  };

  const updateTimeSlot = (updatedSlot: TimeSlot) => {
    setTimeSlots((prev) =>
      prev.map((slot) => (slot.id === updatedSlot.id ? updatedSlot : slot))
    );
    toast({
      title: "Time slot updated",
      description: "Time slot has been updated successfully.",
    });
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
    // Also delete any bookings for this slot
    setBookings((prev) => prev.filter((booking) => booking.slotId !== id));
    toast({
      title: "Time slot deleted",
      description: "Time slot has been deleted successfully.",
    });
  };

  const getCenterById = (id: string) => {
    return centers.find((center) => center.id === id);
  };

  const getTimeSlotsByCenterId = (centerId: string) => {
    return timeSlots.filter((slot) => slot.centerId === centerId);
  };

  // Booking related functions
  const addBooking = (booking: Booking) => {
    setBookings((prev) => [...prev, booking]);
    toast({
      title: "Booking added",
      description: `Booking for ${booking.customerName} has been added.`,
    });
  };

  const updateBooking = (booking: Booking) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? booking : b))
    );
    toast({
      title: "Booking updated",
      description: "Booking has been updated successfully.",
    });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== id));
    toast({
      title: "Booking deleted",
      description: "Booking has been deleted successfully.",
    });
  };

  const getBookingsByCenterId = (centerId: string) => {
    return bookings.filter((booking) => booking.centerId === centerId);
  };

  const getTodayBookingsForCenter = (centerId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter((booking) => 
      booking.centerId === centerId && booking.date.startsWith(today)
    );
  };

  const getPaymentHistoryForCenter = (centerId: string) => {
    return bookings
      .filter((booking) => booking.centerId === centerId && booking.paymentStatus === 'paid')
      .sort((a, b) => new Date(b.bookingTime).getTime() - new Date(a.bookingTime).getTime());
  };

  // Calendar related functions
  const addCalendarDay = (day: CalendarDay) => {
    const filteredDays = calendarDays.filter(d => d.date !== day.date);
    setCalendarDays([...filteredDays, day]);
    toast({
      title: "Calendar updated",
      description: `${day.date} has been marked as ${day.status}.`,
    });
  };

  const updateCalendarDay = (day: CalendarDay) => {
    setCalendarDays(prev => 
      prev.map(d => d.date === day.date ? day : d)
    );
    toast({
      title: "Calendar day updated",
      description: `${day.date} status updated to ${day.status}.`,
    });
  };

  const removeCalendarDay = (date: string) => {
    setCalendarDays(prev => prev.filter(d => d.date !== date));
    toast({
      title: "Calendar day removed",
      description: `${date} has been reset to default.`,
    });
  };

  const getDayStatus = (date: string): DayStatus => {
    const day = calendarDays.find(d => d.date === date);
    return day ? day.status : 'inactive';
  };

  return (
    <AppContext.Provider
      value={{
        centers,
        timeSlots,
        bookings,
        addCenter,
        updateCenter,
        deleteCenter,
        addTimeSlots,
        updateTimeSlot,
        deleteTimeSlot,
        getCenterById,
        getTimeSlotsByCenterId,
        // Booking related
        addBooking,
        updateBooking,
        deleteBooking,
        getBookingsByCenterId,
        getTodayBookingsForCenter,
        getPaymentHistoryForCenter,
        // Calendar related
        calendarDays,
        addCalendarDay,
        updateCalendarDay,
        removeCalendarDay,
        getDayStatus,
      }}
    >
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
