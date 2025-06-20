
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Booking, Team, WalletTransaction } from '@/types/booking';
import { toast } from '@/components/ui/use-toast';

interface BookingContextType {
  bookings: Booking[];
  teams: Team[];
  walletBalance: number;
  walletTransactions: WalletTransaction[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  getUserBookings: (userId: string) => Booking[];
  addTeam: (team: Team) => void;
  addWalletCredit: (amount: number, description: string) => void;
  deductWalletCredit: (amount: number, description: string, bookingId?: string) => boolean;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [walletBalance, setWalletBalance] = useState(500); // Default balance
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
    toast({
      title: "Booking Confirmed!",
      description: `Your slot has been booked for ${booking.date.toLocaleDateString()}`,
    });
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const }
          : booking
      )
    );
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully",
    });
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const addTeam = (team: Team) => {
    setTeams(prev => [...prev, team]);
    toast({
      title: "Team Created",
      description: `Team "${team.name}" has been created successfully`,
    });
  };

  const addWalletCredit = (amount: number, description: string) => {
    const transaction: WalletTransaction = {
      id: Date.now().toString(),
      userId: 'current-user', // This should come from auth context
      type: 'credit',
      amount,
      description,
      date: new Date(),
    };
    
    setWalletBalance(prev => prev + amount);
    setWalletTransactions(prev => [transaction, ...prev]);
    toast({
      title: "Credits Added",
      description: `₹${amount} has been added to your wallet`,
    });
  };

  const deductWalletCredit = (amount: number, description: string, bookingId?: string) => {
    if (walletBalance < amount) {
      toast({
        title: "Insufficient Balance",
        description: "Please add credits to your wallet",
        variant: "destructive",
      });
      return false;
    }

    const transaction: WalletTransaction = {
      id: Date.now().toString(),
      userId: 'current-user',
      type: 'debit',
      amount,
      description,
      date: new Date(),
      bookingId,
    };
    
    setWalletBalance(prev => prev - amount);
    setWalletTransactions(prev => [transaction, ...prev]);
    return true;
  };

  return (
    <BookingContext.Provider value={{
      bookings,
      teams,
      walletBalance,
      walletTransactions,
      addBooking,
      cancelBooking,
      getUserBookings,
      addTeam,
      addWalletCredit,
      deductWalletCredit,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
