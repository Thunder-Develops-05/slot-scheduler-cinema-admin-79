
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppContext } from '@/context/AppContext';
import { formatTimeRange } from '@/utils/timeSlotUtils';

const Overview = () => {
  const { theaters, timeSlots, getTimeSlotsByTheaterId } = useAppContext();

  const getSlotsCountForDay = (theaterId: string, day: string) => {
    return timeSlots.filter(slot => slot.theaterId === theaterId && slot.day === day).length;
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>

        {theaters.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-lg font-medium mb-2">No data available</h3>
            <p className="text-muted-foreground">Add theaters and time slots to view the overview.</p>
          </div>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Theater</TableHead>
                      {days.map((day) => (
                        <TableHead key={day} className="capitalize text-center">
                          {day.slice(0, 3)}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {theaters.map((theater) => {
                      const theaterSlots = getTimeSlotsByTheaterId(theater.id);
                      return (
                        <TableRow key={theater.id}>
                          <TableCell className="font-medium">{theater.name}</TableCell>
                          {days.map((day) => {
                            const count = getSlotsCountForDay(theater.id, day);
                            return (
                              <TableCell key={`${theater.id}-${day}`} className="text-center">
                                {count > 0 ? count : '-'}
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right">
                            {theaterSlots.length}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {theaters.map((theater) => {
              const theaterSlots = getTimeSlotsByTheaterId(theater.id);
              if (theaterSlots.length === 0) return null;
              
              return (
                <Card key={theater.id}>
                  <CardHeader>
                    <CardTitle>{theater.name} - Detailed Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Day</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {theaterSlots.map((slot) => (
                          <TableRow key={slot.id}>
                            <TableCell className="capitalize">{slot.day}</TableCell>
                            <TableCell>{formatTimeRange(slot.startTime, slot.endTime)}</TableCell>
                            <TableCell className="text-right">${slot.price.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Overview;
