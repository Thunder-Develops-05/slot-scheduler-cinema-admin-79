
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useBooking } from '@/context/BookingContext';
import { useAppContext } from '@/context/AppContext';
import UserHeader from '@/components/user/UserHeader';
import TabNavigation from '@/components/user/TabNavigation';
import { QrCode, MapPin, Clock, Users, Star, Share2, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const MyBookings = () => {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  const { getCenterById, getTimeSlotById } = useAppContext();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  
  const userBookings = user ? getUserBookings(user.email) : [];
  const upcomingBookings = userBookings.filter(booking => 
    booking.status !== 'cancelled' && new Date(booking.date) >= new Date()
  );
  const pastBookings = userBookings.filter(booking => 
    booking.status !== 'cancelled' && new Date(booking.date) < new Date()
  );

  const getBookingDetails = (booking: any) => {
    const center = getCenterById(booking.centerId);
    const timeSlot = getTimeSlotById(booking.timeSlotId);
    return { center, timeSlot };
  };

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
  };

  const generateQRCode = (booking: any) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Booking-${booking.id}`;
  };

  const shareBooking = (booking: any) => {
    const { center, timeSlot } = getBookingDetails(booking);
    const text = `🏏 Cricket Booking Confirmed!\n\nCenter: ${center?.name}\nDate: ${format(new Date(booking.date), 'PPP')}\nTime: ${timeSlot?.startTime} - ${timeSlot?.endTime}\nBooking ID: ${booking.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Cricket Booking Details',
        text,
      });
    }
  };

  const BookingCard = ({ booking, isPast = false }: { booking: any; isPast?: boolean }) => {
    const { center, timeSlot } = getBookingDetails(booking);
    
    return (
      <Card className="mb-4 border-purple-200 hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg text-purple-800">{center?.name}</CardTitle>
              <div className="flex items-center text-purple-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {center?.location}
              </div>
            </div>
            <Badge 
              variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
              className={booking.status === 'confirmed' ? 'bg-green-500' : ''}
            >
              {booking.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-600" />
              <span>{format(new Date(booking.date), 'PPP')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-purple-600" />
              <span>{timeSlot?.startTime} - {timeSlot?.endTime}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              <span>{booking.playerCount} players</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold">₹{booking.amount}</span>
            </div>
          </div>

          {booking.teamName && (
            <div className="text-sm">
              <span className="font-medium text-purple-700">Team: </span>
              {booking.teamName}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!isPast && booking.status === 'confirmed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowQRCode(true);
                  }}
                  className="flex items-center"
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shareBooking(booking)}
                  className="flex items-center"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {isPast && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <Star className="h-4 w-4 mr-1" />
                Rate Experience
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 pb-20">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-purple-800 mb-6">My Bookings</h1>
        
        {userBookings.length === 0 ? (
          <Card className="text-center py-12 border-purple-200">
            <CardContent>
              <Calendar className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                No Bookings Yet
              </h3>
              <p className="text-purple-600 mb-4">
                You haven't made any bookings yet. Start by booking your first slot!
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Book Now
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {upcomingBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Upcoming Bookings ({upcomingBookings.length})
                </h2>
                {upcomingBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
            
            {pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-purple-800 mb-4">
                  Past Bookings ({pastBookings.length})
                </h2>
                {pastBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">Entry QR Code</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="text-center space-y-4">
              <img 
                src={generateQRCode(selectedBooking)} 
                alt="Booking QR Code"
                className="mx-auto"
              />
              <p className="text-sm text-gray-600">
                Show this QR code at the venue for entry
              </p>
              <p className="text-xs text-gray-500">
                Booking ID: {selectedBooking.id}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TabNavigation />
    </div>
  );
};

export default MyBookings;
