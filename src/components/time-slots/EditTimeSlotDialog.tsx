
import React from 'react';
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

const formSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
  price: z.number().min(0).or(z.string().regex(/^\d+(\.\d+)?$/).transform(Number)),
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
  React.useEffect(() => {
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
          <DialogTitle>Edit Time Slot</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
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

            <DialogFooter className="mt-6">
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
