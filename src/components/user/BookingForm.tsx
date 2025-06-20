
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Center } from '@/types/center';
import { TimeSlot, Booking } from '@/types/timeSlot';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, User, Phone, Mail, Users, CreditCard, Calendar, Clock } from 'lucide-react';

interface BookingFormProps {
  center: Center;
  slot: TimeSlot;
  selectedDate: Date;
  onBack: () => void;
  onCancel: () => void;
}

const BookingForm = ({ center, slot, selectedDate, onBack, onCancel }: BookingFormProps) => {
  const { addBooking } = useAppContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerPhone: '',
    customerEmail: user?.email || '',
    numberOfPeople: 1,
    notes: ''
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        slotId: slot.id,
        centerId: center.id,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        date: format(selectedDate, 'yyyy-MM-dd'),
        numberOfPeople: formData.numberOfPeople,
        totalAmount: slot.price,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'online',
        bookingTime: new Date().toISOString(),
        notes: formData.notes
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      addBooking(booking);
      onCancel(); // Go back to main page
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Slots
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-800">Complete Your Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-700">
                        <User className="h-4 w-4 inline mr-1" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        required
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className="border-purple-200 focus:border-purple-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-purple-700">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        className="border-purple-200 focus:border-purple-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-purple-700">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="people" className="text-purple-700">
                      <Users className="h-4 w-4 inline mr-1" />
                      Number of People *
                    </Label>
                    <Input
                      id="people"
                      type="number"
                      min="1"
                      max={slot.maxCapacity || center.capacity}
                      required
                      value={formData.numberOfPeople}
                      onChange={(e) => handleInputChange('numberOfPeople', parseInt(e.target.value))}
                      className="border-purple-200 focus:border-purple-500"
                    />
                    <p className="text-xs text-purple-600">
                      Maximum {slot.maxCapacity || center.capacity} people allowed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-purple-700">
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="border-purple-200 focus:border-purple-500"
                      placeholder="Any special requests or notes..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                      className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      {isLoading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="border-purple-200 sticky top-6">
              <CardHeader>
                <CardTitle className="text-purple-800">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-1">{center.name}</h4>
                    <p className="text-sm text-purple-600">{center.location}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Date:
                      </span>
                      <span className="text-sm font-medium text-purple-800">
                        {format(selectedDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Time:
                      </span>
                      <span className="text-sm font-medium text-purple-800">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        People:
                      </span>
                      <span className="text-sm font-medium text-purple-800">
                        {formData.numberOfPeople}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-purple-200 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-600 flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-purple-800">
                        ₹{slot.price}
                      </span>
                    </div>
                  </div>
                  
                  <Badge className="w-full justify-center bg-green-100 text-green-700 hover:bg-green-100">
                    Instant Confirmation
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
