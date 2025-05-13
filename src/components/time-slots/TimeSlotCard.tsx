
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Clock, DollarSign, Calendar, Edit, Trash } from 'lucide-react';
import { TimeSlot } from '@/types/timeSlot';
import { cn } from '@/lib/utils';

interface TimeSlotCardProps {
  slot: TimeSlot;
  onDelete: (id: string) => void;
  onEdit: (slot: TimeSlot) => void;
}

const TimeSlotCard = ({ slot, onDelete, onEdit }: TimeSlotCardProps) => {
  const isWeekend = slot.day === 'saturday' || slot.day === 'sunday';
  
  return (
    <Card className={cn(
      "h-full transition-all hover:shadow-md",
      isWeekend ? "border-l-4 border-l-theater-accent" : ""
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="capitalize text-sm font-medium">{slot.day}</span>
          </div>
          
          <div className="flex items-center text-theater-accent">
            <DollarSign className="h-4 w-4 mr-1" />
            <span className="font-medium">{slot.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-3">
          <Clock className="h-5 w-5 mr-2 text-theater-secondary" />
          <span className="text-lg font-semibold">{slot.startTime} - {slot.endTime}</span>
        </div>
        
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(slot)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(slot.id)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSlotCard;
