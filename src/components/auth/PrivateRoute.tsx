
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect admin users to admin area
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Outlet />;
};

export default PrivateRoute;
