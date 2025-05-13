
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { TimeSlot } from '@/types/timeSlot';
import { Clock, DollarSign, Calendar } from 'lucide-react';

const formSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  price: z.number().min(0, "Price cannot be negative").or(z.string().regex(/^\d+(\.\d+)?$/, "Invalid price format").transform(Number)),
});

interface EditTimeSlotDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  onSave: (updatedSlot: TimeSlot) => void;
}

const EditTimeSlotDialog = ({ isOpen, onClose, slot, onSave }: EditTimeSlotDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startTime: slot?.startTime || '',
      endTime: slot?.endTime || '',
      price: slot?.price || 0,
    },
  });

  // Update form when slot changes
  useEffect(() => {
    if (slot) {
      form.reset({
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
      });
    }
  }, [slot, form]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (!slot) return;
    
    onSave({
      ...slot,
      startTime: values.startTime,
      endTime: values.endTime,
      price: Number(values.price),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" /> 
            Edit Time Slot
          </DialogTitle>
        </DialogHeader>
        
        {slot && (
          <div className="py-2">
            <div className="flex items-center mb-2">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="capitalize font-medium">{slot.day}</span>
            </div>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        {...field} 
                        className="focus-within:ring-1 focus-within:ring-theater-accent"
                      />
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
                      <Input 
                        type="time" 
                        {...field} 
                        className="focus-within:ring-1 focus-within:ring-theater-accent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Price
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)} 
                      className="focus-within:ring-1 focus-within:ring-theater-accent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTimeSlotDialog;
