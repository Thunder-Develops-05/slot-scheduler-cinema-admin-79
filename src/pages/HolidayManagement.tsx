
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAppContext } from '@/context/AppContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const holidaySchema = z.object({
  name: z.string().min(1, 'Holiday name is required'),
  note: z.string().optional(),
});

const HolidayManagement = () => {
  const { calendarDays, addCalendarDay, removeCalendarDay } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof holidaySchema>>({
    resolver: zodResolver(holidaySchema),
    defaultValues: {
      name: '',
      note: '',
    },
  });

  const holidays = calendarDays.filter(day => day.status === 'holiday');

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const dateString = format(date, 'yyyy-MM-dd');
    const existingHoliday = calendarDays.find(day => day.date === dateString);
    
    if (existingHoliday && existingHoliday.status === 'holiday') {
      // If it's already a holiday, show delete confirmation
      setHolidayToDelete(dateString);
    } else {
      // If it's not a holiday, open add dialog
      setIsAddHolidayOpen(true);
    }
  };

  const handleAddHoliday = (values: z.infer<typeof holidaySchema>) => {
    if (!selectedDate) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    addCalendarDay({
      date: dateString,
      status: 'holiday',
      note: `${values.name}${values.note ? ` - ${values.note}` : ''}`,
    });
    
    setIsAddHolidayOpen(false);
    setSelectedDate(undefined);
    form.reset();
  };

  const confirmDeleteHoliday = () => {
    if (holidayToDelete) {
      removeCalendarDay(holidayToDelete);
      setHolidayToDelete(null);
    }
  };

  const getHolidayInfo = (dateString: string) => {
    const holiday = calendarDays.find(day => day.date === dateString && day.status === 'holiday');
    return holiday?.note || 'Holiday';
  };

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Holiday Management</h1>
            <p className="text-muted-foreground">Manage holidays and special dates for your centers</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Calendar Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Holiday Calendar
              </CardTitle>
              <CardDescription>
                Click on a date to add or remove holidays
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                modifiers={{
                  holiday: (date) => {
                    const dateString = format(date, 'yyyy-MM-dd');
                    return calendarDays.some(day => day.date === dateString && day.status === 'holiday');
                  }
                }}
                modifiersStyles={{
                  holiday: {
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
                className="rounded-md border w-full"
              />
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Holiday dates</span>
              </div>
            </CardContent>
          </Card>

          {/* Holiday List */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Holidays</CardTitle>
              <CardDescription>
                {holidays.length === 0 
                  ? 'No holidays scheduled'
                  : `${holidays.length} holiday${holidays.length > 1 ? 's' : ''} scheduled`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {holidays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No holidays scheduled</p>
                  <p className="text-sm">Click on the calendar to add holidays</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {holidays
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((holiday) => (
                      <div
                        key={holiday.date}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="font-medium">
                            {format(new Date(holiday.date), 'PPP')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {holiday.note || 'Holiday'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Holiday</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setHolidayToDelete(holiday.date)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Holiday Impact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Holiday Impact</CardTitle>
            <CardDescription>How holidays affect your booking system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-destructive">Booking Restrictions</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No time slots will be available for booking on holiday dates
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-blue-600">Calendar Display</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Holiday dates will be highlighted in red on all calendars
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium text-green-600">Staff Notification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Staff will see holiday notifications in the booking system
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Holiday Dialog */}
      <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[400px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Holiday</DialogTitle>
          </DialogHeader>
          
          {selectedDate && (
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Selected Date:</p>
              <p className="text-lg font-semibold">{format(selectedDate, 'PPP')}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddHoliday)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Holiday Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Christmas, Diwali, Independence Day" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional information about this holiday..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddHolidayOpen(false);
                    setSelectedDate(undefined);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Holiday
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Holiday Confirmation */}
      <AlertDialog open={!!holidayToDelete} onOpenChange={() => setHolidayToDelete(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Holiday</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this holiday? This will allow bookings on this date again.
              {holidayToDelete && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{format(new Date(holidayToDelete), 'PPP')}</strong>
                  <br />
                  <span className="text-sm">{getHolidayInfo(holidayToDelete)}</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteHoliday}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground"
            >
              Remove Holiday
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default HolidayManagement;
