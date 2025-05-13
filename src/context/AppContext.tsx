
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Theater } from '@/types/theater';
import { TimeSlot } from '@/types/timeSlot';
import { useToast } from '@/components/ui/use-toast';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTheaters = localStorage.getItem('theaters');
    const savedTimeSlots = localStorage.getItem('timeSlots');

    if (savedTheaters) {
      setTheaters(JSON.parse(savedTheaters));
    }

    if (savedTimeSlots) {
      setTimeSlots(JSON.parse(savedTimeSlots));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theaters', JSON.stringify(theaters));
  }, [theaters]);

  useEffect(() => {
    localStorage.setItem('timeSlots', JSON.stringify(timeSlots));
  }, [timeSlots]);

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
