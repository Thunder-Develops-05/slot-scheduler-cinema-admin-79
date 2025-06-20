
import React, { useState } from 'react';
import { format, addDays, startOfToday } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { CalendarDays, MapPin, Users, Clock, Target, Star } from 'lucide-react';
import UserHeader from '@/components/user/UserHeader';
import DateSelector from '@/components/user/DateSelector';
import CenterList from '@/components/user/CenterList';
import SlotSelection from '@/components/user/SlotSelection';
import { Center } from '@/types/center';

const UserBooking = () => {
  const { centers } = useAppContext();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);

  const activeCenters = centers.filter(center => center.isActive);

  if (selectedCenter) {
    return (
      <SlotSelection 
        center={selectedCenter}
        selectedDate={selectedDate}
        onBack={() => setSelectedCenter(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <UserHeader />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Book Your Cricket Slot
          </h1>
          <p className="text-purple-600">
            Choose your preferred date and center to book an amazing cricket experience
          </p>
        </div>

        {/* Date Selection */}
        <DateSelector 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Centers List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-800">
              Available Centers ({activeCenters.length})
            </h2>
          </div>
          
          <CenterList 
            centers={activeCenters}
            onCenterSelect={setSelectedCenter}
            selectedDate={selectedDate}
          />
        </div>

        {activeCenters.length === 0 && (
          <Card className="text-center py-12 border-purple-200">
            <CardContent>
              <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-800 mb-2">
                No Centers Available
              </h3>
              <p className="text-purple-600">
                Currently, there are no active cricket centers. Please check back later.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default UserBooking;
