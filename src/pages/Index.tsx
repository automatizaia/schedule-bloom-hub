
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [isAuthenticated, loading, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20">
      <div className="text-center">
        <div className="animate-pulse">Redirecionando...</div>
      </div>
    </div>
  );
};

export default Index;
