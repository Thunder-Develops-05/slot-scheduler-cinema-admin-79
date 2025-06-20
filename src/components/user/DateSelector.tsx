
import React from 'react';
import { format, addDays, startOfToday, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateSelect }: DateSelectorProps) => {
  const today = startOfToday();
  const dates = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  const scrollContainer = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <Card className="p-4 bg-white border-purple-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <CalendarDays className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-800">Select Date</h3>
      </div>
      
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-purple-50 text-purple-600 shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div 
          ref={scrollContainer}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-8 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {dates.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            
            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={`flex-shrink-0 flex flex-col items-center p-3 h-auto min-w-[80px] ${
                  isSelected 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'border-purple-200 hover:bg-purple-50 text-purple-700'
                } ${isToday ? 'ring-2 ring-purple-300' : ''}`}
                onClick={() => onDateSelect(date)}
              >
                <span className="text-xs font-medium">
                  {format(date, 'EEE')}
                </span>
                <span className="text-lg font-bold">
                  {format(date, 'd')}
                </span>
                <span className="text-xs">
                  {format(date, 'MMM')}
                </span>
                {isToday && (
                  <span className="text-xs bg-purple-100 text-purple-600 px-1 rounded mt-1">
                    Today
                  </span>
                )}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-purple-50 text-purple-600 shadow-md"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default DateSelector;
