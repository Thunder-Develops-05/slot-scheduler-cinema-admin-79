
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, Clock, Users, Target, Phone, MapPin, Settings, Calendar, DollarSign } from 'lucide-react';
import { formatTime } from '@/utils/timeSlotUtils';

const CenterOverview = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const { 
    getCenterById, 
    getTimeSlotsByCenterId, 
    getTodayBookingsForCenter, 
    getPaymentHistoryForCenter 
  } = useAppContext();

  if (!centerId) {
    return <div>Center not found</div>;
  }

  const center = getCenterById(centerId);
  const allTimeSlots = getTimeSlotsByCenterId(centerId);
  const todayBookings = getTodayBookingsForCenter(centerId);
  const paymentHistory = getPaymentHistoryForCenter(centerId);

  if (!center) {
    return <div>Center not found</div>;
  }

  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' }) as any;
  const todaySlots = allTimeSlots.filter(slot => slot.day === today);

  // Get slot booking status
  const getSlotStatus = (slotId: string) => {
    const booking = todayBookings.find(b => b.slotId === slotId);
    if (!booking) return { status: 'available', booking: null };
    return { status: booking.status, booking };
  };

  const totalRevenue = paymentHistory.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const todayRevenue = todayBookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          <div>
            <Link 
              to="/centers" 
              className="flex items-center text-sm text-green-600 hover:text-green-700 mb-4 transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Centers
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{center.name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{center.location}</span>
                </div>
                {center.contactNumber && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{center.contactNumber}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Users className="h-3 w-3 mr-1" />
                {center.capacity} people
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                <Target className="h-3 w-3 mr-1" />
                {center.courts} courts
              </Badge>
              <Badge variant={center.isActive ? "default" : "secondary"}>
                {center.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to={`/centers/${centerId}/time-slots`}>
              <Button 
                variant="outline"
                className="border-green-200 text-green-600 hover:bg-green-50"
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Time Slots
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Today's Revenue</p>
                  <p className="text-2xl font-bold text-green-700">₹{todayRevenue}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-700">₹{totalRevenue}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Today's Bookings</p>
                  <p className="text-2xl font-bold text-purple-700">{todayBookings.length}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Available Slots</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {todaySlots.filter(slot => !todayBookings.find(b => b.slotId === slot.id)).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Time Slots */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Calendar className="h-5 w-5" />
              Today's Time Slots ({new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No time slots configured for today.</p>
                <Link to={`/centers/${centerId}/time-slots`}>
                  <Button variant="outline" className="mt-4">
                    Add Time Slots
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {todaySlots.map((slot) => {
                  const slotStatus = getSlotStatus(slot.id);
                  return (
                    <Card key={slot.id} className={`border-2 ${
                      slotStatus.status === 'available' ? 'border-green-200 bg-green-50' :
                      slotStatus.status === 'confirmed' ? 'border-blue-200 bg-blue-50' :
                      slotStatus.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                      'border-gray-200 bg-gray-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </p>
                            <p className="text-sm text-gray-600">₹{slot.price}</p>
                          </div>
                          <Badge variant={
                            slotStatus.status === 'available' ? 'default' :
                            slotStatus.status === 'confirmed' ? 'default' :
                            slotStatus.status === 'pending' ? 'secondary' :
                            'secondary'
                          } className={
                            slotStatus.status === 'available' ? 'bg-green-500' :
                            slotStatus.status === 'confirmed' ? 'bg-blue-500' :
                            slotStatus.status === 'pending' ? 'bg-yellow-500' :
                            'bg-gray-500'
                          }>
                            {slotStatus.status === 'available' ? 'Available' : 
                             slotStatus.status === 'confirmed' ? 'Booked' :
                             slotStatus.status === 'pending' ? 'Pending' :
                             'Cancelled'}
                          </Badge>
                        </div>
                        {slotStatus.booking && (
                          <div className="text-xs text-gray-600">
                            <p><strong>{slotStatus.booking.customerName}</strong></p>
                            <p>{slotStatus.booking.numberOfPeople} people</p>
                            <p>{slotStatus.booking.customerPhone}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <DollarSign className="h-5 w-5" />
              Recent Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No payment history available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div>
                      <p className="font-semibold text-gray-800">{booking.customerName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.date).toLocaleDateString()} • {booking.numberOfPeople} people
                      </p>
                      <p className="text-xs text-gray-500">{booking.customerPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">₹{booking.totalAmount}</p>
                      <p className="text-xs text-gray-500 capitalize">{booking.paymentMethod}</p>
                      <Badge variant="default" className="bg-green-500 text-xs">
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                {paymentHistory.length > 10 && (
                  <p className="text-center text-gray-500 text-sm">
                    Showing recent 10 transactions out of {paymentHistory.length} total
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CenterOverview;
