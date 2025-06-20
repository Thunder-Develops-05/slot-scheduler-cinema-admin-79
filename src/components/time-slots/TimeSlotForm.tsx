import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { TimeSlot } from '@/types/timeSlot';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { generateTimeSlots } from '@/utils/timeSlotUtils';

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const formSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  interval: z.number().min(30).or(z.string().regex(/^\d+$/).transform(Number)),
  price: z.number().min(0).or(z.string().regex(/^\d+(\.\d+)?$/).transform(Number)),
  applyToWeekend: z.boolean().default(false),
  applyToWeekday: z.boolean().default(false),
});

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

interface TimeSlotFormProps {
  centerId: string;
  onSubmit: (slots: TimeSlot[]) => void;
  onCancel: () => void;
}

const TimeSlotForm = ({ centerId, onSubmit, onCancel }: TimeSlotFormProps) => {
  const [selectedDays, setSelectedDays] = useState<Day[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: '09:00',
      endTime: '23:00',
      interval: 120,
      price: 10,
      applyToWeekend: false,
      applyToWeekday: false,
    },
  });

  const handleDayToggle = (day: Day) => {
    setSelectedDays((prev) => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  };

  const handleApplyToWeekday = (value: boolean) => {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as Day[];
    
    if (value) {
      // Add all weekdays that aren't already selected
      setSelectedDays((prev) => {
        const newDays = new Set<Day>([...prev]);
        weekdays.forEach(day => newDays.add(day));
        return Array.from(newDays);
      });
    } else {
      // Remove all weekdays
      setSelectedDays((prev) => prev.filter(day => !weekdays.includes(day)));
    }
    
    form.setValue('applyToWeekday', value);
  };

  const handleApplyToWeekend = (value: boolean) => {
    const weekend = ['saturday', 'sunday'] as Day[];
    
    if (value) {
      // Add weekend days that aren't already selected
      setSelectedDays((prev) => {
        const newDays = new Set<Day>([...prev]);
        weekend.forEach(day => newDays.add(day));
        return Array.from(newDays);
      });
    } else {
      // Remove weekend days
      setSelectedDays((prev) => prev.filter(day => !weekend.includes(day)));
    }
    
    form.setValue('applyToWeekend', value);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (selectedDays.length === 0) {
      form.setError('startTime', { 
        type: 'manual', 
        message: 'Please select at least one day of the week' 
      });
      return;
    }

    // Generate time slots for each selected day
    const allSlots = generateTimeSlots({
      centerId,
      days: selectedDays,
      startTime: values.startTime,
      endTime: values.endTime,
      intervalMinutes: Number(values.interval),
      price: Number(values.price)
    });

    onSubmit(allSlots);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Select Days</h3>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <FormField
              control={form.control}
              name="applyToWeekday"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormLabel>Apply to all weekdays</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={handleApplyToWeekday}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="applyToWeekend"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormLabel>Apply to weekend</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={handleApplyToWeekend}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-4">
            {daysOfWeek.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={selectedDays.includes(day.value as Day) ? "default" : "outline"}
                className="h-auto py-2"
                onClick={() => handleDayToggle(day.value as Day)}
              >
                {day.label.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="range">
          <TabsList className="mb-4">
            <TabsTrigger value="range">Time Range</TabsTrigger>
            <TabsTrigger value="custom">Custom Slots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="range" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval (minutes)</FormLabel>
                  <Select 
                    onValueChange={value => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                      <SelectItem value="90">90 minutes (1.5 hours)</SelectItem>
                      <SelectItem value="120">120 minutes (2 hours)</SelectItem>
                      <SelectItem value="150">150 minutes (2.5 hours)</SelectItem>
                      <SelectItem value="180">180 minutes (3 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="bg-muted/50 p-4 rounded-md">
              <p>Custom slot creation coming soon.</p>
              <p className="text-sm text-muted-foreground">For now, please use the Time Range tab to generate slots.</p>
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Price ($)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Generate Time Slots
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TimeSlotForm;
