
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Theaters from './pages/Theaters';
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
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Index />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/theaters" 
              element={
                <PrivateRoute>
                  <Theaters />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/theaters/:theaterId/time-slots" 
              element={
                <PrivateRoute>
                  <TimeSlots />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/overview" 
              element={
                <PrivateRoute>
                  <Overview />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
