
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Center } from '@/types/center';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, Clock, MapPin, Users, Star } from 'lucide-react';
import { TimeSlot } from '@/types/timeSlot';
import BookingForm from '@/components/user/BookingForm';

interface SlotSelectionProps {
  center: Center;
  selectedDate: Date;
  onBack: () => void;
}

const SlotSelection = ({ center, selectedDate, onBack }: SlotSelectionProps) => {
  const { getTimeSlotsByCenterId, getTodayBookingsForCenter } = useAppContext();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase() as any;
  const timeSlots = getTimeSlotsByCenterId(center.id).filter(slot => slot.day === dayOfWeek);
  const bookings = getTodayBookingsForCenter(center.id);
  const bookedSlotIds = bookings.map(booking => booking.slotId);

  const availableSlots = timeSlots.filter(slot => !bookedSlotIds.includes(slot.id));

  if (selectedSlot) {
    return (
      <BookingForm
        center={center}
        slot={selectedSlot}
        selectedDate={selectedDate}
        onBack={() => setSelectedSlot(null)}
        onCancel={() => {
          setSelectedSlot(null);
          onBack();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Centers
        </Button>

        {/* Center Info */}
        <Card className="mb-6 border-purple-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                {center.imageUrl ? (
                  <img 
                    src={center.imageUrl} 
                    alt={center.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Users className="h-12 w-12 text-white opacity-70" />
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-purple-800 mb-2">{center.name}</h1>
                  <div className="flex items-center text-purple-600 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{center.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-purple-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Capacity: {center.capacity}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Courts: {center.courts}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      4.8 Rating
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Selected Date</h3>
                  <p className="text-purple-600">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Slots */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Clock className="h-5 w-5" />
              Available Time Slots ({availableSlots.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {availableSlots.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-purple-800 mb-2">
                  No Available Slots
                </h3>
                <p className="text-purple-600">
                  All slots for this date are booked. Please try another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSlots.map((slot) => (
                  <Card 
                    key={slot.id} 
                    className="cursor-pointer border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-200"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-purple-800">
                              {slot.startTime} - {slot.endTime}
                            </h4>
                            <p className="text-sm text-purple-600">
                              Duration: {parseInt(slot.endTime) - parseInt(slot.startTime)} hour(s)
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            Available
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-purple-600">Price:</span>
                            <span className="font-semibold text-purple-800">₹{slot.price}</span>
                          </div>
                          {slot.maxCapacity && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-purple-600">Max Capacity:</span>
                              <span className="text-sm text-purple-800">{slot.maxCapacity} people</span>
                            </div>
                          )}
                        </div>
                        
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          Book This Slot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SlotSelection;
