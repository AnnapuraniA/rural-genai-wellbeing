
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SakhiDashboard from '@/components/dashboard/SakhiDashboard';

const SakhiDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'health_sakhi') {
    return <Navigate to="/dashboard" />;
  }

  return <SakhiDashboard />;
};

export default SakhiDashboardPage;
