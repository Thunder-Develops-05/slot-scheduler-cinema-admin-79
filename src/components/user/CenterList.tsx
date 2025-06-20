
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Center } from '@/types/center';
import { MapPin, Users, Target, Star, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';

interface CenterListProps {
  centers: Center[];
  onCenterSelect: (center: Center) => void;
  selectedDate: Date;
}

const CenterList = ({ centers, onCenterSelect, selectedDate }: CenterListProps) => {
  const { getTimeSlotsByCenterId, getTodayBookingsForCenter } = useAppContext();

  const getCenterStats = (center: Center) => {
    const timeSlots = getTimeSlotsByCenterId(center.id);
    const dayOfWeek = format(selectedDate, 'EEEE').toLowerCase() as any;
    const daySlots = timeSlots.filter(slot => slot.day === dayOfWeek);
    const bookings = getTodayBookingsForCenter(center.id);
    const bookedSlots = bookings.length;
    const availableSlots = daySlots.length - bookedSlots;
    
    return {
      totalSlots: daySlots.length,
      availableSlots: Math.max(0, availableSlots),
      bookedSlots
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {centers.map((center) => {
        const stats = getCenterStats(center);
        
        return (
          <Card 
            key={center.id} 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 border-purple-200 hover:border-purple-300 group cursor-pointer"
            onClick={() => onCenterSelect(center)}
          >
            <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative overflow-hidden">
              {center.imageUrl ? (
                <img 
                  src={center.imageUrl} 
                  alt={center.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Target className="h-16 w-16 text-white opacity-70" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-purple-700 hover:bg-white">
                  <Star className="h-3 w-3 mr-1" />
                  4.8
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4">
                <Badge 
                  variant={stats.availableSlots > 0 ? "default" : "secondary"}
                  className={stats.availableSlots > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"}
                >
                  {stats.availableSlots > 0 ? `${stats.availableSlots} Available` : 'Fully Booked'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-purple-800 group-hover:text-purple-600 transition-colors">
                {center.name}
              </CardTitle>
              <div className="flex items-center text-purple-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {center.location}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Users className="h-3 w-3 mr-1" />
                  {center.capacity} people
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Target className="h-3 w-3 mr-1" />
                  {center.courts} courts
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Clock className="h-3 w-3 mr-1" />
                  {stats.totalSlots} slots
                </Badge>
              </div>

              {center.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {center.description}
                </p>
              )}

              {center.amenities && center.amenities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {center.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      {amenity}
                    </Badge>
                  ))}
                  {center.amenities.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      +{center.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={stats.availableSlots === 0}
              >
                {stats.availableSlots > 0 ? 'View Available Slots' : 'Fully Booked'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CenterList;
