
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { useBooking } from '@/context/BookingContext';
import { Target, Users, DollarSign, Calendar, TrendingUp, Download } from 'lucide-react';

const AdminDashboard = () => {
  const { centers, timeSlots } = useAppContext();
  const { bookings } = useBooking();

  // Sample data for charts
  const dailyBookingsData = [
    { day: 'Mon', bookings: 12, revenue: 6000 },
    { day: 'Tue', bookings: 8, revenue: 4000 },
    { day: 'Wed', bookings: 15, revenue: 7500 },
    { day: 'Thu', bookings: 20, revenue: 10000 },
    { day: 'Fri', bookings: 25, revenue: 12500 },
    { day: 'Sat', bookings: 30, revenue: 15000 },
    { day: 'Sun', bookings: 28, revenue: 14000 },
  ];

  const slotUtilizationData = [
    { name: 'Morning', value: 35, color: '#8B5CF6' },
    { name: 'Afternoon', value: 25, color: '#A78BFA' },
    { name: 'Evening', value: 30, color: '#C4B5FD' },
    { name: 'Night', value: 10, color: '#DDD6FE' },
  ];

  const totalRevenue = dailyBookingsData.reduce((sum, data) => sum + data.revenue, 0);
  const totalBookings = dailyBookingsData.reduce((sum, data) => sum + data.bookings, 0);
  const avgBookingValue = totalRevenue / totalBookings;

  const exportData = (format: 'csv' | 'pdf') => {
    // Simulate export functionality
    console.log(`Exporting data as ${format.toUpperCase()}`);
    alert(`Data exported as ${format.toUpperCase()}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
            <p className="text-purple-600 mt-1">Cricket center management overview</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => exportData('csv')}
              className="border-purple-200 text-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportData('pdf')}
              className="border-purple-200 text-purple-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Centers</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{centers.length}</div>
              <Badge className="bg-green-100 text-green-800 mt-2">Active</Badge>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{totalBookings}</div>
              <p className="text-xs text-green-600 mt-2">↗ +12% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-600 mt-2">↗ +8% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Avg Booking Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">₹{avgBookingValue.toFixed(0)}</div>
              <p className="text-xs text-green-600 mt-2">↗ +5% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Bookings Chart */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Daily Bookings & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#F3F4F6', 
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="bookings" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Slot Utilization Chart */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">Slot Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={slotUtilizationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {slotUtilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyBookingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#F3F4F6', 
                    border: '1px solid #D1D5DB',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New booking', details: 'SportZone - Court 1', time: '5 min ago', type: 'booking' },
                { action: 'Payment received', details: '₹500 from user@example.com', time: '12 min ago', type: 'payment' },
                { action: 'Booking cancelled', details: 'Cricket Arena - Court 2', time: '1 hour ago', type: 'cancellation' },
                { action: 'New user registered', details: 'john.doe@example.com', time: '2 hours ago', type: 'user' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800">{activity.action}</p>
                    <p className="text-sm text-purple-600">{activity.details}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${
                        activity.type === 'booking' ? 'border-green-200 text-green-700' :
                        activity.type === 'payment' ? 'border-blue-200 text-blue-700' :
                        activity.type === 'cancellation' ? 'border-red-200 text-red-700' :
                        'border-purple-200 text-purple-700'
                      }`}
                    >
                      {activity.type}
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

export default AdminDashboard;
