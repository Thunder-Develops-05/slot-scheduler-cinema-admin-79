import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theater } from '@/types/theater';
import { TimeSlot } from '@/types/timeSlot';
import { useToast } from '@/hooks/use-toast';

// Define types for calendar day statuses
export type DayStatus = 'active' | 'holiday' | 'inactive';
export interface CalendarDay {
  date: string; // ISO string format
  status: DayStatus;
  note?: string;
}

interface AppContextType {
  theaters: Theater[];
  timeSlots: TimeSlot[];
  addTheater: (theater: Theater) => void;
  updateTheater: (theater: Theater) => void;
  deleteTheater: (id: string) => void;
  addTimeSlots: (slots: TimeSlot[]) => void;
  updateTimeSlot: (updatedSlot: TimeSlot) => void;
  deleteTimeSlot: (id: string) => void;
  getTheaterById: (id: string) => Theater | undefined;
  getTimeSlotsByTheaterId: (theaterId: string) => TimeSlot[];
  
  // Calendar related properties and methods
  calendarDays: CalendarDay[];
  addCalendarDay: (day: CalendarDay) => void;
  updateCalendarDay: (day: CalendarDay) => void;
  removeCalendarDay: (date: string) => void;
  getDayStatus: (date: string) => DayStatus;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTheaters = localStorage.getItem('theaters');
    const savedTimeSlots = localStorage.getItem('timeSlots');
    const savedCalendarDays = localStorage.getItem('calendarDays');

    if (savedTheaters) {
      setTheaters(JSON.parse(savedTheaters));
    }

    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    }

    if (savedCalendarDays) {
      setCalendarDays(JSON.parse(savedCalendarDays));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theaters', JSON.stringify(theaters));
  }, [theaters]);

  useEffect(() => {
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('calendarDays', JSON.stringify(calendarDays));
  }, [calendarDays]);

  const addTheater = (theater: Theater) => {
    setTheaters((prev) => [...prev, theater]);
    toast({
      title: "Theater added",
      description: `${theater.name} has been added successfully.`,
    });
  };

  const updateTheater = (theater: Theater) => {
    setTheaters((prev) => 
      prev.map((t) => (t.id === theater.id ? theater : t))
    );
    toast({
      title: "Theater updated",
      description: `${theater.name} has been updated successfully.`,
    });
  };

  const deleteTheater = (id: string) => {
    const theater = theaters.find(t => t.id === id);
    setTheaters((prev) => prev.filter((t) => t.id !== id));
    
    // Also delete any time slots associated with this theater
    setTimeSlots((prev) => prev.filter((slot) => slot.theaterId !== id));
    
    if (theater) {
      toast({
        title: "Theater deleted",
        description: `${theater.name} has been deleted successfully.`,
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
    toast({
      title: "Time slot deleted",
      description: "Time slot has been deleted successfully.",
    });
  };

  const getTheaterById = (id: string) => {
    return theaters.find((theater) => theater.id === id);
  };

  const getTimeSlotsByTheaterId = (theaterId: string) => {
    return timeSlots.filter((slot) => slot.theaterId === theaterId);
  };

  // Calendar related functions
  const addCalendarDay = (day: CalendarDay) => {
    // Check if the day already exists and remove it
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
        theaters,
        timeSlots,
        addTheater,
        updateTheater,
        deleteTheater,
        addTimeSlots,
        updateTimeSlot,
        deleteTimeSlot,
        getTheaterById,
        getTimeSlotsByTheaterId,
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
