
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  return <Navigate to="/" replace />;
};

export default Index;
