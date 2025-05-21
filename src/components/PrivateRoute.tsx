
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, show the protected route
  return <Outlet />;
};

export default PrivateRoute;
