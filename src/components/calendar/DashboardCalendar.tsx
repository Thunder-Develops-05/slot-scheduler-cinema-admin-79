
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDay, DayStatus, useAppContext } from '@/context/AppContext';
import { format, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
// Import the correct types from react-day-picker
import { DayContentProps } from 'react-day-picker';

const DashboardCalendar = () => {
  const { calendarDays, addCalendarDay, removeCalendarDay } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [status, setStatus] = useState<DayStatus>('active');
  const [note, setNote] = useState('');

  const handleDayClick = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    // Check if this day already exists in our calendar
    const existingDay = calendarDays.find(d => 
      isSameDay(new Date(d.date), date)
    );
    
    if (existingDay) {
      setStatus(existingDay.status);
      setNote(existingDay.note || '');
    } else {
      setStatus('active');
      setNote('');
    }
    
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!selectedDate) return;
    
    const day: CalendarDay = {
      date: selectedDate.toISOString(),
      status: status,
      note: note.trim() || undefined
    };
    
    addCalendarDay(day);
    setIsDialogOpen(false);
  };

  const handleRemove = () => {
    if (!selectedDate) return;
    removeCalendarDay(selectedDate.toISOString());
    setIsDialogOpen(false);
  };

  // Custom day renderer for the calendar
  const renderDay = (props: DayContentProps) => {
    const { date, activeModifiers } = props;
    
    // Find if this day has a status
    const dayData = calendarDays.find(d => 
      isSameDay(new Date(d.date), date)
    );
    
    const isActive = dayData?.status === 'active';
    const isHoliday = dayData?.status === 'holiday';
    
    return (
      <div
        className={cn(
          "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
          isActive && "bg-green-100 text-green-900 hover:bg-green-200",
          isHoliday && "bg-red-100 text-red-900 hover:bg-red-200",
          !dayData && "text-gray-400"
        )}
      >
        {format(date, "d")}
        {dayData && (
          <div className="absolute bottom-0 left-0 right-0 h-1">
            <div 
              className={cn(
                "h-full w-full",
                isActive && "bg-green-500",
                isHoliday && "bg-red-500"
              )} 
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Theater Calendar</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1" />
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1" />
            <span className="text-sm">Holiday</span>
          </div>
        </div>
      </div>
      
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick}
        className="rounded-md border p-3 pointer-events-auto"
        components={{
          DayContent: renderDay
        }}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {selectedDate && format(selectedDate, "MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Day Status</Label>
              <RadioGroup
                value={status}
                onValueChange={(value) => setStatus(value as DayStatus)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="active" id="active" />
                  <Label htmlFor="active" className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="holiday" id="holiday" />
                  <Label htmlFor="holiday" className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
                    Holiday/Closed
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inactive" id="inactive" />
                  <Label htmlFor="inactive">Inactive (Default)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                placeholder="Add a note for this day..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            {calendarDays.some(d => 
              isSameDay(new Date(d.date), selectedDate || new Date())
            ) && (
              <Button
                variant="outline"
                onClick={handleRemove}
                className="mr-auto"
              >
                Reset to Default
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardCalendar;
