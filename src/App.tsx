
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
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* User Routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<UserBooking />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<Index />} />
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
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
