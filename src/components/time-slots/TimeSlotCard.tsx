
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, Edit, Trash } from 'lucide-react';
import { TimeSlot } from '@/types/timeSlot';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface TimeSlotCardProps {
  slot: TimeSlot;
  onDelete: (id: string) => void;
  onEdit: (slot: TimeSlot) => void;
}

const TimeSlotCard = ({ slot, onDelete, onEdit }: TimeSlotCardProps) => {
  const isWeekend = slot.day === 'saturday' || slot.day === 'sunday';
  const { toast } = useToast();
  
  const handleEditClick = () => {
    onEdit(slot);
    toast({
      title: "Editing Time Slot",
      description: `${slot.day} - ${slot.startTime} to ${slot.endTime}`,
    });
  };

  // Format time in 12-hour format
  const formatTime = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <Card className={cn(
      "h-full transition-all hover:shadow-md",
      isWeekend ? "border-l-4 border-l-theater-accent" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="capitalize text-sm font-medium">{slot.day}</span>
          </div>
          
          <div className="flex items-center text-theater-accent font-semibold">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-medium">${slot.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center p-4 bg-muted/30 rounded-md mb-4">
          <Clock className="h-5 w-5 mr-3 text-theater-secondary" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-semibold">{formatTime(slot.startTime)}</span>
            <span className="text-xs text-muted-foreground">to</span>
            <span className="text-lg font-semibold">{formatTime(slot.endTime)}</span>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" size="sm" onClick={handleEditClick} className="hover:bg-muted/50">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(slot.id)} className="hover:bg-destructive/10 text-destructive hover:text-destructive">
            <Trash className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotCard;
