
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppContext } from '@/context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Users, Calendar, Trophy, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Analytics = () => {
  const { centers, bookings, timeSlots } = useAppContext();

  // Calculate analytics data
  const totalRevenue = bookings
    .filter(booking => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + booking.totalAmount, 0);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed').length;
  const totalCustomers = new Set(bookings.map(booking => booking.customerPhone)).size;

  // Revenue by center
  const revenueByCenter = centers.map(center => {
    const centerBookings = bookings.filter(booking => 
      booking.centerId === center.id && booking.paymentStatus === 'paid'
    );
    const revenue = centerBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    return {
      name: center.name,
      revenue: revenue,
      bookings: centerBookings.length
    };
  });

  // Monthly revenue trend (last 6 months)
  const getMonthlyRevenue = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const monthlyBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.bookingTime);
        return bookingDate.getMonth() === date.getMonth() && 
               bookingDate.getFullYear() === date.getFullYear() &&
               booking.paymentStatus === 'paid';
      });
      
      const revenue = monthlyBookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
      
      months.push({
        month: monthName,
        revenue: revenue,
        bookings: monthlyBookings.length
      });
    }
    
    return months;
  };

  // Payment method distribution
  const paymentMethods = [
    { name: 'Cash', value: bookings.filter(b => b.paymentMethod === 'cash').length, color: '#8884d8' },
    { name: 'Card', value: bookings.filter(b => b.paymentMethod === 'card').length, color: '#82ca9d' },
    { name: 'UPI', value: bookings.filter(b => b.paymentMethod === 'upi').length, color: '#ffc658' },
  ];

  // Booking status distribution
  const bookingStatus = [
    { name: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: '#22c55e' },
    { name: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: '#f59e0b' },
    { name: 'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, color: '#ef4444' },
    { name: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: '#3b82f6' },
  ];

  const monthlyData = getMonthlyRevenue();

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">{confirmedBookings} confirmed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Unique customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Centers</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{centers.length}</div>
              <p className="text-xs text-muted-foreground">{timeSlots.length} total slots</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Center */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Center</CardTitle>
              <CardDescription>Performance comparison across centers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByCenter}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Distribution of payment preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethods}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Booking Status */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
              <CardDescription>Current status of all bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Center Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Center Performance</CardTitle>
            <CardDescription>Detailed breakdown by center</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueByCenter.map((center, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{center.name}</h3>
                    <p className="text-sm text-muted-foreground">{center.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${center.revenue.toFixed(2)}</p>
                    <Badge variant={center.revenue > 0 ? "default" : "secondary"}>
                      {center.revenue > 0 ? "Active" : "No Revenue"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Analytics;
