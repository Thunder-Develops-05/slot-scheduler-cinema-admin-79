import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { ArrowLeft, MapPin, Users, Clock, Calendar, UserPlus } from 'lucide-react';

const CenterOverview = () => {
  const { centerId } = useParams<{ centerId: string }>();
  const { 
    getCenterById, 
    getTimeSlotsByCenterId, 
    getTodayBookingsForCenter, 
    getPaymentHistoryForCenter 
  } = useAppContext();
  const navigate = useNavigate();

  if (!centerId) {
    return <div>Center not found</div>;
  }

  const center = getCenterById(centerId);
  const timeSlots = getTimeSlotsByCenterId(centerId);
  const todayBookings = getTodayBookingsForCenter(centerId);
  const paymentHistory = getPaymentHistoryForCenter(centerId);

  if (!center) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Center not found</h2>
          <Button asChild>
            <Link to="/centers">Back to Centers</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long'
  }).toLowerCase() as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  
  const todaySlots = timeSlots.filter(slot => slot.day === today);
  const todayRevenue = todayBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const totalRevenue = paymentHistory.reduce((sum, booking) => sum + booking.totalAmount, 0);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/centers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Centers
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{center.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4" />
                {center.location}
              </p>
            </div>
          </div>
          <Button asChild>
            <Link to={`/centers/${centerId}/time-slots`}>
              Manage Time Slots
            </Link>
          </Button>
          <Button asChild>
            <Link to={`/centers/${centerId}/manual-booking`}>
              Manual Booking
            </Link>
          </Button>
        </div>

        {/* Center Details */}
        <Card>
          <CardHeader>
            <CardTitle>Center Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Capacity:</strong> {center.capacity} people
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Courts:</strong> {center.courts}
                </span>
              </div>
              {center.contactNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Contact:</strong> {center.contactNumber}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Badge variant={center.isActive ? "default" : "secondary"}>
                  {center.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            {center.description && (
              <p className="mt-4 text-sm text-muted-foreground">{center.description}</p>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{todayRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                From {todayBookings.length} bookings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                All time earnings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Time Slots</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{timeSlots.length}</div>
              <p className="text-xs text-muted-foreground">
                Total configured slots
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Time Slots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Time Slots ({today.charAt(0).toUpperCase() + today.slice(1)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaySlots.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No time slots configured for today
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {todaySlots.map((slot) => {
                  const slotBookings = todayBookings.filter(b => b.slotId === slot.id);
                  const isBooked = slotBookings.length > 0;
                  
                  return (
                    <Card key={slot.id} className={`${isBooked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <Badge variant={isBooked ? "default" : "secondary"}>
                            {isBooked ? "Booked" : "Available"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{slot.price}
                        </div>
                        {isBooked && slotBookings[0] && (
                          <div className="mt-2 text-xs">
                            <p><strong>Customer:</strong> {slotBookings[0].customerName}</p>
                            <p><strong>People:</strong> {slotBookings[0].numberOfPeople}</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No payment history available
              </p>
            ) : (
              <div className="space-y-4">
                {paymentHistory.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.date).toLocaleDateString()} • {booking.numberOfPeople} people
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{booking.totalAmount}</p>
                      <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CenterOverview;
