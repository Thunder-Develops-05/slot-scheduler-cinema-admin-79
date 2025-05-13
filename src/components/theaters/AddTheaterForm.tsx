
import React from 'react';
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
import { Theater } from '@/types/theater';

const formSchema = z.object({
  name: z.string().min(2, 'Theater name must be at least 2 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  capacity: z.number().min(1, 'Capacity must be at least 1').or(z.string().regex(/^\d+$/).transform(Number)),
  screens: z.number().min(1, 'Number of screens must be at least 1').or(z.string().regex(/^\d+$/).transform(Number)),
});

interface AddTheaterFormProps {
  onSubmit: (theater: Theater) => void;
  initialData?: Theater;
  onCancel?: () => void;
}

const AddTheaterForm = ({ onSubmit, initialData, onCancel }: AddTheaterFormProps) => {
  const isEditing = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      location: '',
      capacity: 0, // Changed from string to number
      screens: 0, // Changed from string to number
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      id: initialData?.id || crypto.randomUUID(),
      name: values.name,
      location: values.location,
      capacity: Number(values.capacity),
      screens: Number(values.screens),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theater Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter theater name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seating Capacity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter capacity"
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="screens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Screens</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter number of screens"
                    {...field}
                    onChange={e => field.onChange(e.target.valueAsNumber || e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? 'Update Theater' : 'Add Theater'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddTheaterForm;
