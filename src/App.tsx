
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Centers from './pages/Centers';
import CenterOverview from './pages/CenterOverview';
import TimeSlots from './pages/TimeSlots';
import Overview from './pages/Overview';
import Analytics from './pages/Analytics';
import ManualBooking from './pages/ManualBooking';
import HolidayManagement from './pages/HolidayManagement';
import Theaters from './pages/Theaters';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import UserBooking from './pages/UserBooking';
import MyBookings from './pages/MyBookings';
import UserProfile from './pages/UserProfile';
import UserNotifications from './pages/UserNotifications';
import BookSlot from './pages/BookSlot';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BookingProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* User Routes */}
              <Route path="/" element={<PrivateRoute />}>
                <Route index element={<UserBooking />} />
              </Route>
              <Route path="/book" element={<PrivateRoute />}>
                <Route index element={<BookSlot />} />
              </Route>
              <Route path="/my-bookings" element={<PrivateRoute />}>
                <Route index element={<MyBookings />} />
              </Route>
              <Route path="/profile" element={<PrivateRoute />}>
                <Route index element={<UserProfile />} />
              </Route>
              <Route path="/notifications" element={<PrivateRoute />}>
                <Route index element={<UserNotifications />} />
              </Route>
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
              </Route>
              <Route path="/admin/centers" element={<AdminRoute />}>
                <Route index element={<Centers />} />
              </Route>
              <Route path="/admin/centers/:centerId" element={<AdminRoute />}>
                <Route index element={<CenterOverview />} />
              </Route>
              <Route path="/admin/centers/:centerId/time-slots" element={<AdminRoute />}>
                <Route index element={<TimeSlots />} />
              </Route>
              <Route path="/admin/centers/:centerId/manual-booking" element={<AdminRoute />}>
                <Route index element={<ManualBooking />} />
              </Route>
              <Route path="/admin/bookings" element={<AdminRoute />}>
                <Route index element={<AdminBookings />} />
              </Route>
              <Route path="/admin/overview" element={<AdminRoute />}>
                <Route index element={<Overview />} />
              </Route>
              <Route path="/admin/analytics" element={<AdminRoute />}>
                <Route index element={<Analytics />} />
              </Route>
              <Route path="/admin/holidays" element={<AdminRoute />}>
                <Route index element={<HolidayManagement />} />
              </Route>
              <Route path="/admin/theaters" element={<AdminRoute />}>
                <Route index element={<Theaters />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </BookingProvider>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
