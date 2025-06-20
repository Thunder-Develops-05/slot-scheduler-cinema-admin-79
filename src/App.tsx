
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Centers from './pages/Centers';
import CenterOverview from './pages/CenterOverview';
import TimeSlots from './pages/TimeSlots';
import Overview from './pages/Overview';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import PrivateRoute from './components/auth/PrivateRoute';
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
            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Index />} />
            </Route>
            <Route path="/centers" element={<PrivateRoute />}>
              <Route index element={<Centers />} />
            </Route>
            <Route path="/centers/:centerId" element={<PrivateRoute />}>
              <Route index element={<CenterOverview />} />
            </Route>
            <Route path="/centers/:centerId/time-slots" element={<PrivateRoute />}>
              <Route index element={<TimeSlots />} />
            </Route>
            <Route path="/overview" element={<PrivateRoute />}>
              <Route index element={<Overview />} />
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
