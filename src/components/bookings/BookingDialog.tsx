
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSlot, Booking } from '@/types/timeSlot';
import { formatTimeRange } from '@/utils/timeSlotUtils';
import { format } from 'date-fns';
import { useAppContext } from '@/context/AppContext';

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  customerEmail: z.string().email('Invalid email address').optional().or(z.literal('')),
  numberOfPeople: z.number().min(1, 'At least 1 person required').max(50, 'Maximum 50 people'),
  paymentMethod: z.enum(['cash', 'card', 'upi']),
  paymentStatus: z.enum(['paid', 'pending']),
  notes: z.string().optional(),
});

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot;
  selectedDate: Date;
  centerId: string;
}

const BookingDialog = ({ isOpen, onClose, slot, selectedDate, centerId }: BookingDialogProps) => {
  const { addBooking } = useAppContext();

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      numberOfPeople: 1,
      paymentMethod: 'cash',
      paymentStatus: 'paid',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof bookingSchema>) => {
    const totalAmount = values.numberOfPeople * slot.price;
    
    const booking: Booking = {
      id: crypto.randomUUID(),
      slotId: slot.id,
      centerId: centerId,
      customerName: values.customerName,
      customerPhone: values.customerPhone,
      customerEmail: values.customerEmail || undefined,
      date: format(selectedDate, 'yyyy-MM-dd'),
      numberOfPeople: values.numberOfPeople,
      totalAmount: totalAmount,
      status: 'confirmed',
      paymentStatus: values.paymentStatus,
      paymentMethod: values.paymentMethod,
      bookingTime: new Date().toISOString(),
      notes: values.notes || undefined,
    };

    addBooking(booking);
    onClose();
    form.reset();
  };

  const totalAmount = form.watch('numberOfPeople') * slot.price;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Time Slot</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Date:</span>
              <p>{format(selectedDate, 'PPP')}</p>
            </div>
            <div>
              <span className="font-medium">Time:</span>
              <p>{formatTimeRange(slot.startTime, slot.endTime)}</p>
            </div>
            <div>
              <span className="font-medium">Price per person:</span>
              <p>${slot.price}</p>
            </div>
            <div>
              <span className="font-medium">Total Amount:</span>
              <p className="text-lg font-semibold">${totalAmount}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="numberOfPeople"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of People *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="1" 
                      max="50"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any additional notes..."
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
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm Booking (${totalAmount})
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
