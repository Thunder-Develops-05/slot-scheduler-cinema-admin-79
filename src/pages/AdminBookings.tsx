
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useBooking } from '@/context/BookingContext';
import { useAppContext } from '@/context/AppContext';
import { Search, Filter, Download, Eye, Phone, Mail } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminBookings = () => {
  const { bookings } = useBooking();
  const { getCenterById, getTimeSlotById } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const filteredBookings = bookings.filter(booking => {
    const center = getCenterById(booking.centerId);
    const matchesSearch = center?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportBookings = () => {
    const csv = [
      ['Booking ID', 'Center', 'Date', 'Time', 'Status', 'Amount', 'Contact'].join(','),
      ...filteredBookings.map(booking => {
        const center = getCenterById(booking.centerId);
        const timeSlot = getTimeSlotById(booking.timeSlotId);
        return [
          booking.id,
          center?.name || 'Unknown',
          format(new Date(booking.date), 'PP'),
          `${timeSlot?.startTime} - ${timeSlot?.endTime}`,
          booking.status,
          booking.amount,
          booking.contactNumber
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">Booking Management</h1>
            <p className="text-purple-600 mt-1">View and manage all cricket slot bookings</p>
          </div>
          <Button onClick={exportBookings} className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-purple-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by booking ID or center name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-purple-200"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-purple-200">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">
              All Bookings ({filteredBookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No bookings found matching your criteria</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-purple-200">
                      <th className="text-left p-3 font-semibold text-purple-800">Booking ID</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Center</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Date</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Time</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Status</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Amount</th>
                      <th className="text-left p-3 font-semibold text-purple-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => {
                      const center = getCenterById(booking.centerId);
                      const timeSlot = getTimeSlotById(booking.timeSlotId);
                      
                      return (
                        <tr key={booking.id} className="border-b border-purple-100 hover:bg-purple-50">
                          <td className="p-3 font-mono text-sm">{booking.id}</td>
                          <td className="p-3">{center?.name || 'Unknown Center'}</td>
                          <td className="p-3">{format(new Date(booking.date), 'PP')}</td>
                          <td className="p-3">
                            {timeSlot ? `${timeSlot.startTime} - ${timeSlot.endTime}` : 'Unknown Time'}
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="p-3 font-semibold">₹{booking.amount}</td>
                          <td className="p-3">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedBooking(booking)}
                                  className="border-purple-200 text-purple-600"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Booking Details</DialogTitle>
                                </DialogHeader>
                                {selectedBooking && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Booking ID</label>
                                        <p className="font-mono">{selectedBooking.id}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Status</label>
                                        <div className="mt-1">
                                          <Badge className={getStatusColor(selectedBooking.status)}>
                                            {selectedBooking.status}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Center</label>
                                        <p>{getCenterById(selectedBooking.centerId)?.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Date & Time</label>
                                        <p>{format(new Date(selectedBooking.date), 'PPP')}</p>
                                        <p className="text-sm text-gray-600">
                                          {getTimeSlotById(selectedBooking.timeSlotId)?.startTime} - 
                                          {getTimeSlotById(selectedBooking.timeSlotId)?.endTime}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Players</label>
                                        <p>{selectedBooking.playerCount}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Amount</label>
                                        <p className="font-semibold text-green-600">₹{selectedBooking.amount}</p>
                                      </div>
                                    </div>
                                    
                                    {selectedBooking.teamName && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Team Name</label>
                                        <p>{selectedBooking.teamName}</p>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Contact Information</label>
                                      <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-4 w-4 text-gray-500" />
                                          <span>{selectedBooking.contactNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Mail className="h-4 w-4 text-gray-500" />
                                          <span>{selectedBooking.userId}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {selectedBooking.specialRequests && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Special Requests</label>
                                        <p className="mt-1 p-3 bg-gray-50 rounded">{selectedBooking.specialRequests}</p>
                                      </div>
                                    )}
                                    
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Booking Time</label>
                                      <p>{format(new Date(selectedBooking.bookingTime), 'PPp')}</p>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminBookings;
