
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar as CalendarIcon, Users, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatTimeRange } from '@/utils/timeSlotUtils';
import { format } from 'date-fns';
import BookingDialog from '@/components/bookings/BookingDialog';
import { TimeSlot } from '@/types/timeSlot';

const ManualBooking = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const navigate = useNavigate();
  const { getCenterById, getTimeSlotsByCenterId, getDayStatus } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  if (!centerId) {
    navigate('/centers');
    return null;
  }

  const center = getCenterById(centerId);
  const timeSlots = getTimeSlotsByCenterId(centerId);

  if (!center) {
    navigate('/centers');
    return null;
  }

  // Get current day of week
  const getCurrentDayOfWeek = (date: Date): string => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[date.getDay()];
  };

  // Filter slots for selected date
  const getAvailableSlots = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = getCurrentDayOfWeek(selectedDate);
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dayStatus = getDayStatus(dateString);
    
    // Don't show slots if it's a holiday
    if (dayStatus === 'holiday') return [];
    
    return timeSlots.filter(slot => slot.day === dayOfWeek);
  };

  const handleSlotBook = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setIsBookingDialogOpen(true);
  };

  const availableSlots = getAvailableSlots();

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <Link 
              to={`/centers/${centerId}`}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Center Overview
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Manual Booking
              </h1>
            </div>
            <p className="text-muted-foreground">{center.name} • Offline Booking System</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date
              </CardTitle>
              <CardDescription>
                Choose a date to view available time slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  const dateString = format(date, 'yyyy-MM-dd');
                  const dayStatus = getDayStatus(dateString);
                  return date < new Date() || dayStatus === 'holiday';
                }}
                className="rounded-md border w-full"
              />
              {selectedDate && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Selected Date:</p>
                  <p className="text-lg font-semibold">{format(selectedDate, 'PPP')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Slots Section */}
          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
              <CardDescription>
                {selectedDate 
                  ? `Slots available on ${format(selectedDate, 'PPP')}`
                  : 'Select a date to view available slots'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!selectedDate ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Please select a date to view available slots</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No slots available for this date</p>
                  {getDayStatus(format(selectedDate, 'yyyy-MM-dd')) === 'holiday' && (
                    <Badge variant="destructive" className="mt-2">Holiday</Badge>
                  )}
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {formatTimeRange(slot.startTime, slot.endTime)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${slot.price} per booking
                        </div>
                      </div>
                      <Button
                        onClick={() => handleSlotBook(slot)}
                        size="sm"
                      >
                        Book Slot
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      {selectedSlot && (
        <BookingDialog
          isOpen={isBookingDialogOpen}
          onClose={() => {
            setIsBookingDialogOpen(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          selectedDate={selectedDate!}
          centerId={centerId}
        />
      )}
    </Layout>
  );
};

export default ManualBooking;
