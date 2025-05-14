
import React from 'react';
import { formatTime } from '@/utils/timeSlotUtils';
import { TimeSlot } from '@/types/timeSlot';
import { 
  Card, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TimeSlotCardProps {
  slot: TimeSlot;
  onEdit: (slot: TimeSlot) => void;
  onDelete: (id: string) => void;
}

const TimeSlotCard = ({ slot, onEdit, onDelete }: TimeSlotCardProps) => {
  const { startTime, endTime, day, price, id } = slot;
  
  return (
    <Card className="overflow-hidden border-l-4" style={{ borderLeftColor: getColorForDay(day) }}>
      <CardContent className="p-4 pb-0 space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">
              {formatTime(startTime)} - {formatTime(endTime)}
            </h3>
            <p className="text-sm text-muted-foreground capitalize mb-1">{day}</p>
          </div>
          <Badge variant="outline" className="font-mono">
            ${price?.toFixed(2)}
          </Badge>
        </div>

        {slot.isSpecialEvent && (
          <Badge variant="secondary" className="mt-1">Special Event</Badge>
        )}
        
        {slot.notes && (
          <p className="text-xs text-muted-foreground border-t pt-2 mt-1">
            {slot.notes}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end p-2 gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onEdit(slot)}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onDelete(id)}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to get color based on day
function getColorForDay(day: string): string {
  const colors: Record<string, string> = {
    monday: '#3b82f6',    // Blue
    tuesday: '#10b981',   // Green
    wednesday: '#f59e0b', // Amber
    thursday: '#6366f1',  // Indigo
    friday: '#ec4899',    // Pink
    saturday: '#8b5cf6',  // Purple
    sunday: '#ef4444',    // Red
  };
  
  return colors[day.toLowerCase()] || '#64748b'; // Default to slate
}

export default TimeSlotCard;
